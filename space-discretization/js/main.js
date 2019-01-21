/*
Written by Mina Pecheux in January 2019.
FEM space discretizor.

The script has 2 steps:
- init(): initialize the Three JS scene 3D components
- runLoop(): start main update function

Functions are quite self-explanatory, hopefully.

*/

/** UTIL FUNCTIONS **/
// degree to radian conversion
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
}

/** VARIABLES **/
// standard Three WebGL global variables
var container, scene, camera, renderer, controls;
var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
var projector, INTERSECTED;
var mouse = {
    x: 0,
    y: 0
};
var CAM_AZIMUT = Math.radians(45);
var CAM_DECLINATION = Math.radians(-60);

// general variables
var _cam_clipping_planes = { near: 0.1, far: 2000 };
var _cam_size = 300;

var _point_size = 0.1;
var _point_def = 20; // nb of segments in geometry
var _hover_color = 0xff0000;
var _text_offset = 0.2;
var _mesh_bound;
var _mesh_centroid;

var _show_dims;
var _show_type;

var _hovered_label = null;

// scene elements references (for post-creation update, description association...)
var _points = [], _triangles = [], _squares = [], _tetrahedrons = [], _cubes = [];
var _triEdges = [], _sqEdges = [], _tetEdges = [], _cuEdges = [];
var _cameraVisibilityHorizon;

// returns the centroid of the mesh and its longest dimension (x, y or z)
// (where the mesh is defined from its points)
function get_bounds(points) {
    let x_min, x_max, y_min, y_max;
    x_min = points[0][0];
    x_max = points[0][0];
    y_min = points[0][1];
    y_max = points[0][1];
    z_min = points[0][2];
    z_max = points[0][2];
    for (let i = 1; i < points.length; i++) {
        let p = points[i];
        if (p[0] < x_min) x_min = p[0];
        else if (p[0] > x_max) x_max = p[0];
        if (p[1] < y_min) y_min = p[1];
        else if (p[1] > y_max) y_max = p[1];
        if (p[2] < z_min) z_min = p[2];
        else if (p[2] > z_max) z_max = p[2];
    }
    let dx = x_max - x_min;
    let dy = y_max - y_min;
    let dz = z_max - z_min;
    let c = { x: x_min + dx / 2, y: y_min + dy / 2, z: z_min + dz / 2 };
    if (dx > dy && dx > dz) return [dx, c];
    if (dy > dx && dy > dz) return [dy, c];
    if (dz > dx && dz > dy) return [dx, c];
    return [dx, c]; // default
}

/** EVENT FUNCTIONS **/
$(document).mousemove(function(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
})

// $(document).click(function(event) {
//     if (INTERSECTED !== null)
//         set_func_displayer(_points.indexOf(INTERSECTED));
//     else if (func_displayer !== undefined && func_displayer !== null) {
//         cancel_removal = false;
//         // if on a button: don't destroy the object immediately!
//         $('.basefunc-btn').each(function() {
//             let pos = $(this).position();
//             if(pos.left <= mouse.x && mouse.x <= pos.left + $(this).width()
//                 && pos.top <= mouse.y && mouse.y <= pos.top + $(this).height()) {
//                 cancel_removal = true;
//                 return;
//             }
//         });
//         if (!cancel_removal) {
//             scene.remove(func_displayer.main);
//             scene.remove(func_displayer.edges);
//             func_displayer = null;
//         }
//     }
// })

function onWindowResize() {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    camera.left = -SCREEN_WIDTH / _cam_size;
    camera.right = SCREEN_WIDTH / _cam_size;
    camera.top = -SCREEN_HEIGHT / _cam_size;
    camera.bottom = SCREEN_HEIGHT / _cam_size;
    camera.updateProjectionMatrix();
}

/** ELEMENTS MANAGEMENT FUNCTIONS **/
// create point anywhere in space at given cartesian coordinates
function add_point(x, y, z, label='', ptColor=0xffffff) {
    let geometry = new THREE.SphereGeometry(_point_size, _point_def, _point_def);
    let material = new THREE.MeshLambertMaterial({
        emissive: ptColor, side: THREE.BackSide
    });
    let point = new THREE.Mesh(geometry, material);
    point.position.set(x, -y, z); // vertical axis seems to be inverted...
    scene.add(point);
    _points.push(point);
    
    // add label
    let text = document.createElement('div');
    text.className = 'point-label';
    text.innerHTML = _points.length;
    
    let label_world_pos; // positionate label "outside" of vertex (with respect to the centroid of the mesh)
    if (!(x == _mesh_centroid.x && y == _mesh_centroid.y && z == _mesh_centroid.z)) {
        let d = { x: _mesh_centroid.x - x, y: _mesh_centroid.y - y, z: _mesh_centroid.z - z };
        let c = (1 + _text_offset);
        label_world_pos = {
            x: _mesh_centroid.x - c*d.x,
            y: _mesh_centroid.y - c*d.y,
            z: _mesh_centroid.z - c*d.z
        };
    }
    else label_world_pos = { x: _mesh_centroid.x + _text_offset, y: _mesh_centroid.y, z: _mesh_centroid.z };
    let lpos = new THREE.Vector3(label_world_pos.x, label_world_pos.y, label_world_pos.z);
    text.setAttribute('data-point-pos', x + '/' + -y + '/' + z);
    text.setAttribute('data-pos', lpos.x + '/' + -lpos.y + '/' + lpos.z);
    let label_screen_pos = lpos.project(camera);
    label_screen_pos.x = (label_screen_pos.x + 1) * 0.5 * SCREEN_WIDTH;
    label_screen_pos.y = (label_screen_pos.y - 1) * 0.5 * SCREEN_HEIGHT;
    text.style.left = label_screen_pos.x + 'px';
    text.style.top = -label_screen_pos.y + 'px';
    text.style.visibility = 'hidden';
    container.appendChild(text);
}

// create a triangle from 3 vertices
function add_triangle(p1, p2, p3) {
    let v1 = _points[p1].position;
    let v2 = _points[p2].position;
    let v3 = _points[p3].position;

    // create new geometry
    let geometry = new THREE.Geometry();
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.faces.push(new THREE.Face3(0, 1, 2));
    // compute normals
    geometry.computeVertexNormals();
    // add mesh to scene
    let triangle = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
        emissive: 0xffffff, transparent: true, opacity: 0.7, side: THREE.DoubleSide
    }));
    scene.add(triangle);
    _triangles.push(triangle);
    let egeom = new THREE.EdgesGeometry(geometry);
    let edges = new THREE.LineSegments(egeom, new THREE.LineBasicMaterial({
        color: 0x000000
    }));
    scene.add(edges);
    _triEdges.push(edges);
}

// create a tetrahedron from 4 vertices (4th vertex is the "top")
function add_tetrahedron(p1, p2, p3, p4) {
    let v1 = _points[p1].position;
    let v2 = _points[p2].position;
    let v3 = _points[p3].position;
    let v4 = _points[p4].position;

    // create new geometry
    let geometry = new THREE.Geometry();
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.vertices.push(v4);
    geometry.faces.push(new THREE.Face3(0, 1, 2));
    geometry.faces.push(new THREE.Face3(0, 1, 3));
    geometry.faces.push(new THREE.Face3(1, 2, 3));
    geometry.faces.push(new THREE.Face3(0, 2, 3));
    // compute normals
    geometry.computeVertexNormals();
    // add mesh to scene
    let tetrahedron = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
        emissive: 0xffffff, transparent: true, opacity: 0.7, side: THREE.DoubleSide
    }));
    scene.add(tetrahedron);
    _tetrahedrons.push(tetrahedron);
    let egeom = new THREE.EdgesGeometry(geometry);
    let edges = new THREE.LineSegments(egeom, new THREE.LineBasicMaterial({
        color: 0x000000
    }));
    scene.add(edges);
    _tetEdges.push(edges);
}

// create a square from 4 vertices
function add_square(p1, p2, p3, p4) {
    let v1 = _points[p1].position;
    let v2 = _points[p2].position;
    let v3 = _points[p3].position;
    let v4 = _points[p4].position;

    // create new geometry
    let geometry = new THREE.Geometry();
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.vertices.push(v4);
    geometry.faces.push(new THREE.Face3(0, 1, 3));
    geometry.faces.push(new THREE.Face3(1, 2, 3));
    // compute normals
    geometry.computeVertexNormals();
    // add mesh to scene
    let square = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
        emissive: 0xffffff, transparent: true, opacity: 0.7, side: THREE.DoubleSide
    }));
    scene.add(square);
    _squares.push(square);
    let egeom = new THREE.EdgesGeometry(geometry);
    let edges = new THREE.LineSegments(egeom, new THREE.LineBasicMaterial({
        color: 0x000000
    }));
    scene.add(edges);
    _sqEdges.push(edges);
}

// create a cube from 8 vertices
function add_cube(p1, p2, p3, p4, p5, p6, p7, p8) {
    let v1 = _points[p1].position;
    let v2 = _points[p2].position;
    let v3 = _points[p3].position;
    let v4 = _points[p4].position;
    let v5 = _points[p5].position;
    let v6 = _points[p6].position;
    let v7 = _points[p7].position;
    let v8 = _points[p8].position;

    // create new geometry
    let geometry = new THREE.Geometry();
    geometry.vertices.push(v1); geometry.vertices.push(v2);
    geometry.vertices.push(v3); geometry.vertices.push(v4);
    geometry.vertices.push(v5); geometry.vertices.push(v6);
    geometry.vertices.push(v7); geometry.vertices.push(v8);
    geometry.faces.push(new THREE.Face3(0, 1, 3)); // face 1
    geometry.faces.push(new THREE.Face3(1, 2, 3));
    geometry.faces.push(new THREE.Face3(4, 5, 7)); // face 2
    geometry.faces.push(new THREE.Face3(5, 6, 7));
    geometry.faces.push(new THREE.Face3(1, 5, 6)); // face 3
    geometry.faces.push(new THREE.Face3(1, 6, 2));
    geometry.faces.push(new THREE.Face3(0, 3, 7)); // face 4
    geometry.faces.push(new THREE.Face3(7, 4, 0));
    geometry.faces.push(new THREE.Face3(0, 4, 5)); // face 5
    geometry.faces.push(new THREE.Face3(0, 5, 1));
    geometry.faces.push(new THREE.Face3(2, 3, 7)); // face 6
    geometry.faces.push(new THREE.Face3(7, 6, 2));
    // compute normals
    geometry.computeVertexNormals();
    // add mesh to scene
    let cube = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
        emissive: 0xffffff, transparent: true, opacity: 0.7, side: THREE.DoubleSide
    }));
    scene.add(cube);
    _cubes.push(cube);
    let egeom = new THREE.EdgesGeometry(geometry);
    let edges = new THREE.LineSegments(egeom, new THREE.LineBasicMaterial({
        color: 0x000000
    }));
    scene.add(edges);
    _cuEdges.push(edges);
}

/* PROCESS FUNCTIONS */
// clears the scene from all geometry and labels
function clear_scene() {
    for (let p = 0; p < _points.length; p++) {
        scene.remove(_points[p]);
    }
    for (let e = 0; e < _triEdges.length; e++) {
        scene.remove(_triEdges[e]);
    }
    for (let e = 0; e < _sqEdges.length; e++) {
        scene.remove(_sqEdges[e]);
    }
    for (let e = 0; e < _tetEdges.length; e++) {
        scene.remove(_tetEdges[e]);
    }
    for (let e = 0; e < _cuEdges.length; e++) {
        scene.remove(_cuEdges[e]);
    }
    for (let t = 0; t < _triangles.length; t++) {
        scene.remove(_triangles[t]);
    }
    for (let s = 0; s < _squares.length; s++) {
        scene.remove(_squares[s]);
    }
    for (let t = 0; t < _tetrahedrons.length; t++) {
        scene.remove(_tetrahedrons[t]);
    }
    for (let c = 0; c < _cubes.length; c++) {
        scene.remove(_cubes[c]);
    }
    _points = [];
    _triEdges = [];
    _sqEdges = [];
    _tetEdges = [];
    _cuEdges = [];
    _triangles = [];
    _squares = [];
    _tetrahedrons = [];
    _cubes = [];

    $('.point-label').remove();
}

function make_mesh() {
    // clear scene
    clear_scene();
    
    _mesh_centroid = { x: 0, y: 0, z: 0 };
    _mesh_bound = 2;
    
    // add mesh points
    add_point(-1, 0, 1);
    add_point(0, 0, 1);
    add_point(1, 0, 1);
    add_point(-1, 0, 0);
    add_point(0, 0, 0);
    add_point(1, 0, 0);
    add_point(-1, 0, -1);
    add_point(0, 0, -1);
    add_point(1, 0, -1);
    
    add_point(-1, 1, 1); // 9
    add_point(0, 1, 1);
    add_point(1, 1, 1);
    add_point(-1, 1, 0);
    add_point(0, 1, 0);
    add_point(1, 1, 0);
    add_point(-1, 1, -1);
    add_point(0, 1, -1);
    add_point(1, 1, -1);
    
    add_point(-1, -1, 1); // 18
    add_point(0, -1, 1);
    add_point(1, -1, 1);
    add_point(-1, -1, 0);
    add_point(0, -1, 0);
    add_point(1, -1, 0);
    add_point(-1, -1, -1);
    add_point(0, -1, -1);
    add_point(1, -1, -1);
    
    add_triangle(0, 1, 3);
    add_triangle(1, 3, 4);
    add_triangle(2, 4, 5);
    add_triangle(1, 4, 2);
    add_triangle(3, 6, 4);
    add_triangle(4, 6, 7);
    add_triangle(4, 7, 5);
    add_triangle(5, 7, 8);
    
    add_square(0, 1, 4, 3);
    add_square(1, 2, 5, 4);
    add_square(3, 4, 7, 6);
    add_square(4, 5, 8, 7);
    
    add_tetrahedron(0, 1, 3, 9);
    add_tetrahedron(1, 3, 4, 13);
    add_tetrahedron(9, 13, 10, 1);
    add_tetrahedron(9, 12, 13, 3);

    add_tetrahedron(1, 10, 13, 11);
    add_tetrahedron(4, 1, 13, 5);
    add_tetrahedron(11, 13, 14, 5);
    add_tetrahedron(1, 5, 2, 11);

    add_tetrahedron(4, 3, 13, 7);
    add_tetrahedron(3, 13, 12, 15);
    add_tetrahedron(3, 6, 15, 7);
    add_tetrahedron(13, 15, 16, 7);

    add_tetrahedron(4, 7, 5, 13);
    add_tetrahedron(14, 13, 5, 17);
    add_tetrahedron(13, 16, 7, 17);
    add_tetrahedron(7, 8, 5, 17);

    add_tetrahedron(0, 1, 3, 18);
    add_tetrahedron(1, 3, 4, 22);
    add_tetrahedron(18, 22, 21, 3);
    add_tetrahedron(18, 19, 22, 1);

    add_tetrahedron(19, 22, 20, 1);
    add_tetrahedron(22, 4, 1, 5);
    add_tetrahedron(1, 2, 5, 20);
    add_tetrahedron(20, 22, 23, 5);

    add_tetrahedron(4, 22, 5, 7);
    add_tetrahedron(22, 25, 26, 7);
    add_tetrahedron(5, 7, 8, 26);
    add_tetrahedron(22, 26, 23, 5);

    add_tetrahedron(4, 3, 22, 7);
    add_tetrahedron(22, 3, 21, 24);
    add_tetrahedron(24, 25, 22, 7);
    add_tetrahedron(24, 7, 6, 3);

    add_cube(0, 1, 4, 3, 9, 10, 13, 12);
    add_cube(1, 2, 5, 4, 10, 11, 14, 13);
    add_cube(3, 4, 7, 6, 12, 13, 16, 15);
    add_cube(4, 5, 8, 7, 13, 14, 17, 16);
    add_cube(18, 19, 22, 21, 0, 1, 4, 3);
    add_cube(19, 20, 23, 22, 1, 2, 5, 4);
    add_cube(21, 22, 25, 24, 3, 4, 7, 6);
    add_cube(22, 23, 26, 25, 4, 5, 8, 7);
}

function set_dims(n) {
    _show_dims = n;
    if (n == 2) {
        camera.position.set(
            _mesh_centroid.x,
            _mesh_centroid.y - _mesh_bound,
            _mesh_centroid.z);
        controls.enableRotate = false;
        
        for (let p = 9; p < _points.length; p++)
            _points[p].visible = false;

        if (_show_type == 0) {
            for (let s = 0; s < _squares.length; s++) {
                _squares[s].visible = true;
            }
            for (let e = 0; e < _sqEdges.length; e++) {
                _sqEdges[e].visible = true;
            }
            for (let c = 0; c < _cubes.length; c++) {
                _cubes[c].visible = false;
            }
            for (let e = 0; e < _cuEdges.length; e++) {
                _cuEdges[e].visible = false;
            }
        }
        else if (_show_type == 1) {
            for (let t = 0; t < _triangles.length; t++) {
                _triangles[t].visible = true;
            }
            for (let e = 0; e < _triEdges.length; e++) {
                _triEdges[e].visible = true;
            }
            for (let t = 0; t < _tetrahedrons.length; t++) {
                _tetrahedrons[t].visible = false;
            }
            for (let e = 0; e < _tetEdges.length; e++) {
                _tetEdges[e].visible = false;
            }
        }
    }
    else if (n == 3) {
        for (let p = 9; p < _points.length; p++)
            _points[p].visible = true;

        camera.position.set(
            _mesh_centroid.x + _mesh_bound * Math.sin(CAM_AZIMUT) * Math.cos(CAM_DECLINATION),
            -_mesh_centroid.y + _mesh_bound * Math.sin(CAM_AZIMUT) * Math.sin(CAM_DECLINATION),
            _mesh_centroid.z + _mesh_bound * Math.cos(CAM_AZIMUT)
        );
        let cent = new THREE.Vector3(_mesh_centroid.x, -_mesh_centroid.y, _mesh_centroid.z);
        camera.lookAt(cent);
        controls.target.set(_mesh_centroid.x, -_mesh_centroid.y, _mesh_centroid.z);
        controls.enableRotate = true;

        if (_show_type == 0) {
            for (let s = 0; s < _squares.length; s++) {
                _squares[s].visible = false;
            }
            for (let e = 0; e < _sqEdges.length; e++) {
                _sqEdges[e].visible = false;
            }
            for (let c = 0; c < _cubes.length; c++) {
                _cubes[c].visible = true;
            }
            for (let e = 0; e < _cuEdges.length; e++) {
                _cuEdges[e].visible = true;
            }
        }
        else if (_show_type == 1) {
            for (let t = 0; t < _triangles.length; t++) {
                _triangles[t].visible = false;
            }
            for (let e = 0; e < _triEdges.length; e++) {
                _triEdges[e].visible = false;
            }
            for (let t = 0; t < _tetrahedrons.length; t++) {
                _tetrahedrons[t].visible = true;
            }
            for (let e = 0; e < _tetEdges.length; e++) {
                _tetEdges[e].visible = true;
            }
        }
    }
    else {
        alert('Unknown number of dimensions: ' + n);
    }
}

function set_type(t) {
    _show_type = t;
    if (t == 0) { // regular (square / cube)
        for (let t = 0; t < _triangles.length; t++) {
            _triangles[t].visible = false;
        }
        for (let e = 0; e < _triEdges.length; e++) {
            _triEdges[e].visible = false;
        }
        for (let s = 0; s < _squares.length; s++) {
            _squares[s].visible = _show_dims == 2;
        }
        for (let e = 0; e < _sqEdges.length; e++) {
            _sqEdges[e].visible = _show_dims == 2;
        }
        for (let t = 0; t < _tetrahedrons.length; t++) {
            _tetrahedrons[t].visible = false;
        }
        for (let e = 0; e < _tetEdges.length; e++) {
            _tetEdges[e].visible = false;
        }
        for (let c = 0; c < _cubes.length; c++) {
            _cubes[c].visible = _show_dims == 3;
        }
        for (let e = 0; e < _cuEdges.length; e++) {
            _cuEdges[e].visible = _show_dims == 3;
        }
    }
    else if (t == 1) { // triangulation (triangle / tetrahedron)
        for (let t = 0; t < _triangles.length; t++) {
            _triangles[t].visible = _show_dims == 2;
        }
        for (let e = 0; e < _triEdges.length; e++) {
            _triEdges[e].visible = _show_dims == 2;
        }
        for (let s = 0; s < _squares.length; s++) {
            _squares[s].visible = false;
        }
        for (let e = 0; e < _sqEdges.length; e++) {
            _sqEdges[e].visible = false;
        }
        for (let t = 0; t < _tetrahedrons.length; t++) {
            _tetrahedrons[t].visible = _show_dims == 3;
        }
        for (let e = 0; e < _tetEdges.length; e++) {
            _tetEdges[e].visible = _show_dims == 3;
        }
        for (let c = 0; c < _cubes.length; c++) {
            _cubes[c].visible = false;
        }
        for (let e = 0; e < _cuEdges.length; e++) {
            _cuEdges[e].visible = false;
        }
    }
    else {
        alert('Unknown type of discretization: ' + t);
    }
}

/** THREE WEBGL SCENE FUNCTIONS **/
// scene initialization function
function init() {
    // SCENE
    scene = new THREE.Scene();
    // CAMERA
    camera = new THREE.OrthographicCamera(-SCREEN_WIDTH / _cam_size,
                                            SCREEN_WIDTH / _cam_size,
                                            -SCREEN_HEIGHT / _cam_size,
                                            SCREEN_HEIGHT / _cam_size,
                                            _cam_clipping_planes.near,
                                            _cam_clipping_planes.far);
    scene.add(camera);

    // RENDERER
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);
    container = document.getElementById('ThreeJS');
    container.appendChild(renderer.domElement);

    // CONTROLS
    controls = new THREE.OrbitControls(camera, renderer.domElement, true);

    // OBJ FOR SCREEN/WORLD CALCULATIONS
    projector = new THREE.Projector();
    
    make_mesh();
    
    // by default:
    _show_type = 0;
    _show_dims = 2;
    set_type(_show_type);
    set_dims(_show_dims);
}

// frame rendering functions
function runLoop() {
    requestAnimationFrame(runLoop);
    update();
    update_labels();
    render();
}

// check for hover using Raycasts from camera
function update() {
    // update OrbitalControls, i.e. camera movement
    controls.update();
    
    // create a Ray with origin at the mouse position
    //   and direction into the scene (camera direction)
    if (mouse.y == 0) return;
    
    var ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, camera);

    // create an array containing all objects in the scene with which the ray intersects
    var intersects = ray.intersectObjects(scene.children);
    // INTERSECTED = the object in the scene currently closest to the camera
    //      and intersected by the Ray projected from the mouse position

    // if there is one (or more) intersections
    if (intersects.length > 0) {
        // if the closest object intersected is not the currently stored intersection object
        if (intersects[0].object != INTERSECTED) {
            // restore previous intersection object (if it exists) to its original color
            if (INTERSECTED) {
                INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                // call hover function
                if(INTERSECTED.unhover_function !== undefined)
                    INTERSECTED.unhover_function();
            }
            var i = 0;
            if($.inArray(intersects[i].object, _points) == -1
                && $.inArray(intersects[i].object, _triangles) == -1
                && $.inArray(intersects[i].object, _squares) == -1
                && $.inArray(intersects[i].object, _tetrahedrons) == -1
                && $.inArray(intersects[i].object, _cubes) == -1) {
                i++;
                while(i < intersects.length
                    && $.inArray(intersects[i].object, _points) == -1
                    && $.inArray(intersects[i].object, _triangles) == -1
                    && $.inArray(intersects[i].object, _squares) == -1
                    && $.inArray(intersects[i].object, _tetrahedrons) == -1
                    && $.inArray(intersects[i].object, _cubes) == -1)
                    i++;
            }
            if(i == intersects.length) return;

            let point_id = $.inArray(intersects[i].object, _points)
            if (point_id != -1) {
                if (_hovered_label !== null)
                    $('.point-label').eq(_hovered_label).css({ visibility: 'hidden' });
                _hovered_label = point_id;
                $('.point-label').eq(point_id).css({ visibility: 'visible' });
            }
            else if (_hovered_label !== null)
                $('.point-label').eq(_hovered_label).css({ visibility: 'hidden' });
            
            // store reference to closest object as current intersection object
            INTERSECTED = intersects[i].object;
            // store color of closest object (for later restoration)
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            // set a new color for closest object
            INTERSECTED.material.emissive.setHex(_hover_color);
            // call hover function
            if(INTERSECTED.hover_function !== undefined)
                INTERSECTED.hover_function();
        }
    }
    else { // there are no intersections
        // restore previous intersection object (if it exists) to its original color
        if (INTERSECTED) {
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            // call hover function
            if(INTERSECTED.unhover_function !== undefined)
                INTERSECTED.unhover_function();
        }
        // remove previous intersection object reference
        //     by setting current intersection object to "nothing"
        INTERSECTED = null;
    }
}

// move around points' labels
function update_labels() {
    $('.point-label').each(function() {
        var point_pos_tmp = $(this).attr('data-point-pos').split('/');
        var pos_tmp = $(this).attr('data-pos').split('/');
        var point_pos = new THREE.Vector3(parseFloat(point_pos_tmp[0]), parseFloat(point_pos_tmp[1]), parseFloat(point_pos_tmp[2]));
        var label_world_pos = new THREE.Vector3(parseFloat(pos_tmp[0]), parseFloat(pos_tmp[1]), parseFloat(pos_tmp[2]));

        var label_screen_pos = label_world_pos.project(camera);
        label_screen_pos.x = (label_screen_pos.x + 1) * 0.5 * SCREEN_WIDTH;
        label_screen_pos.y = (label_screen_pos.y - 1) * 0.5 * SCREEN_HEIGHT;

        $(this).css({
            left: label_screen_pos.x,
            top: -label_screen_pos.y
        });
    });
}

// re-update scene rendering
function render() {
    renderer.render(scene, camera);
}


// INITIALIZE THREE WEBGL SCENE
init();
// SET LOOP RUN
runLoop();

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
var container, scene, camera, renderer;
var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
var projector, INTERSECTED;
var mouse = {
    x: 0,
    y: 0
};

var MTR_COLORS = [
    "#ff0000", "#ff00ff", "#ffaa00",
    "#e0e000", "#00e000", "#6666ff",
    "#aa00ff", "#ff00aa", "#00e0e0"
];

// general variables
var _cam_clipping_planes = { near: 0.1, far: 2000 };
var _cam_size = 300;

var _point_size = 0.1;
var _point_def = 20; // nb of segments in geometry
var _pt_hover_color = 0x76d1f2;
var _tri_hover_color = 0xff0000;
var _text_offset = 0.2;
var _mesh_bound;
var _mesh_centroid;

// scene elements references (for post-creation update, description association...)
var _points = [], _triangles = [], _triEdges = [];
var _cameraVisibilityHorizon;

var _matrix = [];
var _loc2glob = [];
var _triangle_size = 1;
var _elem_ref_mass_mtr = [
    [1/12, 1/24, 1/24],
    [1/24, 1/12, 1/24],
    [1/24, 1/24, 1/12]
]
var _elem_mass_mtr = [];

var _hovered_vertex = null;
var _hovered_triangle = null;
var _selected_triangles = [];
var _deselecting = false;

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

// gets barycenter of a set of vertices
function get_barycenter(points) {
    let x = 0, y = 0, z = 0;
    for (let p = 0; p < points.length; p++) {
        x += points[p].x; y += points[p].y; z += points[p].z;
    }
    x /= points.length; y /= points.length; z /= points.length;
    return { x: x, y: y, z: z };
}

// computes the elementary mass matrix for the three given vertices
// (in real coordinates)
function mass_mtr(v1, v2, v3) {
    x1 = v1.x; y1 = v1.y;
    x2 = v2.x; y2 = v2.y;
    x3 = v3.x; y3 = v3.y;
    let M_11 = -(x1 - x3)*(y2 - y1) + (x1 - x2)*(y3 - y1);
    let M_12 = -1/2*(x1 - x3)*(y2 - y1) + 1/2*(x1 - x2)*(y3 - y1);
    let M_13 = -1/2*(x1 - x3)*(y2 - y1) + 1/2*(x1 - x2)*(y3 - y1);
    let M_22 = -(x1 - x3)*(y2 - y1) + (x1 - x2)*(y3 - y1);
    let M_23 = -1/2*(x1 - x3)*(y2 - y1) + 1/2*(x1 - x2)*(y3 - y1);
    let M_33 = -(x1 - x3)*(y2 - y1) + (x1 - x2)*(y3 - y1);
    
    let row1 = [_triangle_size/12 * M_11, _triangle_size/12 * M_12, _triangle_size/12 * M_13];
    let row2 = [_triangle_size/12 * M_12, _triangle_size/12 * M_22, _triangle_size/12 * M_23];
    let row3 = [_triangle_size/12 * M_13, _triangle_size/12 * M_23, _triangle_size/12 * M_33];
    
    return [row1, row2, row3];
}

/** EVENT FUNCTIONS **/
$(document).mousemove(function(event) {
    mouse.x = (event.clientX / window.innerWidth) * 4 - 3;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
})

$(document).click(function(event) {
    if (INTERSECTED !== null) {
        let tri_id = _triangles.indexOf(INTERSECTED);
        if (tri_id != -1) {
            if ($.inArray(tri_id, _selected_triangles) == -1)
                select_triangle(tri_id);
            else
                deselect_triangle(tri_id);
        }
    }
})

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
        let c = 1.2;
        label_world_pos = {
            x: _mesh_centroid.x - c*d.x,
            y: _mesh_centroid.y - c*d.y,
            z: _mesh_centroid.z - c*d.z
        };
    }
    else label_world_pos = { x: _mesh_centroid.x, y: _mesh_centroid.y, z: _mesh_centroid.z };
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
    geometry.vertices.push(new THREE.Vector3(v1.x, v1.y, v1.z - 0.1));
    geometry.vertices.push(new THREE.Vector3(v2.x, v2.y, v2.z - 0.1));
    geometry.vertices.push(new THREE.Vector3(v3.x, v3.y, v3.z - 0.1));
    geometry.faces.push(new THREE.Face3(0, 1, 2));
    // compute normals
    geometry.computeVertexNormals();
    // add mesh to scene
    let triangle = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
        emissive: 0x111111, transparent: true, opacity: 0.7, side: THREE.DoubleSide
    }));
    scene.add(triangle);
    _triangles.push(triangle);
    let egeom = new THREE.EdgesGeometry(geometry);
    let edges = new THREE.LineSegments(egeom, new THREE.LineBasicMaterial({
        color: 0x000000
    }));
    scene.add(edges);
    _triEdges.push(edges);
    
    // add loc 2 glob references (vertices indices)
    _loc2glob.push([p1, p2, p3]);
    // compute elementary mass matrix for this triangle
    _elem_mass_mtr.push(mass_mtr(v1, v2, v3));
    
    // add local label to each vertex
    let cent = get_barycenter(triangle.geometry.vertices);
    for (let i = 0; i < 3; i++) {
        let x, y, z;
        if (i == 0) {
            x = v1.x; y = v1.y; z = v1.z;
        }
        else if (i == 1) {
            x = v2.x; y = v2.y; z = v2.z;
        }
        else if (i == 2) {
            x = v3.x; y = v3.y; z = v3.z;
        }
        
        let text = document.createElement('div');
        text.className = 'point-label-local';
        text.innerHTML = i + 1;
        
        let label_world_pos; // positionate label "outside" of vertex (with respect to the centroid of the mesh)
        if (!(x == cent.x && y == cent.y && z == cent.z)) {
            let d = { x: cent.x - x, y: cent.y - y, z: cent.z - z };
            let c = 0.6;
            label_world_pos = {
                x: cent.x - c*d.x,
                y: cent.y - c*d.y,
                z: cent.z - c*d.z
            };
        }
        else label_world_pos = { x: cent.x - 0.4, y: cent.y, z: cent.z };
        let lpos = new THREE.Vector3(label_world_pos.x, label_world_pos.y, label_world_pos.z);
        text.setAttribute('data-point-pos', x + '/' + -y + '/' + z);
        text.setAttribute('data-pos', lpos.x + '/' + lpos.y + '/' + lpos.z);
        let label_screen_pos = lpos.project(camera);
        label_screen_pos.x = (label_screen_pos.x + 1) * 0.5 * SCREEN_WIDTH;
        label_screen_pos.y = (label_screen_pos.y - 1) * 0.5 * SCREEN_HEIGHT;
        text.style.left = label_screen_pos.x + 'px';
        text.style.top = -label_screen_pos.y + 'px';
        text.style.visibility = 'hidden';
        container.appendChild(text);
    }
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
    for (let t = 0; t < _triangles.length; t++) {
        scene.remove(_triangles[t]);
    }
    _points = [];
    _triEdges = [];
    _triangles = [];

    $('.point-label').remove();
    $('.point-label-local').remove();
}

function make_mesh() {
    // clear scene
    clear_scene();
    
    _mesh_centroid = { x: 0, y: 0, z: 0 };
    _mesh_bound = 2;
    
    // add mesh points
    add_point(-1, 1, 0);
    add_point(0, 1, 0);
    add_point(1, 1, 0);
    add_point(-1, 0, 0);
    add_point(0, 0, 0);
    add_point(1, 0, 0);
    add_point(-1, -1, 0);
    add_point(0, -1, 0);
    add_point(1, -1, 0);

    add_triangle(0, 1, 3);
    add_triangle(1, 3, 4);
    add_triangle(2, 4, 5);
    add_triangle(1, 4, 2);
    add_triangle(3, 4, 6);
    add_triangle(4, 6, 7);
    add_triangle(4, 5, 7);
    add_triangle(5, 7, 8);
}

function init_matrix() {
    for (let i = 0; i < _points.length; i++) {
        let row = [];
        for (let j = 0; j < _points.length; j++) {
            row[j] = 0;
        }
        if (_matrix.length == 0) _matrix.push(row);
        else _matrix[i] = row;
    }
}

function update_matrix(p, adding) {
    let table = document.getElementById("matrix");
    // reset colors
    for (let I = 0; I < _points.length; I++)
        for (let J = 0; J < _points.length; J++)
            table.rows[1+I].cells[1+J].style.color = "#EDEDED";
    
    // adds elementary mass matrix to complete mass matrix
    if (adding) {
        for (let i = 0; i < 3; i++) {
            let I = _loc2glob[p][i];
            for (let j = 0; j < 3; j++) {
                let J = _loc2glob[p][j];
                _matrix[I][J] += _elem_mass_mtr[p][i][j];
                table.rows[1+I].cells[1+J].style.color = MTR_COLORS[i*3+j];
            }
        }
    }
    // subtracts elementary mass matrix to complete mass matrix
    else {
        for (let i = 0; i < 3; i++) {
            let I = _loc2glob[p][i];
            for (let j = 0; j < 3; j++) {
                let J = _loc2glob[p][j];
                _matrix[I][J] -= _elem_mass_mtr[p][i][j];
            }
        }
    }
    
    // update display
    for (let I = 0; I < _points.length; I++) {
        for (let J = 0; J < _points.length; J++) {
            if (_matrix[I][J] == 0)
                table.rows[1+I].cells[1+J].innerHTML = "0";
            else
                table.rows[1+I].cells[1+J].innerHTML = Number(_matrix[I][J]).toFixed(2);
        }
    }
}

function update_trisize() {
    _triangle_size = document.getElementById("trisize").value;
    $('.trisize-display').html(_triangle_size);
    
    // update matrices    
    init_matrix();
    for (let p = 0; p < _triangles.length; p++) {
        let vertices = _loc2glob[p];
        let v1 = _points[vertices[0]].position;
        let v2 = _points[vertices[1]].position;
        let v3 = _points[vertices[2]].position;
        _elem_mass_mtr[p] = mass_mtr(v1, v2, v3);
    }
    for (let i = 0; i < _selected_triangles.length; i++) {
        let p = _selected_triangles[i];
        update_matrix(p, true);
    }
}

function hover_vertex(v) {
    unhover_vertex();
    
    $('.point-label').eq(v).css({ visibility: 'visible' });

    let table = document.getElementById("matrix");
    for (let I = 0; I < _points.length; I++) {
        table.rows[1+I].cells[1+v].style.color = "#76d1f2";
        table.rows[1+v].cells[1+I].style.color = "#76d1f2";
    }
    _hovered_vertex = v;
}

function unhover_vertex() {
    if (_hovered_vertex === null) return;
    
    $('.point-label').eq(_hovered_vertex).css({ visibility: 'hidden' });
    
    let table = document.getElementById("matrix");
    for (let I = 0; I < _points.length; I++) {
        table.rows[1+I].cells[1+_hovered_vertex].style.color = "#EDEDED";
        table.rows[1+_hovered_vertex].cells[1+I].style.color = "#EDEDED";
    }
    if (_selected_triangles.length > 0) {
        let vertices = _loc2glob[_selected_triangles[_selected_triangles.length-1]];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let vi = vertices[i];
                let vj = vertices[j];
                table.rows[1+vi].cells[1+vj].style.color = MTR_COLORS[i*3+j];
            }
        }
    }
    _hovered_vertex = null;
}

function hover_triangle(t) {
    unhover_triangle(false);

    let tripoints = _loc2glob[t];
    for (let i = 0; i < 3; i++) {
        $('.point-label').eq(tripoints[i]).css({ visibility: 'visible' });
        $('.point-label-local').eq(t*3+i).css({ visibility: 'visible' });
    }

    _hovered_triangle = t;

    // update elementary mass matrix
    let elem_table = document.getElementById("matrix-elem");
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (_elem_mass_mtr[t][i][j] == 0)
                elem_table.rows[1+i].cells[1+j].innerHTML = "0";
            else
                elem_table.rows[1+i].cells[1+j].innerHTML = Number(_elem_mass_mtr[t][i][j]).toFixed(2);
        }
    }
}

function unhover_triangle(empty_mtr=true) {
    if (_hovered_triangle === null) return;
    
    let tripoints = _loc2glob[_hovered_triangle];
    for (let i = 0; i < 3; i++) {
        $('.point-label').eq(tripoints[i]).css({ visibility: 'hidden' });
        $('.point-label-local').eq(_hovered_triangle*3+i).css({
            visibility: 'hidden' });
    }

    _hovered_triangle = null;

    // if necessary, empty elementary mass matrix
    if (empty_mtr) {
        let elem_table = document.getElementById("matrix-elem");
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                elem_table.rows[1+i].cells[1+j].innerHTML = "";
            }
        }
    }
}

function select_triangle(t) {
    update_matrix(t, true);
    // add to selected triangles list
    _selected_triangles.push(t);
}

function deselect_triangle(t) {
    update_matrix(t, false);
    
    // remove from selected triangles list
    _selected_triangles.splice(_selected_triangles.indexOf(t), 1);
    _deselecting = true;
    
    let table = document.getElementById("matrix");
    if (_selected_triangles.length == 0) {
        for (let I = 0; I < _points.length; I++) {
            for (let J = 0; J < _points.length; J++) {
                table.rows[1+I].cells[1+J].innerHTML = "0";
            }
        }
    }
}

/** THREE WEBGL SCENE FUNCTIONS **/
// scene initialization function
function init() {
    // SCENE
    scene = new THREE.Scene();
    // CAMERA
    camera = new THREE.OrthographicCamera(-SCREEN_WIDTH / 2 / _cam_size,
                                            SCREEN_WIDTH / 2 / _cam_size,
                                            -SCREEN_HEIGHT / _cam_size,
                                            SCREEN_HEIGHT / _cam_size,
                                            _cam_clipping_planes.near,
                                            _cam_clipping_planes.far);
    scene.add(camera);

    // RENDERER
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(SCREEN_WIDTH/2, SCREEN_HEIGHT);
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);
    container = document.getElementById('ThreeJS');
    container.appendChild(renderer.domElement);

    // OBJ FOR SCREEN/WORLD CALCULATIONS
    projector = new THREE.Projector();

    // SET CAMERA
    camera.position.set(0, 0, 2);
    
    make_mesh();
    init_matrix();
    // init colors in elementary matrix
    let elem_table = document.getElementById("matrix-elem");
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            elem_table.rows[1+i].cells[1+j].style.color = MTR_COLORS[i*3+j];
        }
    }
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
                unhover_vertex();
                unhover_triangle();
                if (_deselecting) {
                    INTERSECTED.currentHex = 0x111111;
                    _deselecting = false;
                }
                else if (_selected_triangles.indexOf(_triangles.indexOf(INTERSECTED)) != -1)
                    INTERSECTED.currentHex = 0xffffff;
                INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            }
            var i = 0;
            if($.inArray(intersects[i].object, _points) == -1
                && $.inArray(intersects[i].object, _triangles) == -1) {
                i++;
                while(i < intersects.length
                    && $.inArray(intersects[i].object, _points) == -1
                    && $.inArray(intersects[i].object, _triangles) == -1)
                    i++;
            }
            if(i == intersects.length) return;
            
            let hover_color = _tri_hover_color;
            let point_id = $.inArray(intersects[i].object, _points)
            if (point_id != -1) {
                hover_color = _pt_hover_color;
                hover_vertex(point_id);
            }
            else {
                hover_color = _tri_hover_color;
                hover_triangle($.inArray(intersects[i].object, _triangles));
            }
            
            // store reference to closest object as current intersection object
            INTERSECTED = intersects[i].object;
            // store color of closest object (for later restoration)
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            // set a new color for closest object
            INTERSECTED.material.emissive.setHex(hover_color);
        }
    }
    else { // there are no intersections
        // restore previous intersection object (if it exists) to its original color
        if (INTERSECTED) {
            unhover_vertex();
            unhover_triangle();
            if (_deselecting) {
                INTERSECTED.currentHex = 0x111111;
                _deselecting = false;
            }
            else if (_selected_triangles.indexOf(_triangles.indexOf(INTERSECTED)) != -1)
                INTERSECTED.currentHex = 0xffffff;
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
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
        label_screen_pos.x = (label_screen_pos.x + 1) * 0.25 * SCREEN_WIDTH;
        label_screen_pos.y = (label_screen_pos.y - 1) * 0.5 * SCREEN_HEIGHT;

        $(this).css({
            left: label_screen_pos.x,
            top: -label_screen_pos.y
        });
    });
    $('.point-label-local').each(function() {
        var point_pos_tmp = $(this).attr('data-point-pos').split('/');
        var pos_tmp = $(this).attr('data-pos').split('/');
        var point_pos = new THREE.Vector3(parseFloat(point_pos_tmp[0]), parseFloat(point_pos_tmp[1]), parseFloat(point_pos_tmp[2]));
        var label_world_pos = new THREE.Vector3(parseFloat(pos_tmp[0]), parseFloat(pos_tmp[1]), parseFloat(pos_tmp[2]));

        var label_screen_pos = label_world_pos.project(camera);
        label_screen_pos.x = (label_screen_pos.x + 1) * 0.25 * SCREEN_WIDTH;
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

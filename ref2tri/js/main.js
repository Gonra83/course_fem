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

// general variables
var _cam_clipping_planes = { near: 0.1, far: 2000 };
var _cam_size = 350;

var _point_size = 0.075;
var _point_def = 20; // nb of segments in geometry
var _pt_ref_hover_color = 0xf4b800;
var _pt_real_hover_color = 0x76d1f2;
var _text_offset = 0.2;
var _mesh_bound;
var _mesh_centroid;

// scene elements references (for post-creation update, description association...)
var _ref_points = [], _real_points = [], _centroids = [], _triangles = [];
var _cameraVisibilityHorizon;

var _elem_ref_mass_mtr = [
    [1/12, 1/24, 1/24],
    [1/24, 1/12, 1/24],
    [1/24, 1/24, 1/12]
];
var _triangle_determinant;
var _real_offsets = [
    [-0.5, -1.5, 0], [0.5, -1.5, 0], [0, -0.5, 0]
];

var _hovered_vertex = null;
var _dragged_vertex = null;

// computes the triangle current determinant (2* its size)
function get_determinant() {
    x1 = _real_points[0].position.x; y1 = _real_points[0].position.y;
    x2 = _real_points[1].position.x; y2 = _real_points[1].position.y;
    x3 = _real_points[2].position.x; y3 = _real_points[2].position.y;
    _triangle_determinant = (x2 - x1)*(y1 - y3) - (x3 - x1)*(y1 - y2);
    
    // update label
    $(".determinant").html(Number(_triangle_determinant).toFixed(3));
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

/** EVENT FUNCTIONS **/
$(document).mousemove(function(event) {
    mouse.x = (event.clientX / window.innerWidth) * 4 - 3;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    if (_dragged_vertex !== null) {
        let p = new THREE.Vector3(mouse.x, mouse.y, 0);
        let proj = p.unproject(camera);
        _real_points[_dragged_vertex].position.set(proj.x, proj.y, 0);
        _triangles[1].geometry.vertices[_dragged_vertex].set(proj.x, proj.y, 0);
        _triangles[1].geometry.verticesNeedUpdate = true;
        
        let centroid = get_barycenter(_triangles[1].geometry.vertices);
        _centroids[1] = centroid;
        let lpos; // positionate label "outside" of vertex (with respect to the centroid of the mesh)
        if (!(proj.x == centroid.x && proj.y == centroid.y && z == 0)) {
            let d = { x: centroid.x - proj.x, y: centroid.y - proj.y, z: centroid.z };
            let c = 1.35;
            lpos = {
                x: centroid.x - c*d.x,
                y: centroid.y - c*d.y,
                z: centroid.z
            };
        }
        else lpos = { x: centroid.x, y: centroid.y, z: centroid.z };
        $('.point-label').eq(3+_dragged_vertex).attr('data-pos', lpos.x + '/' + lpos.y + '/' + 0);
        
        $('.triangle-label').eq(1).attr('data-pos', centroid.x + '/' + centroid.y + '/' + 0);
        
        update_matrix();
    }
})

$(document).mousedown(function(event) {
    if (_dragged_vertex === null && _hovered_vertex !== null) {
        if (_hovered_vertex >= 3) {
            _dragged_vertex = _hovered_vertex-3;
        }
    }
})

$(document).mouseup(function(event) {
    unhover_vertex();
    _dragged_vertex = null;
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
function add_point(x, y, z, label, centroid, array) {
    let geometry = new THREE.SphereGeometry(_point_size, _point_def, _point_def);
    let material = new THREE.MeshLambertMaterial({
        emissive: 0xffffff, side: THREE.BackSide
    });
    let point = new THREE.Mesh(geometry, material);
    point.position.set(x, -y, z); // vertical axis seems to be inverted...
    scene.add(point);
    array.push(point);
    
    // add label
    let text = document.createElement('div');
    text.className = 'point-label';
    text.innerHTML = label;
    
    let label_world_pos; // positionate label "outside" of vertex (with respect to the centroid of the mesh)
    if (!(x == centroid.x && y == centroid.y && z == centroid.z)) {
        let d = { x: centroid.x - x, y: centroid.y - y, z: centroid.z - z };
        let c = 1.35;
        label_world_pos = {
            x: centroid.x - c*d.x,
            y: centroid.y - c*d.y,
            z: centroid.z - c*d.z
        };
    }
    else label_world_pos = { x: centroid.x, y: centroid.y, z: centroid.z };
    let lpos = new THREE.Vector3(label_world_pos.x, label_world_pos.y, label_world_pos.z);
    text.setAttribute('data-pos', lpos.x + '/' + -lpos.y + '/' + lpos.z);
    let label_screen_pos = lpos.project(camera);
    label_screen_pos.x = (label_screen_pos.x + 1) * 0.25 * SCREEN_WIDTH;
    label_screen_pos.y = (label_screen_pos.y - 1) * 0.5 * SCREEN_HEIGHT;
    text.style.left = label_screen_pos.x + 'px';
    text.style.top = -label_screen_pos.y + 'px';
    container.appendChild(text);
}

// create a triangle from 3 vertices
function add_triangle(p1, p2, p3, label, centroid, array) {
    let v1 = array[p1].position;
    let v2 = array[p2].position;
    let v3 = array[p3].position;
    _centroids.push(centroid);

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
        emissive: 0xdddddd, side: THREE.DoubleSide
    }));
    scene.add(triangle);
    _triangles.push(triangle);

    // add triangle label
    let text = document.createElement('div');
    text.className = 'triangle-label';
    text.innerHTML = label;
    
    let lpos = get_barycenter(triangle.geometry.vertices); // positionate label at centroid
    text.setAttribute('data-pos', lpos.x + '/' + lpos.y + '/' + lpos.z);
    let label_screen_pos = new THREE.Vector3(lpos.x, lpos.y, lpos.z).project(camera);
    label_screen_pos.x = (label_screen_pos.x + 1) * 0.25 * SCREEN_WIDTH;
    label_screen_pos.y = (label_screen_pos.y - 1) * 0.5 * SCREEN_HEIGHT;
    text.style.left = label_screen_pos.x + 'px';
    text.style.top = -label_screen_pos.y + 'px';
    container.appendChild(text);
}

/* PROCESS FUNCTIONS */
// clears the scene from all geometry and labels
function clear_scene() {
    for (let p = 0; p < _ref_points.length; p++) {
        scene.remove(_ref_points[p]);
    }
    for (let p = 0; p < _real_points.length; p++) {
        scene.remove(_real_points[p]);
    }
    for (let c = 0; c < _centroids.length; c++) {
        scene.remove(_centroids[c]);
    }
    for (let t = 0; t < _triangles.length; t++) {
        scene.remove(_triangles[t]);
    }
    _ref_points = [];
    _real_points = [];
    _centroids = [];
    _triangles = [];

    $('.point-label').remove();
}

function make_mesh() {
    // clear scene
    clear_scene();
    
    // reference triangle
    let centroid = { x: 0, y: 1, z: 0 };
    add_point(-0.5, 0.5, 0, "s&#x302;<sub>1</sub>", centroid, _ref_points);
    add_point(0.5, 0.5, 0, "s&#x302;<sub>2</sub>", centroid, _ref_points);
    add_point(-0.5, 1.5, 0, "s&#x302;<sub>3</sub>", centroid, _ref_points);

    add_triangle(0, 1, 2, "K&#x302;", centroid, _ref_points);

    // real triangle Kp
    centroid = { x: 0, y: -1, z: 0 };
    add_point(_real_offsets[0][0], _real_offsets[0][1], _real_offsets[0][2],
        "<span class='supsub'>s<sup class='superscript'>p</sup><sub class='subscript'>1</sub></span>",
        centroid, _real_points);
    add_point(_real_offsets[1][0], _real_offsets[1][1], _real_offsets[1][2],
        "<span class='supsub'>s<sup class='superscript'>p</sup><sub class='subscript'>2</sub></span>",
        centroid, _real_points);
    add_point(_real_offsets[2][0], _real_offsets[2][1], _real_offsets[2][2],
        "<span class='supsub'>s<sup class='superscript'>p</sup><sub class='subscript'>3</sub></span>",
        centroid, _real_points);
    
    add_triangle(0, 1, 2, "<span class='supsub'>K<sub class='subscript2'>p</sub></span>", centroid, _real_points);
}

function update_matrix() {
    get_determinant();
    let table = document.getElementById("matrix-elem");
    for (let I = 0; I < 3; I++) {
        for (let J = 0; J < 3; J++) {
            let v = _elem_ref_mass_mtr[I][J] * _triangle_determinant;
            table.rows[1+I].cells[1+J].innerHTML = Number(v).toFixed(2);
        }
    }
}

function hover_vertex(v) {
    unhover_vertex();
    
    if (v < 3) {
        let table = document.getElementById("matrix-ref");
        for (let I = 0; I < 3; I++) {
            table.rows[1+I].cells[1+v].style.color = "#f4b800";
            table.rows[1+v].cells[1+I].style.color = "#f4b800";
        }
    }
    else {
        let table = document.getElementById("matrix-elem");
        for (let I = 0; I < 3; I++) {
            table.rows[1+I].cells[1+v-3].style.color = "#76d1f2";
            table.rows[1+v-3].cells[1+I].style.color = "#76d1f2";
        }
    }
    _hovered_vertex = v;
}

function unhover_vertex() {
    if (_hovered_vertex === null) return;
    
    let table = document.getElementById("matrix-elem");
    if (_hovered_vertex < 3) {
        let table = document.getElementById("matrix-ref");
        for (let I = 0; I < 3; I++) {
            table.rows[1+I].cells[1+_hovered_vertex].style.color = "#EDEDED";
            table.rows[1+_hovered_vertex].cells[1+I].style.color = "#EDEDED";
        }
    }
    else {
        for (let I = 0; I < 3; I++) {
            table.rows[1+I].cells[1+_hovered_vertex-3].style.color = "#EDEDED";
            table.rows[1+_hovered_vertex-3].cells[1+I].style.color = "#EDEDED";
        }
    }
    _hovered_vertex = null;
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
    update_matrix();
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
                INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            }
            var i = 0;
            if($.inArray(intersects[i].object, _ref_points) == -1
                && $.inArray(intersects[i].object, _real_points) == -1) {
                i++;
                while(i < intersects.length
                    && $.inArray(intersects[i].object, _ref_points) == -1
                    && $.inArray(intersects[i].object, _real_points) == -1)
                    i++;
            }
            if(i == intersects.length) return;
            
            // store reference to closest object as current intersection object
            INTERSECTED = intersects[i].object;
            // store color of closest object (for later restoration)
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            // set a new color for closest object
            let hover_color;
            let ref_id = $.inArray(INTERSECTED, _ref_points);
            if (ref_id != -1) {
                hover_vertex(ref_id);
                hover_color = _pt_ref_hover_color;
            }
            else {
                hover_vertex(3+$.inArray(INTERSECTED, _real_points));
                hover_color = _pt_real_hover_color;
            }
            INTERSECTED.material.emissive.setHex(hover_color);
        }
    }
    else { // there are no intersections
        // restore previous intersection object (if it exists) to its original color
        if (INTERSECTED) {
            unhover_vertex();
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
        var pos_tmp = $(this).attr('data-pos').split('/');
        var label_world_pos = new THREE.Vector3(parseFloat(pos_tmp[0]), parseFloat(pos_tmp[1]), parseFloat(pos_tmp[2]));

        var label_screen_pos = label_world_pos.project(camera);
        label_screen_pos.x = (label_screen_pos.x + 1) * 0.25 * SCREEN_WIDTH;
        label_screen_pos.y = (label_screen_pos.y - 1) * 0.5 * SCREEN_HEIGHT;
        if (label_screen_pos.x < 45)
            label_screen_pos.x = 45;
        else if (label_screen_pos.x >= SCREEN_WIDTH / 2 - 10)
            label_screen_pos.x = SCREEN_WIDTH / 2 - 11;
        if (label_screen_pos.y < -SCREEN_HEIGHT + 10)
            label_screen_pos.y = -SCREEN_HEIGHT + 11;
        else if (label_screen_pos.y > -10)
            label_screen_pos.y = -11;

        $(this).css({
            left: label_screen_pos.x,
            top: -label_screen_pos.y
        });
    });
    $('.triangle-label').each(function() {
        var pos_tmp = $(this).attr('data-pos').split('/');
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

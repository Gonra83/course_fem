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
var CAM_AZIMUT = Math.radians(45);
var CAM_DECLINATION = Math.radians(-60);

// general variables
var _cam_clipping_planes = { near: 0.1, far: 2000 };
var _cam_size = 300;

var _point_size = 0.1;
var _point_def = 20; // nb of segments in geometry
var _hover_color = 0xff0000;
var _mesh_bound;
var _mesh_centroid;

var _zoom = 0; var _changed_zoom;
var _zoom_delay = 1;
var _zoom_lerp = -1;
var _zoom_rate = 1 / (60 * _zoom_delay);
var _zoom_target;
var _zoom_trans;
var _zoom_size;

var _zoomed_tri = null;

// scene elements references (for post-creation update, description association...)
var _points = [], _triangles = [], _triEdges = [];
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

// gets barycenter of a set of vertices
function get_barycenter(points) {
    let x = 0, y = 0, z = 0;
    for (let p = 0; p < points.length; p++) {
        x += points[p].x; y += points[p].y; z += points[p].z;
    }
    x /= points.length; y /= points.length; z /= points.length;
    return { x: x, y: y, z: z };
}

// gets the global indices of the triangle's vertices
function get_triangle_points(tri) {
    let idx = []
    let pts = tri.geometry.vertices;
    for (let i = 0; i < 3; i++) {
        for (let p = 0; p < _points.length; p++) {
            if (_points[p].position == pts[i]) {
                idx.push(p);
            }
        }
    }
    return idx;
}

/** EVENT FUNCTIONS **/
$(document).mousemove(function(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
})

$(document).click(function(event) {
    if (INTERSECTED !== null && $.inArray(INTERSECTED, _triangles) != -1)
        zoom_in(INTERSECTED);
    else if (_zoom == 1) {
        zoom_out();
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
        let c = 1;
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
    
    let cent = get_barycenter(triangle.geometry.vertices);

    // add local label to each vertex
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
    // add mesh triangles
    add_triangle(0, 1, 3);
    add_triangle(1, 3, 4);
    add_triangle(2, 4, 5);
    add_triangle(1, 4, 2);
    add_triangle(3, 6, 4);
    add_triangle(4, 6, 7);
    add_triangle(4, 7, 5);
    add_triangle(5, 7, 8);
}

function zoom_in(tri) {
    // if another triangle was already selected, reset its color
    if (_zoomed_tri !== null)
        _zoomed_tri.material.emissive.setHex(0xffffff);
    // set reference to newly selected triangle
    _zoomed_tri = tri;
    
    // show/hide matching local labels
    $('.point-label-local').each(function() {
        $(this).css({ visibility: 'hidden' });
    });
    let tri_idx = _triangles.indexOf(tri);
    for (let i = 0; i < 3; i++)
        $('.point-label-local').eq(tri_idx*3 + i).css({ visibility: 'visible' });
    // hide global labels during camera movement
    $('.point-label').each(function() {
        $(this).css({ visibility: 'hidden' });
    });
    
    // set variables for camera movement
    _changed_zoom = (_zoom == 0); _zoom = 1;
    _zoom_lerp = 0;
    let cent = get_barycenter(tri.geometry.vertices);
    _zoom_target = new THREE.Vector3(cent.x, cent.y, 2);
    _zoom_trans = _zoom_target.clone().sub(camera.position);
    _zoom_trans.x *= _zoom_rate;
    _zoom_trans.y *= _zoom_rate;
    _zoom_size = 400;
}

function zoom_out() {
    // reset previously selected triangle's color
    _zoomed_tri.material.emissive.setHex(0xffffff);
    // forget reference to selected triangle
    _zoomed_tri = null;
    
    // hide all labels during camera movement
    $('.point-label').each(function() {
        $(this).css({ visibility: 'hidden' });
    });
    $('.point-label-local').each(function() {
        $(this).css({ visibility: 'hidden' });
    });

    // set variables for camera movement
    _changed_zoom = (_zoom == 1); _zoom = 0;
    _zoom_lerp = 0;
    _zoom_target = new THREE.Vector3(0, 0, 2);
    _zoom_trans = _zoom_target.clone().sub(camera.position);
    _zoom_trans.x *= _zoom_rate;
    _zoom_trans.y *= _zoom_rate;
    _zoom_size = 300;
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

    // OBJ FOR SCREEN/WORLD CALCULATIONS
    projector = new THREE.Projector();

    // SET CAMERA
    camera.position.set(0, 0, 2);
    
    make_mesh();
}

// frame rendering functions
function runLoop() {
    requestAnimationFrame(runLoop);
    if(!update_camera()) {
        update();
    }
    update_labels();
    if(!update_camera()) {
        $('.point-label').each(function() {
            $(this).css({ visibility: 'visible' });
        });
    }
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
            if (INTERSECTED && (_zoomed_tri == null || INTERSECTED != _zoomed_tri)) {
                INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
                // call hover function
                if(INTERSECTED.unhover_function !== undefined)
                    INTERSECTED.unhover_function();
            }
            var i = 0;
            if($.inArray(intersects[i].object, _triangles) == -1) {
                i++;
                while(i < intersects.length
                    && $.inArray(intersects[i].object, _triangles) == -1)
                    i++;
            }
            if(i == intersects.length) return;

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
        if (INTERSECTED && (_zoomed_tri == null || INTERSECTED != _zoomed_tri)) {
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

// if there is currently a zoom, lerp camera to its target point
function update_camera() {
    if (_zoom_lerp != -1 && _zoom_target !== null) {
        _zoom_lerp += 1/60;
        camera.translateX(_zoom_trans.x);
        camera.translateY(_zoom_trans.y);
        if (_changed_zoom) {
            let dir = (_zoom == 1) ? _zoom_lerp : (_zoom_delay - _zoom_lerp);
            camera.zoom = 1 + dir / _zoom_delay;
            camera.updateProjectionMatrix();
        }
        if (_zoom_lerp >= _zoom_delay) {
            camera.position.set(_zoom_target.x, _zoom_target.y, camera.position.z);
            camera.zoom = 1 + _zoom;
            _zoom_lerp = -1;
            _zoom_target = null;
        }
        return true;
    }
    return false;
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
    $('.point-label-local').each(function() {
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

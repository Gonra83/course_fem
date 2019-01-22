/*
Written by Mina Pecheux in January 2019.
FEM Base Function visualizator.

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

// to clone an object with a deep copy (otherwise, geometry and material are shared)
THREE.Mesh.prototype.cloneDeep = function(object, recursive) {
    if(object === undefined) object = new THREE.Mesh(this.geometry, this.material.clone());
    THREE.Object3D.prototype.clone.call(this, object, recursive);
    return object;
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

var _point_size = 0.05;
var _point_def = 20; // nb of segments in geometry
var _hover_color = 0xff0000;
var _text_offset = 0.3;
var _mesh_bound;
var _mesh_centroid;

var _funclist_toggled = true;

// scene elements references (for post-creation update, description association...)
var _points = [], _edges = [], _connections = {};
var _cameraVisibilityHorizon;

// shape to display the current base function
var func_displayer;

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

$(document).click(function(event) {
    if (INTERSECTED !== null)
        set_func_displayer(_points.indexOf(INTERSECTED));
    else if (func_displayer !== undefined && func_displayer !== null) {
        cancel_removal = false;
        // if on a button: don't destroy the object immediately!
        $('.basefunc-btn').each(function() {
            let pos = $(this).position();
            if(pos.left <= mouse.x && mouse.x <= pos.left + $(this).width()
                && pos.top <= mouse.y && mouse.y <= pos.top + $(this).height()) {
                cancel_removal = true;
                return;
            }
        });
        if (!cancel_removal) {
            scene.remove(func_displayer.main);
            scene.remove(func_displayer.edges);
            func_displayer = null;
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
    let material = new THREE.MeshBasicMaterial({color: ptColor, side: THREE.BackSide});
    let point = new THREE.Mesh(geometry, material);
    point.position.set(x, -y, z); // vertical axis seems to be inverted...
    scene.add(point);
    _points.push(point);

    if(label != '') {
        let text = document.createElement('div');
        text.className = 'point-label';
        text.innerHTML = label;
        
        let label_world_pos; // positionate label "outside" of vertex (with respect to the centroid of the mesh)
        if (!(x == _mesh_centroid.x && y == _mesh_centroid.y && z == _mesh_centroid.z)) {
            let d = { x: _mesh_centroid.x - x, y: _mesh_centroid.y + y, z: _mesh_centroid.z - z };
            let c = (1 + _text_offset);
            label_world_pos = {
                x: _mesh_centroid.x - c*d.x,
                y: _mesh_centroid.y + c*d.y,
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
        container.appendChild(text);
    }
    
    // add empty list of neighbors for this vertex
    _connections[_points.length - 1] = [];
}

// create an edge between two points (specified by index in _points array)
function add_edge(p1, p2) {
    let pos1 = _points[p1].position;
    let pos2 = _points[p2].position;
    
    let geometry = new THREE.Geometry();
    geometry.vertices.push(
    	new THREE.Vector3(pos1.x, pos1.y, pos1.z),
    	new THREE.Vector3(pos2.x, pos2.y, pos2.z)
    );
    let material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.BackSide});
    let edge = new THREE.Line(geometry, material);
    scene.add(edge);
    _edges.push(edge);
    
    if (!_connections[p1].includes(p2)) _connections[p1].push(p2);
    if (!_connections[p2].includes(p1)) _connections[p2].push(p1);
}

// add a description to this object, to appear in the description-holder div on object hovering
function set_description(obj, desc, pos_x='left', pos_y='top', width=0.15, height=0.2, fill_color='rgba(0, 0, 0, 0.3)', text_color='rgba(255, 255, 255, 1)') {
    var desc_obj = $('.description-holder');
    var w = SCREEN_WIDTH * width;
    var h = SCREEN_HEIGHT * height;
    var x, y, hover_y;

    if(pos_x == 'left') x = 0;
    else if(pos_x == 'middle-left') x = SCREEN_WIDTH * 0.5 - (w + parseInt(desc_obj.css('paddingLeft')) * 2);
    else if(pos_x == 'middle-right') x = SCREEN_WIDTH * 0.5;
    else if(pos_x == 'right') x = SCREEN_WIDTH - (w + parseInt(desc_obj.css('paddingLeft')) * 2);

    if(pos_y == 'top') {
        y = 0;
        hover_y = y;
    }
    else if(pos_y == 'middle-top') {
        y = SCREEN_HEIGHT * 0.5 - (h + parseInt(desc_obj.css('paddingTop')) * 2);
        hover_y = y - h*0.5;
    }
    else if(pos_y == 'middle-bottom') {
        y = SCREEN_HEIGHT * 0.5;
        hover_y = y;
    }
    else if(pos_y == 'bottom') {
        y = SCREEN_HEIGHT - (h + parseInt(desc_obj.css('paddingTop')) * 2);
        hover_y = y - h*0.5;
    }

    TweenMax.set(desc_obj, {
        width: w,
        height: h,
        left: x,
        top: y,
        color: 'rgba(0,0,0,0)',
        background: 'rgba(0,0,0,0)'
    });
    obj.hover_function = function() {        // mouse in function
        desc_obj.html(desc);
        TweenMax.set(desc_obj, {
            width: w,
            height: h,
            left: x,
            top: y
        });
        TweenMax.to(desc_obj, 0.5, {
            height: h * 1.5,
            color: text_color,
            background: 'linear-gradient(' + fill_color + ', rgba(0,0,0,0))',
            top: hover_y
        });
    };
    obj.unhover_function = function() {     // mouse out function
        TweenMax.to(desc_obj, 0.5, {
            color: 'rgba(0,0,0,0)',
            background: 'rgba(0,0,0,0)',
            height: h,
            top: y
        });
    };
}

/* PROCESS FUNCTIONS */
// displays the base function at point of index 'p'
function set_func_displayer(p) {
    // recreate new geometry to match neighbor vertices
    let geometry = new THREE.Geometry();
    let ptPos = _points[p].position;
    // .. create point above (top of the "hat" function)
    geometry.vertices.push(new THREE.Vector3(ptPos.x, ptPos.y - 1, ptPos.z));
    // .. create vertices + faces by going through neighbors
    let i;
    for (i = 0; i < _connections[p].length; i++) {
        let pos = _points[_connections[p][i]].position;
        geometry.vertices.push(new THREE.Vector3(pos.x, pos.y, pos.z));
        if (i > 0) geometry.faces.push(new THREE.Face3(0, i, i+1));
    }
    geometry.faces.push(new THREE.Face3(0, i, 1));
    // .. compute normals
    geometry.computeVertexNormals();
    // .. switch mesh (remove old one, add new one)
    if (func_displayer !== undefined && func_displayer !== null) {
        scene.remove(func_displayer.main);
        scene.remove(func_displayer.edges);
    }
    let main_mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
        emissive: 0xff0000, transparent: true, opacity: 0.5, side: THREE.DoubleSide
    }));
    let edges = new THREE.EdgesGeometry(geometry);
    let edges_mesh = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
    func_displayer = { main: main_mesh, edges: edges_mesh };
    scene.add(func_displayer.main);
    scene.add(func_displayer.edges);
}

// foreach node, rewinds neighbor vertices to have a consistant polytope later on
function reorder_connections() {
    for (let p = 0; p < _points.length; p++) {
        let l = _connections[p];
        // if node is in a corner, add the node itself to have a proper geometry
        if (l.length < 4) l.push(p);
        // sort neighbor vertices by polar angle
        // .. compute centroid
        let cx = 0, cy = 0, cz = 0;
        for (let c = 0; c < l.length; c++) {
            cx += _points[l[c]].position.x;
            cy += _points[l[c]].position.y;
            cz += _points[l[c]].position.z;
        }
        cx /= l.length; cy /= l.length; cz /= l.length;
        // .. sort neighbors
        l.sort(function(a, b) { 
            return Math.atan2(_points[a].position.z - cz, _points[a].position.x - cx) - Math.atan2(_points[b].position.z - cz, _points[b].position.x - cx);
        })
    }
}

// sets the camera to look at the center of the mesh from a reasonable distance
function set_camera() {
    // set base camera distance, orientation and horizon
    camera.position.set(
        _mesh_centroid.x + _mesh_bound * Math.sin(CAM_AZIMUT) * Math.cos(CAM_DECLINATION),
        -_mesh_centroid.y + _mesh_bound * Math.sin(CAM_AZIMUT) * Math.sin(CAM_DECLINATION),
        _mesh_centroid.z + _mesh_bound * Math.cos(CAM_AZIMUT)
    );
    let cent = new THREE.Vector3(_mesh_centroid.x, -_mesh_centroid.y, _mesh_centroid.z);
    camera.lookAt(cent);
    controls.target.set(_mesh_centroid.x, -_mesh_centroid.y, _mesh_centroid.z);
    _cameraVisibilityHorizon = _mesh_bound * 1.2;
}

// clears the scene from all geometry and labels
function clear_scene() {
    for (let p = 0; p < _points.length; p++) {
        scene.remove(_points[p]);
    }
    for (let e = 0; e < _edges.length; e++) {
        scene.remove(_edges[e]);
    }
    _points = [];
    _edges = [];
    _connections = {};
    if (func_displayer !== undefined && func_displayer !== null) {
        scene.remove(func_displayer.main);
        scene.remove(func_displayer.edges);
        func_displayer = null;
    }
    
    $('.point-label').remove();
    $('.basefunc-list .list').empty();
}

function default_mesh() {
    // clear scene
    clear_scene();
    
    _mesh_centroid = { x: 0, y: 0, z: 0 };
    _mesh_bound = 2;
    
    // add mesh points
    add_point(-1, 0, 1, '0');
    add_point(0, 0, 1, '1');
    add_point(1, 0, 1, '2');
    add_point(-1, 0, 0, '3');
    add_point(0, 0, 0, '4');
    add_point(1, 0, 0, '5');
    add_point(-1, 0, -1, '6');
    add_point(0, 0, -1, '7');
    add_point(1, 0, -1, '8');
    add_edge(0, 1);
    add_edge(0, 4);
    add_edge(0, 3);
    
    add_edge(1, 4);
    add_edge(1, 5);
    add_edge(1, 2);
    
    add_edge(2, 5);

    add_edge(3, 4);
    add_edge(3, 7);
    add_edge(3, 6);

    add_edge(4, 7);
    add_edge(4, 5);
    add_edge(4, 8);

    add_edge(5, 8);

    add_edge(6, 7);

    add_edge(7, 8);
    
    // reset neighbors' order to have correct base functions display
    reorder_connections();

    // add descriptions to some elements
/*    var desc = 'Descriptions are <i>html content</i>. The description position can be changed around the screen to other anchored points :';
    desc += '<ul><li>left, middle-left, middle-right, right for x</li><li>top, middle-top, middle-bottom, bottom for y</li></ul>Default is left, top.';
    set_description(_points[0], desc);*/

    // set camera correctly
    set_camera();
    // set base functions list
    set_func_list();
}

function load_mesh() {
    // clear scene
    clear_scene();
    // load mesh from .msh file
    var f = document.querySelector('input[type=file]').files[0];
    // .. make temporary lists of points and edges (to compute mesh centroid
    // before actually instantiating objects)
    let pts = []
    let edges = []
    if (f) {
      var r = new FileReader();
      r.onload = function(e) {
          var contents = e.target.result;
          var ct = r.result;
          var lines = ct.split('\n');
          // (auto-skip first lines: mesh format, comments...)
          let nv = parseInt(lines[4]);
          for (let l = 5; l < 5 + nv; l++) {
              let tmp = lines[l].split(' ');
              pts.push([parseFloat(tmp[1]),parseFloat(tmp[3]),parseFloat(tmp[2]),tmp[0]]);
          }
          let ne = parseInt(lines[7 + nv]);
          for (let l = 7+nv; l < 7+nv+ne; l++) {
              let tmp = lines[l].split(' ');
              if (parseInt(tmp[1]) == 1) { // treat edges
                  edges.push([parseInt(tmp[5]) - 1, parseInt(tmp[6]) - 1]);
              }
              else if (parseInt(tmp[1]) == 2) { // treat triangles
                  edges.push([parseInt(tmp[5]) - 1, parseInt(tmp[7]) - 1]);
                  edges.push([parseInt(tmp[6]) - 1, parseInt(tmp[7]) - 1]);
              }
          }
          
          // .. compute centroid
          _mesh_centroid = get_bounds(pts)[1];
          
          // .. create real 3d entities
          for (let i = 0; i < pts.length; i++) {
              add_point(pts[i][0], pts[i][1], pts[i][2], pts[i][3]);
          }
          for (let i = 0; i < edges.length; i++) {
              add_edge(edges[i][0], edges[i][1]);
          }
          
          // reorder neighbors
          reorder_connections();
          // set camera correctly
          set_camera();
          // set base functions list
          set_func_list();
      }
      r.readAsText(f);
    } else {
      alert("Failed to load file");
    }
}

function set_func_list() {
    for (let p = 0; p < _points.length; p++) {
        var b = $('<button class="basefunc-btn">&psi;<sub>' + p + '</sub></button>').click(function () {
            set_func_displayer(p);
        });
        $('.basefunc-list .list').append(b);
    }
}

function toggle_func_list() {
    _funclist_toggled = !_funclist_toggled;
    if (_funclist_toggled) {
        $('.basefunc-list-btn').html('>');
        TweenMax.to($('.basefunc-list'), 0.5, {
            right: 0
        });
    }
    else {
        $('.basefunc-list-btn').html('<');
        TweenMax.to($('.basefunc-list'), 0.5, {
            right: '-200px'
        });
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
    
    // Check for the various File API support.
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
        alert('The File APIs are not fully supported in this browser.');
    }    
    // DEFAULT:
    default_mesh();
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
                INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
                // call hover function
                if(INTERSECTED.unhover_function !== undefined)
                    INTERSECTED.unhover_function();
            }
            // ignore checked out objects
            var i = 0;
            if($.inArray(intersects[i].object, _points) == -1) {
                i++;
                while(i < intersects.length && $.inArray(intersects[i].object, _points) == -1)
                    i++;
            }
            if(i == intersects.length) return;
            // store reference to closest object as current intersection object
            INTERSECTED = intersects[i].object;
            // store color of closest object (for later restoration)
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            // set a new color for closest object
            INTERSECTED.material.color.setHex(_hover_color);
            // call hover function
            if(INTERSECTED.hover_function !== undefined)
                INTERSECTED.hover_function();
        }
    }
    else { // there are no intersections
        // restore previous intersection object (if it exists) to its original color
        if (INTERSECTED) {
            INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
            // call hover function
            if(INTERSECTED.unhover_function !== undefined)
                INTERSECTED.unhover_function();
        }
        // remove previous intersection object reference
        //     by setting current intersection object to "nothing"
        INTERSECTED = null;
    }

    // update OrbitalControls, i.e. camera movement
    controls.update();
}

// move around points of interest labels
function update_labels() {
    $('.point-label').each(function() {
        var point_pos_tmp = $(this).attr('data-point-pos').split('/');
        var pos_tmp = $(this).attr('data-pos').split('/');
        var point_pos = new THREE.Vector3(parseFloat(point_pos_tmp[0]), parseFloat(point_pos_tmp[1]), parseFloat(point_pos_tmp[2]));
        var label_world_pos = new THREE.Vector3(parseFloat(pos_tmp[0]), parseFloat(pos_tmp[1]), parseFloat(pos_tmp[2]));

        var cameraToPoint = point_pos.clone().sub(camera.position);
        var isVisible = (cameraToPoint.length() > _cameraVisibilityHorizon) ? 'hidden' : 'visible';

        var label_screen_pos = label_world_pos.project(camera);
        label_screen_pos.x = (label_screen_pos.x + 1) * 0.5 * SCREEN_WIDTH;
        label_screen_pos.y = (label_screen_pos.y - 1) * 0.5 * SCREEN_HEIGHT;

        $(this).css({
            left: label_screen_pos.x,
            top: -label_screen_pos.y,
            visibility: isVisible
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

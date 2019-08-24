// Include <script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script> in your code!
var colormap_step = 10;
var viridis = d3.scaleSequential().domain([0,colormap_step])
  .interpolator(d3.interpolateViridis);

var data_pts = [
    {'x':0,   'y': 0,  'tri':[], 'local':[]},
    {'x':140, 'y': 10, 'tri':[], 'local':[]},
    {'x':100, 'y': 80, 'tri':[], 'local':[]},
    {'x':-10, 'y': 120,'tri':[], 'local':[]},
    {'x':45,  'y': 50, 'tri':[], 'local':[]},
    {'x':150, 'y': 130,'tri':[], 'local':[]} 
];
var mesh_triangles= [[0,1,4], [4,1,2], [3, 4, 2], [3,0,4], [2,3,5], [1,2,5]];
// for each point, find the triangles it belongs to
mesh_triangles.forEach(function(t, i) {
    t.forEach(function(pt, loc){
        data_pts[pt].tri.push(i);
        data_pts[pt].local.push(loc);
    })
});

// Reference triangle
var ref_pts = [
    {'x':0, 'y': 0},
    {'x':1, 'y': 0},
    {'x':0, 'y': 1}
];
var middle_pts = [
    {'x':0.5, 'y': 0.5},
    {'x':0, 'y': 0},
    {'x':0, 'y': 0}
]
var ref_triangle = [0,1,2];

var triangle_color = {
    "inactive": "none"
};
var point_color = {
    "one": viridis(colormap_step),
    "zero": viridis(0),
    "inactive" : "GhostWhite"
};
var txt_color = {
    "inactive" : "black",
    "one": "black",
    "zero": "white"
};

var r = 4.0; // radius of vert
var max_x =0.0, max_y=0.0;
var min_x =10000.0, min_y=1000.0;
for (let i = 0; i < data_pts.length; i++)
{
    min_x = Math.min(parseFloat(data_pts[i].x), min_x);
    min_y = Math.min(parseFloat(data_pts[i].y), min_y);
    max_x = Math.max(parseFloat(data_pts[i].x), max_x);
    max_y = Math.max(parseFloat(data_pts[i].y), max_y);
}
var padding_colormap = 10;
var colormap_y = 10;
var size_x = (max_x - min_x) + 3*r;
var size_y = (max_y - min_y) + 3*r + 2*padding_colormap + colormap_y;

var div = d3.select('figure.app-basis-function')
            .attr('style', 'text-align:center')
            ;

var title=div.insert('p', ":first-child")
            .text('Maillage')
            .attr('style', 'margin:auto; font-size:1.5em;font-weight:bold;color:darkblue;');

var svg = div.insert('svg', ":first-child")
                .attr('viewBox', parseFloat(min_x - 1.5*r) + " " + parseFloat(min_y - 1.5*r)+ " " + parseFloat(size_x)  + " " +  parseFloat(size_y))
                .attr('preserveAspectRatio', "xMidYMid meet")
                .attr('width', size_x)
                .attr('height', size_y)
                .attr('style', 'width:75%; height:auto;')
;
// Color Gradient
var defs = svg.append('defs');
var grad = defs.selectAll('linearGradient')
            .data(ref_triangle)
            .enter()
            .append('linearGradient')
            .attr('id', d=> "gradtri-" + d)
            .attr('x1', d=>middle_pts[d].x)
            .attr('x2', d=>ref_pts[d].x)
            .attr('y1', d=>middle_pts[d].y)
            .attr('y2', d=>ref_pts[d].y)
;

// Colormap
var colormap = defs.append('linearGradient')
            .attr('id', "colormap")
            .attr('x', '0%')
            .attr('x2', '100%')
            .attr('y1', '0%')
            .attr('y2', '0%')
    ;

for (var i = 0; i < colormap_step+1; i++){
    var p = i*100/colormap_step;
    if(i==colormap_step)
    { p = 96;}
    svg.selectAll('linearGradient')
        .append('stop')
        .attr('offset', p + "%")
        .attr('stop-color', viridis(i));
}

var colormap_group = svg.append('g');
var colormap_rect = colormap_group.append('rect')
                  .attr('x', min_x)
                  .attr('y', (parseFloat(max_y) + padding_colormap))
                  .attr('width', size_x)
                  .attr('height', colormap_y)
                  .attr('fill', 'url(#colormap)')
;

for (var i = 0; i < 3; i ++)
{
var colormap_text = colormap_group.append('text')
                  .attr('x', min_x + i*(max_x - min_x)/2)
                  .attr('y', (parseFloat(max_y) + 1.75*padding_colormap + colormap_y))
                  .attr('width', size_x)
                  .attr('height', colormap_y)
                  .text(parseFloat(i)/2)
                  .attr('font-size', '0.4em')
;
}


var all_triangles = svg.append('g')
    .attr('class','all_triangles')
    .selectAll('g')
    .data(mesh_triangles)
    .enter()
    .append('polygon')
    .attr('class', function(d,i){ return 'd3-triangle d3-triangle-' + i;})
    .attr('fill', 'none')
    .attr('pointer-events', 'fill')
    .attr('stroke', 'black')
    .attr('stroke-width', '2px')
    .attr('active', '0')
    .attr('points', '0 0, 1 0, 0 1')
    .attr('transform', function(d){
        let aa = parseFloat(data_pts[d[1]].x - data_pts[d[0]].x);
        let bb = parseFloat(data_pts[d[1]].y - data_pts[d[0]].y);
        let cc = parseFloat(data_pts[d[2]].x - data_pts[d[0]].x);
        let dd = parseFloat(data_pts[d[2]].y - data_pts[d[0]].y);
        let ee = data_pts[d[0]].x;
        let ff = data_pts[d[0]].y;
        return "matrix(" + aa + " " + bb + " " + cc + " " + dd + " " + ee + " " + ff + ")";})
    .attr('vector-effect', 'non-scaling-stroke')
    ;

// Build all vertices
var all_pts = svg.append('g')
    .attr('class','all_pts')
    .selectAll('g')
    .data(data_pts)
    .enter()
    .append('g')
    .attr('class', function(d,i){return 'd3-vertex d3-vertex-'+i;})
    .attr('style', 'cursor:pointer;')
    .on('click', function(d,i){
        activate(this, d, i );
        })
    .attr('active', '0')
    ;
// Add the circle
var all_pts_circle = all_pts.append('circle')
    .attr('cx', function(d){return d.x})
    .attr('cy', function(d){return d.y})
    .attr('r', r)
    .attr('fill', point_color.inactive)
    .attr('stroke', 'black')
    ;
// Add the text value of points
/*var all_pts_txt = all_pts.append('text')
    .attr('x', function(d){return d.x})
    .attr('y', function(d){return d.y})
    .attr('text-anchor', 'middle')
    .attr('dy',  "0.3em")
    .text(function(d,i){return i;})
    .attr('font-size', '0.5em')
    .attr('fill', txt_color.inactive)
    ;
*/


// FUNCTIONS
//============

function desactivate_vertices(){
    d3.selectAll(".d3-vertex")
            .select('circle')
            .attr('fill', point_color.inactive)
            .attr('stroke', 'black')
    ;
    d3.selectAll(".d3-vertex")
            .select('text')
            .attr('fill', txt_color.inactive)
    ;
    d3.selectAll(".d3-vertex").attr("active", "0");
}

function activate_vertex(t){
    d3.selectAll(".d3-vertex")
            .select('circle')
            .attr('fill', point_color.zero)
            .attr('stroke', 'black')
    ;
    d3.selectAll(".d3-vertex")
            .select('text')
            .attr('fill', txt_color.zero)
    ;
    d3.select(t).attr('active', '1');
    d3.select(t).select('circle')
    .attr('fill', point_color.one)
    .attr('stroke', 'black')
    d3.select(t).select('text')
    .attr('fill', txt_color.one)
    ;
}

function activate_triangles(t, d){
    svg.selectAll('.d3-triangle')
        .attr('fill', viridis(0))
    ;
    d.tri.forEach(function(i, index) {
        svg.select('.d3-triangle-'+i)
        .attr('fill', 'url(#gradtri-'+ d.local[index]+')')
        .attr('stroke-opacity', '1')
        .attr('active', "1")
    });
}

function desactivate_triangles(){
    svg.selectAll('.d3-triangle')
        .attr('fill', triangle_color.inactive)
        .attr('stroke-opacity', '1')
        .attr('active', "0")
    ;
}


function activate(t, d, i){
    let new_status = (1+parseInt(d3.select(t).attr('active')))%2;
    desactivate_triangles();
    desactivate_vertices();
    if(new_status == 1)
    {
        activate_vertex(t, d);
        activate_triangles(t,d);
        title.text('Fonction de forme du sommet ' + i);
    }
    else{
        title.text('Maillage');
    }
}

function p1(i, x, y){


}
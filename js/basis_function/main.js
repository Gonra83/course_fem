var data_pts = [
    {'coord':[0,0],    'tri':[]},
    {'coord':[140,10], 'tri':[]},
    {'coord':[100,80], 'tri':[]},
    {'coord':[-10,120],'tri':[]},
    {'coord':[45,50],  'tri':[]},
    {'coord':[150,130],'tri':[]} 
];
var mesh_triangles= [[0,1,4], [4,1,2], [3, 4, 2], [3,0,4], [2,3,5], [1,2,5]];

// for each point, find the triangles it belongs to
mesh_triangles.forEach(function(t, i) {
    t.forEach(function(pt){
        data_pts[pt].tri.push(i);
    })
});


console.log(data_pts)

var triangle_color = {
    "inactive": "none", 
    "active": "GhostWhite"
};
var point_color = {
    "active": "darkblue",
    "inactive" : "GhostWhite"
};
var txt_color = {
    "active": "white",
    "inactive" : "black"
};

var r = 10.0; // radius of vert
var max_x =0.0, max_y=0.0;
var min_x =10000.0, min_y=1000.0;
for (let i = 0; i < data_pts.length; i++)
{
    min_x = Math.min(parseFloat(data_pts[i].coord[0]), min_x);
    min_y = Math.min(parseFloat(data_pts[i].coord[1]), min_y);
    max_x = Math.max(parseFloat(data_pts[i].coord[0]), max_x);
    max_y = Math.max(parseFloat(data_pts[i].coord[1]), max_y);
}
var size_x = (max_x - min_x) + 3*r;
var size_y = (max_y - min_y) + 3*r;

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
                

var all_triangles = svg.append('g')
    .attr('class','all_triangles')
    .selectAll('g')
    .data(mesh_triangles)
    .enter()
    .append('polygon')
    .attr('points', function(d){return data_pts[d[0]].coord[0] + " " + data_pts[d[0]].coord[1] + ", " + data_pts[d[1]].coord[0] + " " + data_pts[d[1]].coord[1] + ", " + data_pts[d[2]].coord[0] + " " + data_pts[d[2]].coord[1];})
    .attr('class', function(d,i){ return 'd3-triangle d3-triangle-' + i;})
    .attr('fill', 'none')
    .attr('pointer-events', 'fill')
    .attr('stroke', 'black')
    .attr('active', '0')
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
        activate(this, d);
        })
    .attr('active', '0')
    ;
// Add the circle
var all_pts_circle = all_pts.append('circle')
    .attr('cx', function(d){return d.coord[0]})
    .attr('cy', function(d){return d.coord[1]})
    .attr('r', r)
    .attr('fill', point_color.inactive)
    .attr('stroke', 'black')
    ;
// Add the text value of points
var all_pts_txt = all_pts.append('text')
    .attr('x', function(d){return d.coord[0]})
    .attr('y', function(d){return d.coord[1]})
    .attr('text-anchor', 'middle')
    .attr('dy',  "0.3em")
    .text(function(d,i){return i;})
    .attr('font-size', '0.5em')
    .attr('fill', txt_color.inactive)
    ;



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
    d3.select(t).attr('active', '1');
    d3.select(t).select('circle')
    .attr('fill', point_color.active)
    .attr('stroke', 'black')
    d3.select(t).select('text')
    .attr('fill', txt_color.active)
    ;
}

function activate_triangles(t, d){
    svg.selectAll('.d3-triangle')
        .attr('fill', triangle_color.inactive)
    ;
    d.tri.forEach(function(i) {
        svg.select('.d3-triangle-'+i)
        .attr('fill', triangle_color.active)
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


function activate(t, d){
    let new_status = (1+parseInt(d3.select(t).attr('active')))%2;
    desactivate_triangles();
    desactivate_vertices();
    if(new_status == 1)
    {

        activate_vertex(t, d);
        activate_triangles(t,d);
    }
}

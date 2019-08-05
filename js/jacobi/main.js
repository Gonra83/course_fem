var scale = 10000;
var mesh_pts = [
    { 'x': 0, 'y':100}, 
    { 'x': 0, 'y':0}, 
    { 'x': 100, 'y':100}
];

mesh_triangles = [[0,1,2]];

var triangle_color = {
    "inactive": "none", 
    "active": "GhostWhite"
};
var point_color = {
    "global": "GhostWhite",
    "local" : "darkblue"
};
var txt_color = {
    "global": "black",
    "local" : "white"
};

var r = 10.0; // radius of vert
var max_x =150.0, max_y=120.0;
var min_x =-50.0, min_y=-20.0;
var size_x = (max_x - min_x) + 3*r;
var size_y = (max_y - min_y) + 3*r;

var div = d3.select('figure.app-jacobi')
            .attr('style', 'text-align:center')
            ;

var title=div.insert('p', ":first-child")
            .text('Jacobien = ' + compute_jacobian(scale))
            .attr('style', 'margin:auto; font-size:1.5em;font-weight:bold;color:darkblue;');

var svg = div.insert('svg', ":first-child")
                .attr('viewBox', parseFloat(min_x - 1.5*r) + " " + parseFloat(min_y - 1.5*r)+ " " + parseFloat(size_x)  + " " +  parseFloat(size_y))
                .attr('preserveAspectRatio', "xMidYMid meet")
                .attr('style', 'width:100%; border:solid 1px;')
                ;
                
var triangle = svg.selectAll('polygon')
    .data(mesh_triangles)
    .join('polygon')
    .attr('points', function(d){return mesh_pts[d[0]].x + " " + mesh_pts[d[0]].y + ", " + mesh_pts[d[1]].x + " " + mesh_pts[d[1]].y + ", " + mesh_pts[d[2]].x + " " + mesh_pts[d[2]].y;})
    .attr('class', 'd3_triangle')
    .attr('fill', 'none')
    .attr('stroke', 'black')
    ;

// Build all vertices
var all_pts = svg.append('g')
    .attr('class','all_pts')
    .selectAll('g')
    .data(mesh_pts)
    .join('g')
    .attr('class', function(d,i){return 'd3_point vertex-' +  i;})
    .attr('style', 'cursor:pointer;')
    ;
// Add the circle
var all_pts_circle = all_pts.append('circle')
    .attr('cx', function(d){return d.x})
    .attr('cy', function(d){return d.y})
    .attr('r', r)
    .attr('fill', point_color.global)
    .attr('stroke', 'black')
    ;
// Add the text value of points
var all_pts_txt = all_pts.append('text')
    .attr('x', function(d){return d.x})
    .attr('y', function(d){return d.y})
    .attr('text-anchor', 'middle')
    .attr('dy',  "0.3em")
    .text(function(d,i){return i;})
    .attr('font-size', '0.5em')
    .attr('fill', txt_color.global)
    ;

// FUNCTIONS
//============

var drag_handler = d3.drag()
    .on("end", function(d){
    })
    .on("drag", function(d) {
        d3.select(this).select('circle')
            .attr("cx", d.x = d3.event.x  )
            .attr("cy", d.y = d3.event.y  )
            ;
        d3.select(this).select('text')
            .attr("x", d.x = d3.event.x  )
            .attr("y", d.y = d3.event.y  )
            ;
        let jac = compute_jacobian(scale);
        svg.selectAll('polygon')
            .attr('points', function(d){return mesh_pts[0].x + " " + mesh_pts[0].y + ", " + mesh_pts[1].x + " " + mesh_pts[1].y + ", " + mesh_pts[2].x + " " + mesh_pts[2].y;})
            .attr('fill', jac > 0 ? 'none':'red')
            ;
        title.text('Jacobien = ' + Math.round(jac*100)/100)
             .attr('style', 'margin:auto; font-size:1.5em;font-weight:bold;color:' + (jac>0?'darkblue;':'red;'));
            ;

    });
      
      
//apply the drag_handler to our circles 
drag_handler(all_pts);    

function compute_jacobian(scale){
//   xp2−xp1)(yp3−yp1)−(xp3−xp1)(yp2−yp1
    return (((mesh_pts[1].x - mesh_pts[0].x) * (mesh_pts[2].y - mesh_pts[0].y)
    -(mesh_pts[2].x - mesh_pts[0].x) * (mesh_pts[1].y - mesh_pts[0].y))/scale);
}
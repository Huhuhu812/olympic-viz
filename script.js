"use strict";

// draw the map
var map = d3.geomap().geofile("/d3-geomap/topojson/world/countries.json");
// set width and height

map.draw(d3.select("#map"));

var svg = d3.select("svg");

var aa = [-122.490402, 37.786453];
var bb = [-87.6235219, 41.886008];

var projection = d3
  .geoNaturalEarth1()
  .scale(map.scale())
  .translate(map.translate());

svg
  .selectAll("circle")
  .data([aa, bb])
  .enter()
  .append("circle")
  .attr("cx", function(d) {
    console.log(projection(d));
    return projection(d)[0];
  })
  .attr("cy", function(d) {
    return projection(d)[1];
  })
  .attr("r", "8px")
  .attr("fill", "red");

// var width = window.innerWidth,
//   height = window.innerHeight,
//   sizeDivisor = 100,
//   nodePadding = 2.5;

// var svg = d3
//   .select("body")
//   .append("svg")
//   .attr("width", width)
//   .attr("height", height);

// var color = d3.scaleOrdinal([
//   "#66c2a5",
//   "#fc8d62",
//   "#8da0cb",
//   "#e78ac3",
//   "#a6d854",
//   "#ffd92f",
//   "#e5c494",
//   "#b3b3b3"
// ]);

// var simulation = d3
//   .forceSimulation()
//   .force(
//     "forceX",
//     d3
//       .forceX()
//       .strength(0.1)
//       .x(width * 0.5)
//   )
//   .force(
//     "forceY",
//     d3
//       .forceY()
//       .strength(0.1)
//       .y(height * 0.5)
//   )
//   .force(
//     "center",
//     d3
//       .forceCenter()
//       .x(width * 0.5)
//       .y(height * 0.5)
//   )
//   .force("charge", d3.forceManyBody().strength(-15));

// d3.csv("data.csv", types, function(error, graph) {
//   if (error) throw error;

//   // sort the nodes so that the bigger ones are at the back
//   graph = graph.sort(function(a, b) {
//     return b.size - a.size;
//   });

//   //update the simulation based on the data
//   simulation
//     .nodes(graph)
//     .force(
//       "collide",
//       d3
//         .forceCollide()
//         .strength(0.5)
//         .radius(function(d) {
//           return d.radius + nodePadding;
//         })
//         .iterations(1)
//     )
//     .on("tick", function(d) {
//       node
//         .attr("cx", function(d) {
//           return d.x;
//         })
//         .attr("cy", function(d) {
//           return d.y;
//         });
//     });

//   var node = svg
//     .append("g")
//     .attr("class", "node")
//     .selectAll("circle")
//     .data(graph)
//     .enter()
//     .append("circle")
//     .attr("r", function(d) {
//       return d.radius;
//     })
//     .attr("fill", function(d) {
//       return color(d.continent);
//     })
//     .attr("cx", function(d) {
//       return d.x;
//     })
//     .attr("cy", function(d) {
//       return d.y;
//     })
//     .call(
//       d3
//         .drag()
//         .on("start", dragstarted)
//         .on("drag", dragged)
//         .on("end", dragended)
//     );
// });

// function dragstarted(d) {
//   if (!d3.event.active) simulation.alphaTarget(0.03).restart();
//   d.fx = d.x;
//   d.fy = d.y;
// }

// function dragged(d) {
//   d.fx = d3.event.x;
//   d.fy = d3.event.y;
// }

// function dragended(d) {
//   if (!d3.event.active) simulation.alphaTarget(0.03);
//   d.fx = null;
//   d.fy = null;
// }

// function types(d) {
//   d.gdp = +d.gdp;
//   d.size = +d.gdp / sizeDivisor;
//   d.size < 3 ? (d.radius = 3) : (d.radius = d.size);
//   return d;
// }

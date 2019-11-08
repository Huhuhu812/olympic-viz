"use strict";

// draw the map
// var map = d3.geomap().geofile("/d3-geomap/topojson/world/countries.json");
// set width and height

var width = 950,
  height = 550;

// set projection
var projection = d3.geoMercator();

// create path variable
var path = d3.geoPath().projection(projection);

d3.json("/d3-geomap/topojson/world/countries.json", function(topo) {
  console.log(topo);

  var countries = topojson.feature(topo, topo.objects.units);
  // set projection parameters
  // projection.scale(1000).center([-106, 37.5]);

  // create svg variable
  var svg = d3
    .select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  // map.draw(d3.select("#map"));

  // var svg = d3.select("svg");
  function onClick(d, i) {
    var city = d3.select(this).data()[0].city;
  }
  d3.csv(
    "data/city_info.csv",
    d => {
      return { city: d.city, longitude: +d.longitude, latitude: +d.latitude };
    },
    data => {
      svg
        .selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("class", "feature")
        .style("fill", "gainsboro")
        .attr("d", path);

      // put boarder around states
      svg
        .append("path")
        .datum(
          topojson.mesh(topo, topo.objects.units, function(a, b) {
            return a !== b;
          })
        )
        .attr("class", "mesh")
        .attr("d", path);

      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "pin")
        .attr("cx", function(d) {
          return projection([d.longitude, d.latitude])[0];
        })
        .attr("cy", function(d) {
          return projection([d.longitude, d.latitude])[1];
        })
        .attr("r", "8px")
        .attr("fill", "tomato")
        .attr("stroke", "gray")
        .on("click", onClick);
    }
  );
});

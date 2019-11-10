"use strict";

// draw the map
// var map = d3.geomap().geofile("/d3-geomap/topojson/world/countries.json");
// set width and height
function populateDropdown() {
  let dropdown = $(".dd");

  dropdown.empty();

  dropdown.append('<option selected="true" disabled>Click on map</option>');
  dropdown.prop("selectedIndex", 0);
}

populateDropdown();

var width1 = 0.6 * window.innerWidth,
  height1 = 0.6 * window.innerHeight;

// set projection
var projection = d3.geoMercator();

// create path variable
var path = d3.geoPath().projection(projection);

// load alllll the data
d3.queue()
  .defer(d3.json, "/d3-geomap/topojson/world/countries.json")
  .defer(d3.csv, "/data/athlete_medal_count.csv")
  .defer(d3.csv, "/data/attending_athletes.csv")
  .defer(d3.csv, "/data/nation_medal_count.csv")
  .await(ready);

// Handle populateDropdown

function ready(error, topo, medalCount, conAttend, nationMedal) {
  var countries = topojson.feature(topo, topo.objects.units);

  function update(year) {
    //------------------------TABLE----------------------------------
    // update table with athletes of the year
    var filterMedalCount = medalCount.filter(d => {
      return d.year == year;
    });

    var myArray = [];
    filterMedalCount.forEach(function(d) {
      // now we add another data object value, a calculated value.
      // here we are making strings into numbers using type coercion
      // d.rank = +d.rank;
      d.medals = +d.medals;
      // Add a new array with the values of each:
      myArray.push([d.name, d.sex, d.team, d.sport, d.medals]);
    });
    // console.log(myData);
    // console.log(myArray);
    //sort data by difference
    myArray.sort(function(a, b) {
      return b[4] - a[4];
    });
    // You could also have made the new array with a map function!
    //using colors and fonts from the UNICEF Style Guide
    var table = d3.select("table");

    var tablebody = table.select("tbody");
    tablebody.selectAll("tr").remove();

    var rows = tablebody
      .selectAll("tr")
      .data(myArray.slice(0, 10))
      .enter()
      .append("tr");
    // We built the rows using the nested array - now each row has its own array.
    cells = rows
      .selectAll("td")
      // each row has data associated; we get it and enter it for the cells.
      .data(function(d) {
        // console.log(d);
        return d;
      })
      .enter()
      .append("td")
      .text(function(d) {
        return d;
      });
    //-----------------------BAR---------------------------------
    var filteredAttend = conAttend.filter(d => {
      return d.year == year;
    });

    svg2.selectAll("rect").remove();

    var x = d3
      .scaleBand()
      .range([0, width3])
      .domain(
        filteredAttend.map(function(d) {
          return d.continent;
        })
      )
      .padding(0.2);

    var y = d3
      .scaleLinear()
      .domain([0, 5000])
      .range([height3, 0]);
    svg2.append("g").call(d3.axisLeft(y));

    svg2
      .selectAll("mybar")
      .data(filteredAttend)
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return x(d.continent);
      })
      .attr("width", x.bandwidth())
      .attr("fill", "#69b3a2")
      // no bar at the beginning thus:
      .attr("height", function(d) {
        return height3 - y(0);
      }) // always equal to 0
      .attr("y", function(d) {
        return y(0);
      });

    // Animation
    svg2
      .selectAll("rect")
      .transition()
      .duration(800)
      .attr("y", function(d) {
        return y(+d.num);
      })
      .attr("height", function(d) {
        return height3 - y(d.num);
      })
      .delay(function(d, i) {
        // console.log(i);
        return i * 100;
      });
    // ---------------------- bubbles ---------
    d3.select("#bubbles")
      .selectAll(".node")
      .remove();
    var newGraph = nationMedal.filter(d => {
      return d.year == year;
    });
    newGraph = newGraph.map(types);
    drawBub(null, newGraph);
  }

  // handle clicking on dots
  function onClick() {
    var selected = d3.select(this).data()[0];
    console.log(`City: ${selected.city}
    Years: ${selected.year}`);
    d3.select(".cityname")
      .select("u")
      .html(selected.city);
    // ----------dropdown-----------
    var dropdown = d3.select(".dd");
    dropdown.selectAll("option").remove();
    dropdown
      .selectAll("option")
      .data(selected.year)
      .enter()
      .append("option")
      .property("value", d => {
        return d;
      })
      .html(d => {
        return d;
      });
    dropdown.on("change", function(d) {
      update(this.selectedOptions[0].value);
    });

    update(selected.year[0]);
  }
  // create svg variable
  var svg = d3
    .select("#map")
    .append("svg")
    .attr("width", width1)
    .attr("height", height1)
    .append("g");

  // map.draw(d3.select("#map"));

  d3.csv(
    "data/city_info.csv",
    d => {
      var years = d.year.split(";");
      // if (years.length === 1) {
      //   years = years[0];
      // }
      return {
        city: d.city,
        longitude: +d.longitude,
        latitude: +d.latitude,
        year: years
      };
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

      // put boarder around countries
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
}

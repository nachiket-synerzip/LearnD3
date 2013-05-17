  var width = 960,
    height = 1160;

  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("data/uk.json", function(error, uk) {
  console.log(uk);
  console.log(d3.geo);
  var subunits = topojson.feature(uk, uk.objects.subunits),
  //projection = d3.geo.mercator();//.scale(500).translate([width / 2, height]),
  // Albers equal-area conic projection : http://en.wikipedia.org/wiki/Albers_projection
  projection = d3.geo.albers()
    .center([0, 55.4])
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(6000)
    .translate([width / 2, height / 2]);
  
  path = d3.geo.path().projection(projection);
  svg.selectAll(".subunit")
    .data(topojson.feature(uk, uk.objects.subunits).features)
  .enter().append("path")
    .attr("class", function(d) { return "subunit " + d.id; })
    .attr("d", path);
  //svg.append("path").datum(subunits).attr("d", path);
  //boundary between countries (without irl)
  svg.append("path")
    .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return a !== b && a.id !== "IRL"; }))
    .attr("d", path)
    .attr("class", "subunit-boundary");
  
  //boundary for irl
  svg.append("path")
    .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return a === b && a.id === "IRL"; }))
    .attr("d", path)
    .attr("class", "subunit-boundary IRL");
  
  //draw circles for each of the places
  svg.append("path")
    .datum(topojson.feature(uk, uk.objects.places))
    .attr("d", path)
    .attr("class", "place");
  
  //labels for the places
  svg.selectAll(".place-label")
    .data(topojson.feature(uk, uk.objects.places).features)
  .enter().append("text")
    .attr("class", "place-label")
    .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
    .attr("dy", ".35em")
    .text(function(d) { return d.properties.name; });
  
  svg.selectAll(".place-label")
    .attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
    .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; });
    
  //countyr labels
  svg.selectAll(".subunit-label")
    .data(topojson.feature(uk, uk.objects.subunits).features)
  .enter().append("text")
    .attr("class", function(d) { return "subunit-label " + d.id; })
    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .text(function(d) { return d.properties.name; });
});
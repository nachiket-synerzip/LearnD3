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
  svg.append("path").datum(subunits).attr("d", path);
});
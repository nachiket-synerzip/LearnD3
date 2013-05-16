  var width = 960,
    height = 1160;

  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("data/uk.json", function(error, uk) {
  console.log(uk);
  svg.append("path")
      .datum(topojson.feature(uk, uk.objects.subunits))
      .attr("d", d3.geo.path().projection(d3.geo.mercator()));
});
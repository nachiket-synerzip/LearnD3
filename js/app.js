define(['openlayers', 'd3'], function(OpenLayers, d3) {
	var apiKey = "AlucD6JGAHASammfZJ_BZLSkQ7By8czRedItcP4Lz3fbiWWQKylitB6XsnGeJqRC";
	var map;

	function initMap() {
		var extent = [
			-20037508.34, -20037508.34,
			20037508.34, 20037508.34
		];

		map = new OpenLayers.Map('map', {
			numZoomLevels: 20,
			projection: new OpenLayers.Projection("EPSG:900913"),
			maxExtent: extent,
			restrictedExtent: extent,
			controls: [
				new OpenLayers.Control.Navigation(),
				new OpenLayers.Control.Zoom(),
				new OpenLayers.Control.ScaleLine(),
				new OpenLayers.Control.LayerSwitcher(),
				new OpenLayers.Control.MousePosition(),
				new OpenLayers.Control.KeyboardDefaults()
			]
		});

		var hybrid = new OpenLayers.Layer.Bing({
			key: apiKey,
			type: "Road",
			name: "Bing Road"
		});

		map.addLayers([hybrid]);

		map.setCenter(new OpenLayers.LonLat(-96, 37).transform("EPSG:4326", "EPSG:900913"), 4);

		d3.json("data/us-states.json", function (data) {
			var overlay = new OpenLayers.Layer.Vector("states", {}, {layerId: "customStationsLayer"});
			// Add the container when the overlay is added to the map.
			overlay.afterAdd = function () {
				var ID = "customStationsLayer";
				overlay.div.id = ID;
				//get the vector layer div element
				var div = d3.selectAll("#" + overlay.div.id);
				//remove the existing svg element and create a new one
				div.selectAll("svg").remove();
				var svg = div.append("svg");
				//Add a G (group) element
				g = svg.append("g");
				var bounds = d3.geo.bounds(data),
				path = d3.geo.path().projection(project);
				console.log(bounds);
				console.log(data);

				var feature = g.selectAll("path")
				.data(data.features)
				.enter().append("path");

				map.events.register("moveend", map, reset);
				reset();

				function reset() {
					var bottomLeft = project(bounds[0]),
					topRight = project(bounds[1]);
					console.log(bottomLeft);

					svg.attr("width", topRight[0] - bottomLeft[0])
					.attr("height", bottomLeft[1] - topRight[1])
					.style("margin-left", bottomLeft[0] + "px")
					.style("margin-top", topRight[1] + "px");

					g.attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");

					feature.attr("d", path);
				}

				function project(x) {
					var point = map.getViewPortPxFromLonLat(new OpenLayers.LonLat(x[0], x[1])
					.transform("EPSG:4326", "EPSG:900913"));
					return [point.x, point.y];
				}
			}
			map.addLayer(overlay);
		});
	}
	return {
		start: function() {
			initMap();
		}
	}
});

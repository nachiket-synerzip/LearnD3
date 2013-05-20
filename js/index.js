require.config({
    baseUrl : "/js/",
    paths : {
        jquery : 'libs/jquery/jquery-1.9.1.min',
        jquery_ui : 'libs/jquery/jquery-ui',
        openlayers: 'libs/openlayers/OpenLayers',
		d3: 'http://d3js.org/d3.v2',
		app: 'app'
    },
    shim: {
        'openlayers': {
        	exports: 'OpenLayers'
        },
        'd3': {
        	exports: 'd3'
        }
    }
});

require(['app'], function(App) {
	App.start();
});

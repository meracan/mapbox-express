mapboxgl.accessToken = 'pk.eyJ1IjoianVsaWVuY291c2luZWF1IiwiYSI6ImNpc2h1OHN2bjAwNzMyeG1za3U0anczcTgifQ.KCp_hDxNidB1n29_yBPXdg';
const url=window.location.origin
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: [-68.13734351262877, 45.137451890638886],
zoom: 5
});
 
map.on('load', function() {
  // Sources
  map.addSource('exampleG', {'type': 'geojson','data': url+"/data/example.geojson"});
  map.addSource('exampleT', {'type': 'vector','tiles': [url+"/tiles/example/{z}/{x}/{y}.pbf"]});

  // Layers
  map.addLayer({'id': 'fill','type': 'fill','source': 'exampleT','source-layer': 'example','paint': {'fill-color': '#088','fill-opacity': 0.8}});
  map.addLayer({'id': 'line','type': 'line','source': 'exampleT','source-layer': 'example','layout': {'line-cap': 'round','line-join': 'round'},'paint': {'line-opacity': 0.6,'line-color': 'rgb(0, 0, 0)','line-width': 2}},);
  map.addLayer({'id': 'circle','type': 'circle','source': 'exampleG','paint':{'circle-radius':3,'circle-color': 'red','circle-opacity': 0.8}});

});
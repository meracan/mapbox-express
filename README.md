# mapboxgl-express
A simple Node-Express server to view geojson and mbtiles in mapboxgl

## Installation
The package is currently not on npm. 
For local installation:
```bash
git clone git@github.com:meracan/mapbox-express.git
npm install
```

### Usage
#### Running server
Needs to specify one environment variable `DATAFOLDER`.

Using npm and package descriptor:
Example
```bash
npm start
```
Using node directly:
```bash
DATAFOLDER='../data' node server.js
```
To view the web application: `http://localhost:8080`

#### Mapbox token
[Mapbox](mapbox.com) requires an unique TOKEN. Token can be generated using a free account on Mapbox.

#### Mapbox geoJSON and MBTiles
Data/Source (.geojson and .mbtiles) can be added to `mapbox.js`. 
The link is `data/{relativePathtfromDATAFOLDER}` for geoJSON.
The link is `tiles/{relativePathtfromDATAFOLDER}` for mbtiles.
For more information on [source](https://docs.mapbox.com/mapbox-gl-js/api/)

Example:
```javascript
map.addSource('exampleG', {'type': 'geojson','data': url+"/data/example.geojson"});
map.addSource('exampleT', {'type': 'vector','tiles': [url+"/tiles/example/{z}/{x}/{y}.pbf"]});
```

#### Mapbox Layers
Layers are the style applied to the source.
For more information on [layer](https://docs.mapbox.com/mapbox-gl-js/api/)
Example:
```javascript
map.addLayer({'id': 'circle','type': 'circle','source': 'exampleG','paint':{'circle-radius':3,'circle-color': 'red','circle-opacity': 0.8}});
map.addLayer({'id': 'line','type': 'line','source': 'exampleT','source-layer': 'example','layout': {'line-cap': 'round','line-join': 'round'},'paint': {'line-opacity': 0.6,'line-color': 'rgb(0, 0, 0)','line-width': 2}},);
map.addLayer({'id': 'fill','type': 'fill','source': 'exampleT','source-layer': 'example','paint': {'fill-color': '#088','fill-opacity': 0.8});
```





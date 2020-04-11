const fs = require('fs');
const path = require('path')
const mbtiles = require('@mapbox/mbtiles');
const express = require('express');
const { resolve } = require('path');
const { readdir } = require('fs').promises;
const router = express.Router();

const DATAFOLDER=process.env.DATAFOLDER; 

const fixTileJSONCenter = function(tileJSON) {
  /*
  If does not exist, add center location from bounds 
  */
  if (tileJSON.bounds && !tileJSON.center) {
    var fitWidth = 1024;
    var tiles = fitWidth / 256;
    tileJSON.center = [
      (tileJSON.bounds[0] + tileJSON.bounds[2]) / 2,
      (tileJSON.bounds[1] + tileJSON.bounds[3]) / 2,
      Math.round(
        -Math.log((tileJSON.bounds[2] - tileJSON.bounds[0]) / 360 / tiles) /
        Math.LN2
      )
    ];
  }
};

async function getMBTiles(dir) {
  /*
  Get all files in directory with (.mbtiles)
  */
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = resolve(dir, dirent.name);
    return dirent.isDirectory() ? getMBTiles(res) : res;
  }));
  return Array.prototype.concat(...files).filter(file => path.extname(file)==".mbtiles");
}

module.exports = async ()=>{
  /*
  Create route for every mbtile and return the data in pbf format
  */
  const tiles =await getMBTiles(DATAFOLDER);
  for(let i in tiles){
    const mbtilesFile=tiles[i];
    let id = path.basename(tiles[i],".mbtiles");
    let mbtilesFileStats = fs.statSync(mbtilesFile);
    if (!mbtilesFileStats.isFile() || mbtilesFileStats.size == 0) {
      throw Error('Not valid MBTiles file: ' + mbtilesFile);
    }
  
    let tileJSON = {};
    let source = new mbtiles(mbtilesFile, function(err) {
      if(err){console.log("Error 00:"+err)}
      source.getInfo(function(err, info) {
        if(err){console.log("Error 0: "+err)}
        tileJSON['name'] = id;
        tileJSON['format'] = 'pbf';
    
        Object.assign(tileJSON, info);
        tileJSON['tilejson'] = '2.0.0';
        delete tileJSON['filesize'];
        delete tileJSON['mtime'];
        delete tileJSON['scheme'];
    
        Object.assign(tileJSON, {});
        fixTileJSONCenter(tileJSON);
      });
    });
    
    let relativePath = path.relative( DATAFOLDER, mbtilesFile );
    
    let tilePattern = '/' + path.join(path.dirname(relativePath),id) + '/:z(\\d+)/:x(\\d+)/:y(\\d+).:format([\\w.]+)';
    // console.log(tilePattern) 
    // let route = express().disable('x-powered-by');
    router.get(tilePattern, function(req, res, next) {
      
      let z = req.params.z | 0,
          x = req.params.x | 0,
          y = req.params.y | 0;
    
    
      if (z < tileJSON.minzoom || 0 || x < 0 || y < 0 ||
          z > tileJSON.maxzoom ||
          x >= Math.pow(2, z) || y >= Math.pow(2, z)) {
        
        return res.status(204).send('Out of bounds');
      }
      source.getTile(z, x, y, function(err, data, headers) {
        // console.log(x+ " " + y + " " + z)
        if (err) {
          if (/does not exist/.test(err.message)) {
             return res.status(204).send(err.message);
          } else {
            return res.status(500).send(err.message);
          }
        } else {
            if (data == null) {
               return res.status(204).send('Not found');
            } else {
                headers['Content-Type'] = 'application/x-protobuf';  
                delete headers['ETag']; 
                headers['Content-Encoding'] = 'gzip';
                res.set(headers);
               return res.status(200).send(data);
               }
        }
      });
    });
  }
  return router;
};
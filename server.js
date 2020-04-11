const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mbtiles = require("./mbtiles");

const DATAFOLDER=process.env.DATAFOLDER

const PORT = 8080;

(async ()=>{
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/',express.static(path.join('public')));  
  app.use('/data',express.static(DATAFOLDER));  
  app.use('/tiles/', await mbtiles());
  
  
  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));    
})()


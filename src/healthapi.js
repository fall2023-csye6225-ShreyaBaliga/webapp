const express = require('express');

const sequelize = require('./db-bootstrap');
const router = express.Router();
const logger = require('./logger');
const StatsD = require('node-statsd');

const stats = new StatsD();
router.use((req,res,next) => {
  console.log(req.baseUrl);
  if (req.baseUrl != '/healthz') {
    res.status().send();
  }
  next();
})


router.get('/', async (req, res) => {
    
  stats.increment('GET_REQUEST_API_HIT_FOR_HEALTHZ');
 
    if (Object.keys(req.query).length > 0) {
      res.status(400).send();
      stats.increment('bad_request');
      logger.error("Get Request - BAD REQUEST")
      return;
    }
    if(req.body && Object.keys(req.body).length>0)
    {
      res.status(400).send();
      stats.increment('bad_request');
      logger.error("GET REQUEST HAS A BODY - BAD REQUEST");
      return;
    }
  sequelize
  .authenticate()
  .then(async () => {
    console.log('Database connection has been established successfully.');
    stats.increment('db_successful');
     sequelize.sync();
     res.status(200).send();
     stats.increment('get_health');
     logger.info("GET REQUEST succesfull");
    
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    res.status(503).send();
    logger.error("Unable to connect to database upon GET request");
    stats.increment('db_unsuccessful');
  });
 
  
      
            
}
  
);
router.put("/", async ( req, res, next ) => {
  stats.increment('PUT_REQUEST_API_HIT_FOR_HEALTHZ');
  logger.info("METHOD NOT ALLOWED");
  stats.increment('method_not_allowed');
    res.status(405).send();
    
});

router.post("/", async ( req, res, next ) => {
  stats.increment('POST_REQUEST_API_HIT_FOR_HEALTHZ');
  logger.info("METHOD NOT ALLOWED");
  stats.increment('method_not_allowed');
    res.status(405).send();
});

router.patch("/", async ( req, res, next ) => {
  stats.increment('PATCH_REQUEST_API_HIT_FOR_HEALTHZ');
  logger.info("METHOD NOT ALLOWED");
  stats.increment('method_not_allowed');
   console.log("patch");
    res.status(405).send();
});

router.delete("/", async ( req, res, next ) => {
  stats.increment('DELETE_REQUEST_API_HIT_FOR_HEALTHZ');
  logger.info("METHOD NOT ALLOWED");
  stats.increment('method_not_allowed');
   
    res.status(405).send();
});

module.exports = router;


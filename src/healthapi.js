const express = require('express');

const sequelize = require('./db-bootstrap');
const router = express.Router();
const logger = require('./logger');

router.use((req,res,next) => {
  console.log(req.baseUrl);
  if (req.baseUrl != '/healthz') {
    res.status().send();
  }
  next();
})


router.get('/', async (req, res) => {
    
      
 
    if (Object.keys(req.query).length > 0) {
      res.status(400).send();
      logger.error("Get Request - BAD REQUEST")
      return;
    }
    if(req.body && Object.keys(req.body).length>0)
    {
      res.status(400).send();
      logger.error("GET REQUEST HAS A BODY - BAD REQUEST");
      return;
    }
  sequelize
  .authenticate()
  .then(async () => {
    console.log('Database connection has been established successfully.');
   
     sequelize.sync();
     res.status(200).send();
     logger.info("GET REQUEST succesfull");
    
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    res.status(503).send();
    logger.error("Unable to connect to database upon GET request");
  });
 
  
      
            
}
  
  );
router.put("/", async ( req, res, next ) => {
  logger.info("METHOD NOT ALLOWED");
    
    res.status(405).send();
    
});

router.post("/", async ( req, res, next ) => {
  logger.info("METHOD NOT ALLOWED");
    res.status(405).send();
});

router.patch("/", async ( req, res, next ) => {
  logger.info("METHOD NOT ALLOWED");
   console.log("patch");
    res.status(405).send();
});

router.delete("/", async ( req, res, next ) => {
  logger.info("METHOD NOT ALLOWED");
   
    res.status(405).send();
});

module.exports = router;


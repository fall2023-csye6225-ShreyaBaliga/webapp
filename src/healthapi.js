const express = require('express');

const sequelize = require('./db-bootstrap');
const router = express.Router();



router.get('/healthz', async (req, res) => {
    
      
  if (!req.url.startsWith('/healthz')) {
    res.status(400).send();
  }
    if (Object.keys(req.query).length > 0) {
      res.status(400).send();
      return;
    }
    if(req.body && Object.keys(req.body).length>0)
    {
      res.status(400).send();
      return;
    }
  sequelize
  .authenticate()
  .then(async () => {
    console.log('Database connection has been established successfully.');
   
     sequelize.sync();
     res.status(200).send();
    
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    res.status(503).send();
  });
 
  
      
            
}
  
  );
router.put("/healthz", async ( req, res, next ) => {
    
    res.status(405).send();
});

router.post("/healthz", async ( req, res, next ) => {
    
    res.status(405).send();
});

router.patch("/healthz", async ( req, res, next ) => {
   
    res.status(405).send();
});

router.delete("/healthz", async ( req, res, next ) => {
   
    res.status(405).send();
});

module.exports = router;


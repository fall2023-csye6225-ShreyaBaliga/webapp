const express = require('express');

const sequelize = require('./db-bootstrap');
const router = express.Router();

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
router.put("/", async ( req, res, next ) => {
    
    res.status(405).send();
});

router.post("/", async ( req, res, next ) => {
    
    res.status(405).send();
});

router.patch("/", async ( req, res, next ) => {
   console.log("patch");
    res.status(405).send();
});

router.delete("/", async ( req, res, next ) => {
   
    res.status(405).send();
});

module.exports = router;


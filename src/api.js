// api.js

const express = require('express');
const router = express.Router();


const auth = require('./auth');
const dbAccount = require('../models/Accounts');
const dbAssignment = require('../models/Assignments')
const apiService = require ('./apiServices');
const sequelize = require('./db-bootstrap');
//const  models  = require('./models');

router.use(express.json());
router.use( async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const credentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
    const [email, password] = decodedCredentials.split(':');
  
    try {
      console.log("inside try");
        const isAuthenticated = await auth.authenticateUser(email, password);
        console.log(isAuthenticated);
        if(isAuthenticated != null) {
          const account = await dbAccount(sequelize).findOne({ where: { email : email } });
          req.body.user_id = account.id;
          console.log(account);
            next();
           
        }
    } catch (error) {
      //   error.status = 401;
      //   next(error);
      res.status(401).send();
    }
  }
  catch(error)
  {
    res.status(401).send();
  }
});



router.get( "/assignments", async ( req, res, next ) => {
  if(Object.keys(req.query).length>0 || (req.body && Object.keys(length)>1))
  {
    res.status(400).send();

  }
  try {
    
      const assignments = await apiService.getAllAssignments();
      res.json(assignments);
  }
  catch(error) {
    //   error.status = 400;
    //   next(error);
    res.status(400).send();
  }
});

router.get( "/assignments/:id", async ( req, res, next ) => {
  if(req.body && Object.keys(req.body).length>1)
  {
    res.status(400).send();
    return;
  }
 
  try {
    
      const id = req.params.id;
      const user_id = req.body.user_id;
      const assignment = await apiService.getAssignment(id,user_id);
      res.json(assignment);
  }
  catch(error) {
    //   error.status = 403;
    //   next(error);
    res.status(403).send();
  }
});


router.post("/assignments", async ( req, res, next ) => {
  console.log("post");
  const assignmentObj = req.body;
  try {
          const assignment = await apiService.createAssignment(assignmentObj);
          console.log(assignment);
          res.status(201);
          res.json(assignment);
      } catch (error) {
        //   error.status = 400;
        //   next(error);
        res.status(400).send();
      } 
});

router.put("/assignments/:id", async ( req, res, next ) => {
  const id = req.params.id;
  const assignmentObj = req.body;
      try {
        if(req.body && Object.keys(req.body).length == 1) {
          console.log("put");
            res.status(400).send();
        }
          const assignment = await apiService.updateAssignment(id, assignmentObj);
          res.status(204);
          res.send();
      } catch (error) {
          error.status = error.status || 400;
        //   next(error);
        res.status(error.status).send();
      } 
});

router.patch("/assignments/:id", async ( req, res, next ) => {

  res.status(405).send();
});

router.delete("/assignments/:id", async ( req, res, next ) => {
  if(req.body && Object.keys(req.body).length>1)
  {
    res.status(400).send();
    return;
  }
  const id = req.params.id;
  const user_id = req.body.user_id;

      try {
          const status = await apiService.deleteAssignment(id, user_id);
          res.status(204);
          res.send();
      } catch (error) {
        if (error.status === 403) {
          res.status(403).send();
        } else if (error.status === 404) {
          res.status(404).send();
      }
    } 
});

module.exports = router;


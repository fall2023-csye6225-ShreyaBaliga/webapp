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
          logger.info("The user is authenticated");
          const account = await dbAccount(sequelize).findOne({ where: { email : email } });
          req.body.user_id = account.id;
          console.log(account);
            next();
           
        }
    } catch (error) {
      //   error.status = 401;
      //   next(error);
      logger.error("The user is not authenticated");
      res.status(401).send();
    }
  }
  catch(error)
  {
    logger.error("Authentication failed");
    res.status(401).send();
  }
});



router.get( "/assignments", async ( req, res, next ) => {
  if(req.body && Object.keys(req.body).length>1)
  {
    logger.error("BAD REQUEST");
    res.status(400).send();
    return;
  }
  try {
    
      const assignments = await apiService.getAllAssignments();
      logger.info("GET ASSIGNMENTS");
      res.json(assignments);
  }
  catch(error) {
    //   error.status = 400;
    //   next(error);
    logger.error("GET ASSIGNMENTS- BAD REQUEST");
    res.status(400).send();
  }
});

router.get( "/assignments/:id", async ( req, res, next ) => {
  if(req.body && Object.keys(req.body).length>1)
  {
    logger.error("GET ASSIGNMENTS WITH ID - BAD REQUEST");
    res.status(400).send();
    return;
  }
 
  try {
    
      const id = req.params.id;
      const user_id = req.body.user_id;
      const assignment = await apiService.getAssignment(id,user_id);
      logger.info("GET ASSIGNMENT - ID");
      res.json(assignment);
  }
  catch(error) {
    //   error.status = 403;
    //   next(error);
    logger.error("User is forbidden from getting the assignment (ACCESS DENIED)");
    res.status(403).send();
  }
});


router.post("/assignments", async ( req, res, next ) => {
  console.log("post");
  const assignmentObj = req.body;
  try {
          const assignment = await apiService.createAssignment(assignmentObj);
          logger.info("CREATED ASSIGNMENT");
          console.log(assignment);
          res.status(201);
          res.json(assignment);
      } catch (error) {
        //   error.status = 400;
        //   next(error);
        logger.info("COULD NOT CREATE THE ASSIGNMENT");
        res.status(400).send();
      } 
});

router.put("/assignments/:id", async ( req, res, next ) => {
  const id = req.params.id;
  const assignmentObj = req.body;
      try {
        if(req.body && Object.keys(req.body).length == 1) {
          console.log("put");
          logger.error("BAD REQUEST WITH PUT")
            res.status(400).send();
        }
          const assignment = await apiService.updateAssignment(id, assignmentObj);
          logger.info("UPDATED ASSIGNMENT");
          res.status(204);
          res.send();
      } catch (error) {
          error.status = error.status || 400;
        //   next(error);
        logger.error("COULD NOT UPDATE THE ASSIGNMENT");
        res.status(error.status).send();
      } 
});

router.patch("/assignments/:id", async ( req, res, next ) => {
   logger.error(" METHOD NOT ALLOWED");
  res.status(405).send();
});

router.delete("/assignments/:id", async ( req, res, next ) => {
  if(req.body && Object.keys(req.body).length>1)
  {
    logger.error("DELETE REQUEST HAS A BAD SYNTAX")
    res.status(400).send();
    return;
  }
  const id = req.params.id;
  const user_id = req.body.user_id;

      try {
          const status = await apiService.deleteAssignment(id, user_id);
          logger.info("Successfully deleted");
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


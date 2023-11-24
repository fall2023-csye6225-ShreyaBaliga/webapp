// api.js

const express = require('express');
const router = express.Router();


const auth = require('./auth');
const dbAccount = require('../models/Accounts');
const dbAssignment = require('../models/Assignments')
const dbSubmission= require('../models/Submission')
const apiService = require ('./apiServices');
const sequelize = require('./db-bootstrap');
const logger = require('./logger');
const StatsD = require('node-statsd');
const AWS = require("aws-sdk");
const stats = new StatsD();
//const  models  = require('./models');

// Configure AWS SDK with your credentials and region
AWS.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: "us-east-1",
});

// Create an SNS instance
const sns = new AWS.SNS();

// The ARN of the SNS topic you created with Pulumi
const snsTopicArn = process.env.SNS_TOPIC || "arn:aws:sns:us-east-1:065889916706:mySNSTopic-198c747";

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
  stats.increment('GET_REQUEST_API_HIT_FOR_ASSIGNMENT');
  if(req.body && Object.keys(req.body).length>1 || Object.keys(req.query).length > 0)
  {
    logger.error("BAD REQUEST");
    stats.increment('bad_request');
    res.status(400).send();
    return;
  }
  try {
    
      const assignments = await apiService.getAllAssignments();
      logger.info("GET ASSIGNMENTS");
      stats.increment('get_assignment');
      res.json(assignments);
  }
  catch(error) {
    //   error.status = 400;
    //   next(error);
    logger.error("GET ASSIGNMENTS- BAD REQUEST");
    stats.increment('bad_request');
    res.status(400).send();
  }
});

router.get( "/assignments/:id", async ( req, res, next ) => {
  stats.increment('GET_REQUEST_API_HIT_FOR_ASSIGNMENT_WITH_ID');
  if(req.body && Object.keys(req.body).length>1 || Object.keys(req.query).length > 0)
  {
    logger.error("GET ASSIGNMENTS WITH ID - BAD REQUEST");
    stats.increment('bad_request');
    res.status(400).send();
    return;
  }
 
  try {
    
      const id = req.params.id;
      const user_id = req.body.user_id;
      const assignment = await apiService.getAssignment(id,user_id);
      logger.info("GET ASSIGNMENT - ID");
      stats.increment('get_assignment_with_id');
      res.json(assignment);
  }
  catch(error) {
    //   error.status = 403;
    //   next(error);
    logger.error("User is forbidden from getting the assignment (ACCESS DENIED)");
    stats.increment('forbidden');
    res.status(403).send();
  }
});


router.post("/assignments", async ( req, res, next ) => {
  stats.increment('POST_REQUEST_API_HIT_FOR_ASSIGNMENT');
  console.log("post");
  const assignmentObj = req.body;
  try {
          const assignment = await apiService.createAssignment(assignmentObj);
          logger.info("CREATED ASSIGNMENT");
          console.log(assignment);
          res.status(201);
          stats.increment('assignment_created');
          res.json(assignment);
      } catch (error) {
        //   error.status = 400;
        //   next(error);
        logger.info("COULD NOT CREATE THE ASSIGNMENT");
        stats.increment('assignment_could_not_be_created');
        res.status(400).send();
      } 
});

router.post("/assignments/:id/submission",async(req,res,next)=>{
 
  
  const submission_url = req.body.submission_url;
  console.log(submission_url);
  const submissionObj=req.body;
  console.log(submissionObj);
  // Check if there are any fields other than "submission_url" in the request body
  if(req.body && Object.keys(req.body).length>2 || Object.keys(req.query).length > 0)
  {
    res.status(400).send();
    return;
  }
  
  
  try
  {
    const assignment_id=req.params.id;
    console.log(assignment_id);
    const user_id=req.body.user_id;
    // const assignmentCheck =  await dbAssignment(sequelize).findOne({ where: { id: assignment_id } });
    // console.log(assignmentCheck);
    // if(!(assignmentCheck))
    // {
    //   res.status(404).send();
    //   return;
    // }
    console.log("Inside try check");
    if(!(submission_url))
    {
       res.status(400).send();
       return;
    }
   
    // Check if the assignment exists
    const assignment = await apiService.getAssignment(assignment_id,user_id);
    // if (!assignment) {
    //   return res.status(404).send();
       
    // }

    // Check if the submission deadline has passed
    const currentDate = new Date();
    if (currentDate > assignment.deadline) {
       res.status(403).send();
       return;
    }
    
    const assignmentSubmission = await apiService.submitAssignment(submissionObj,assignment);
    console.log(assignmentSubmission);
    


    const userSubmissions = await apiService.getUserSubmissionsForAssignment(assignmentSubmission);
    const numSubmissions = userSubmissions.length;
    console.log(numSubmissions);
    console.log(assignment.num_of_attempts);
    // Check if the user has exceeded the maximum number of retries
    const retriesLeft = assignment.num_of_attempts - numSubmissions;
    console.log("Remaining retries:", retriesLeft);
    
    if (retriesLeft < 0) {
       res.status(403).send();
       return;
    }
    res.status(201);
    res.json(assignmentSubmission);
    console.log(assignmentSubmission);
  }
 
  catch(error)
  {
      res.status(400).send();
  }
  // User info to be posted to the SNS topic
const userInfo = {
  domainName: "demo.shreyabaliga.me",
  email: "baligashreyacc@gmail.com",
  name: "Shreya Baliga",
  submission_url: submission_url
};
console.log(userInfo.submission_url);
// Create a message payload
const message = {
  default: JSON.stringify(userInfo),
  
};
console.log(message);
// Publish the message to the SNS topic
sns.publish({
  Message: "PUBLISHING THE MESSAGE TO THE TOPICS AND THE RELEASE DOWNLOAD IS SUCCESSFUL"+ JSON.stringify(message),
  MessageAttributes: {
    'domainName': {
      DataType: 'String',
      StringValue: userInfo.domainName
    },
    'email': {
      DataType: 'String',
      StringValue: userInfo.email
    },
    'name': {
      DataType: 'String',
      StringValue: userInfo.name
    },
    'submission_url': {
      DataType: 'String',
      StringValue: userInfo.submission_url
    }
  },
  TopicArn: snsTopicArn,
}, (err, data) => {
  if (err) {
      console.error("Error publishing message to SNS:", err);
      logger.error("Error publishing message to SNS:", err );
  } else {
      console.log("Message published to SNS:", data.MessageId);
      logger.info("Message published to SNS:", data.MessageId);
  }
});

})

router.put("/assignments/:id", async ( req, res, next ) => {
  stats.increment('PUT_REQUEST_API_HIT_FOR_ASSIGNMENT');
  const id = req.params.id;
  const assignmentObj = req.body;
      try {
        if(req.body && Object.keys(req.body).length == 1) {
          console.log("put");
          logger.error("BAD REQUEST WITH PUT");
          stats.increment('bad_request');
            res.status(400).send();
        }
          const assignment = await apiService.updateAssignment(id, assignmentObj);
          logger.info("UPDATED ASSIGNMENT");
          res.status(204);
          stats.increment('assignment_updated');
          res.send();
      } catch (error) {
          error.status = error.status || 400;
        //   next(error);
        logger.error("COULD NOT UPDATE THE ASSIGNMENT");
        stats.increment('could_not_update_assignment');
        res.status(error.status).send();
      } 
});

router.patch("/assignments/:id", async ( req, res, next ) => {
  stats.increment('PATCH_REQUEST_API_HIT_FOR_ASSIGNMENT');
   logger.error(" METHOD NOT ALLOWED");
   stats.increment('method_not_allowed');
  res.status(405).send();
});

router.delete("/assignments/:id", async ( req, res, next ) => {
  stats.increment('DELETE_REQUEST_API_HIT_FOR_ASSIGNMENT');
  if(req.body && Object.keys(req.body).length>1)
  {
    logger.error("DELETE REQUEST HAS A BAD SYNTAX")
    stats.increment('bad_request');
    res.status(400).send();
    return;
  }
  const id = req.params.id;
  const user_id = req.body.user_id;

      try {
          const status = await apiService.deleteAssignment(id, user_id);
          logger.info("Successfully deleted");
          res.status(204);
          stats.increment('delete_failed');
          res.send();
      } catch (error) {
        if (error.status === 403) {
          res.status(403).send();
          stats.increment('forbidden');
        } else if (error.status === 404) {
          res.status(404).send();
          stats.increment('assignment_not_found');
      }
    } 
});



module.exports = router;

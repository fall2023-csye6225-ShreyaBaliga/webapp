// app.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
//const models = require('./models');
// const sequelize = require('./db-bootstrap');
const router = express.Router()

// Import routes, authentication middleware, and other necessary modules

// Bootstrapping the database
require('./src/db-bootstrap');

// Load users from CSV
require('./src/load-users.js');

// Middleware for JSON parsing and authentication
app.use(bodyParser.json());

app.use('/healthz',require('./src/healthapi'));

// API routes

// app.get('/',(req,res)=>{
//   res.redirect(302,'/v1/assignments');
// })
// app.get('/:id',(req,res)=>{
//   res.redirect(302,`/v1/assignments/${req.params.id}`);
// })
// app.post('/',(req,res)=>{
//   res.redirect(307,'/v1/assignments');
// })
// app.patch('/:id',(req,res)=>{
//   res.redirect(307,`/v1/assignments/${req.params.id}`);
// })
// app.put('/:id',(req,res)=>{
//   res.redirect(307,`/v1/assignments/${req.params.id}`);
// })
// app.delete('/:id',(req,res)=>{
//   res.redirect(307,`/v1/assignments/${req.params.id}`);
    
// })

app.use('/v2', require('./src/api'));




  // Start your server or perform other actions
 const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });

  module.exports = server;
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

// API routes
app.use('/v1', require('./src/api'));

app.use('/',require('./src/healthapi'));



  // Start your server or perform other actions
 const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });

  module.exports = server;
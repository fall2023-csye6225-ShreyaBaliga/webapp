require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./src/database'); // Import the database pool
const { checkDatabaseConnection } = require('./src/database'); // check db connection function
const { handleInvalidURLs, handleUnsupportedMethods } = require('./middleware'); // Import middleware functions
const config = require('./src/config'); // Import the database configuration
const request = require('supertest');
const app = express();
const port = 3000;
app.use(bodyParser.json());





app.get('/healthz', async (req, res) => {
 
  if (Object.keys(req.query).length > 0) {
    res.status(400).send();
    return;
  }
  const isDatabaseConnected = await checkDatabaseConnection();

  if (isDatabaseConnected) {
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).send();
  } else {
    console.error('Service Unavailable');
    res.setHeader('Cache-Control', 'no-cache');
    res.status(503).send();
  }
}

);

app.use(handleInvalidURLs);
app.use(handleUnsupportedMethods);

  


// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



module.exports = app;
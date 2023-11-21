const path = require('path');
const envFilePath = path.resolve(__dirname, './.env');
//dotenv.config({ path: envFilePath });
require('dotenv').config({ path: envFilePath });
const { Sequelize } = require('sequelize');
const { association } = require("../models/Association");
const logger = require('./logger');
const StatsD = require('node-statsd');

const stats = new StatsD();

// Initialize Sequelize with your database connection details
// Initialize Sequelize with your database connection details
const sequelize = new Sequelize(
  {
  database:process.env.DB_DATABASE || 'health_check',
  username:process.env.DB_USER || 'postgres',
  password:process.env.DB_PASSWORD || 'munnipammi',
  host: process.env.DB_HOST || 'localhost',
   
  
  dialect: 'postgres',
  logging: false,
});

const modelDefiners = [
  require("../models/Accounts"),
  require("../models/Assignments"),
  require("../models/Submission")
];

for(const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

association(sequelize);

// Run migrations only once during the application startup
async function initializeDatabase() {
  try {
    logger.info("Database Synchronized Successfully");
    // await sequelize.sync();
    console.log('Database synchronized successfully.');
  } catch (error) {
    logger.error("Database Synchronization Error");
    console.error('Database synchronization error:', error);
  }
}

// Initialize the database
initializeDatabase();

module.exports = sequelize;
const path = require('path');
const envFilePath = path.resolve(__dirname, './.env');
//dotenv.config({ path: envFilePath });
require('dotenv').config({ path: envFilePath });
const { Sequelize } = require('sequelize');
const { association } = require("../models/Association");

console.log(process.env.DATABASE_URL);
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
  require("../models/Assignments")
];

for(const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

association(sequelize);

// Run migrations only once during the application startup
async function initializeDatabase() {
  try {
    // await sequelize.sync();
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Database synchronization error:', error);
  }
}

// Initialize the database
initializeDatabase();

module.exports = sequelize;
const path = require('path');
const envFilePath = path.resolve(__dirname, './.env');
//dotenv.config({ path: envFilePath });
require('dotenv').config({ path: envFilePath });
const { Sequelize } = require('sequelize');
const { association } = require("../models/Association");

console.log(process.env.DATABASE_URL);
// Initialize Sequelize with your database connection details
const sequelize = new Sequelize({
  database:process.env.DB_DATABASE,
  username:process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  host:process.env.DB_HOST,
  port:process.env.DB_PORT,

  
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
require('dotenv').config();
const { Pool } = require('pg');
const { databaseConfig } = require('./config'); // Import the configuration
 

const pool = new Pool(databaseConfig);
// Handle pool error and reinitialize it
pool.on('error', (err) => {
    //console.error('Database pool error:', err);
    console.error("Database pool error");
    
  });

// Function to check if the database is connected
const checkDatabaseConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    await client.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database connection error:', error.message);
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports = { checkDatabaseConnection, pool };

//module.exports = pool;

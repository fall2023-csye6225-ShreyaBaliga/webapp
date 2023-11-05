
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcrypt');
const sequelize = require('./db-bootstrap');
const dbAccount = require('../models/Accounts.js');
const csvPath = './opt/users.csv';
const logger = require('./logger');
const StatsD = require('node-statsd');

const stats = new StatsD();
 
// Regular expression for validating email format
const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
// Check the database connection
 sequelize
  .authenticate()
  .then(async () => {
    console.log('Database connection has been established successfully.');
    logger.info("Successfully connected to the database");
   
   
     //sequelize.sync()
    // Continue with processing CSV file after successful connection
    processCsvFile();
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    logger.error("Unable to connect to the database");
    
  });

// Function to process the CSV file
function processCsvFile() {
  (async () => {
    try {
      // Wait for the database to be bootstrapped
      // await bootstrapDatabase();
      console.log("Inside Process CSV file");
      await sequelize.sync();
    
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', async (row) => {
          try {
            const existingUser = await dbAccount(sequelize).findOne({ where: { email: row.email } });
        
            if (!existingUser) {
              
              // User doesn't exist, create a new one

              // Check if the email format is valid
              if (!emailRegex.test(row.email)) {
                console.error('Error loading user: Invalid email format for', row.email);
                return; // Skip this row and continue with the next one
              }

              let salt = await bcrypt.genSalt(10);
              const hashedPassword = await bcrypt.hash(row.password, salt); // Hash the password
              await dbAccount(sequelize).create({
                first_name: row.first_name,
                last_name: row.last_name,
                email: row.email,
                password: hashedPassword, // Store the hashed password

                // Ignore provided values for account_created and account_updated
              },

              {
                fields: ['first_name', 'last_name', 'email', 'password'], // Define the fields to be inserted
              });
              console.log('User inserted successfully:', row.email);
              logger.info("Successfully inserted the user details");
            }
          } catch (error) {
            console.error('Error loading user:', error);
            logger.error("Error loading the user details");
          }
        })
        .on('end', () => {
          console.log('User loading completed.');
          logger.info("User loading completed");
        });
    } catch (error) {
      console.error('Error:', error);
      logger.error("Error");
    }
  })();
}

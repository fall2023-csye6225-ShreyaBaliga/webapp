const bcrypt = require ('bcrypt');
const dbAccount = require('../models/Accounts');
const sequelize = require('./db-bootstrap');
const logger = require('./logger');
const StatsD = require('node-statsd');

const stats = new StatsD();
async function authenticateUser(email, password) {
  const user = await dbAccount(sequelize).findOne({ where: { email } });
 if(user)
 {
  const hashedPassword = await bcrypt.hash(password, 10);
  const passwordMatch = await bcrypt.compare(password, user.dataValues.password);
  if (!passwordMatch) {
    logger.error("Password Doesnt Match- Unauthorized");
     const err = new Error("Bad Request");
     err.status = 401;
     throw err;
  }
  else
  {
    logger.info("Authorized");
    return passwordMatch;

  }

}
else
{
   logger.error("User Not present- Unauthorized");
  const err = new Error("Bad Request");
  throw err;
   

}
}

module.exports = {
  authenticateUser
  
  
};


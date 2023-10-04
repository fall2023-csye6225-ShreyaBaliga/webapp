const bcrypt = require ('bcrypt');
const dbAccount = require('../models/Accounts');
const sequelize = require('./db-bootstrap');

async function authenticateUser(email, password) {
  const user = await dbAccount(sequelize).findOne({ where: { email } });
  console.log("acct model");
  console.log(user);
 if(user)
 {
  console.log(password + " " + user.dataValues.password);
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  console.log(user.dataValues.password);
  const passwordMatch = await bcrypt.compare(password, user.dataValues.password);
  console.log("ghjvhjv  " + passwordMatch);
  if (!passwordMatch) {
     const err = new Error("Bad Request");
     err.status = 401;
     throw err;
  }
  else
  {
    return passwordMatch;

  }

}
else
{
   
  const err = new Error("Bad Request");
  throw err;
   

}
}

module.exports = {
  authenticateUser
  
  
};


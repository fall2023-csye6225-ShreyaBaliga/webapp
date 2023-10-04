const bcrypt = require ('bcrypt');
const dbAccount = require('../models/Accounts');
const sequelize = require('./db-bootstrap');

async function authenticateUser(email, password) {
  const user = await dbAccount(sequelize).findOne({ where: { email } });
 if(user)
 {
  const hashedPassword = await bcrypt.hash(password, 10);
  const passwordMatch = await bcrypt.compare(password, user.dataValues.password);
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


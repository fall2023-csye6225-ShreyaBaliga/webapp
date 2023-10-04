const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  const Accounts = sequelize.define('Accounts', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      get() {
        return this.getDataValue('id');
      },
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
   
    account_created: {

      type: DataTypes.STRING,
  
      allowNull: false,
  
      defaultValue: new Date().toISOString(),
  
      set() {}
  
    },
  
    account_updated: {
  
      type: DataTypes.STRING,
  
      allowNull: false,
  
      defaultValue: new Date().toISOString(),
  
      set() {}
  
    },
    
    
  },
  {
    timestamps: false, // Disable createdAt and updatedAt columns
  }
  
  )
  return Accounts;

};


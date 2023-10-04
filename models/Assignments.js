const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // console.log(sequelize);
  const Assignments = sequelize.define('Assignments', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      get() {
        return this.getDataValue('id');
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
    user_id:
    {
       type:DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Accounts",
                key: "id",
              }

    },
    num_of_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100,
      },
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    assignment_created: {
      type: DataTypes.STRING,

      allowNull: false,

      defaultValue: new Date().toISOString(),
      set() {
       
      },
    },
    assignment_updated: {
      type: DataTypes.STRING,

      allowNull: false,

      defaultValue: new Date().toISOString(),
      set() {
        
      },
     },
     
    
  },
  {
    timestamps: false, // Disable createdAt and updatedAt columns
  }
  )
 
    
  return Assignments;
  
  // sequelize.sync();
  // return Assignments;
};


const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  // console.log(sequelize);
  const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    get() {
        return this.getDataValue('id');
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
  assignment_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references:{
        model:"Assignments",
        key:"id",
    },
    // set() {}
  },
  submission_url: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
    },
    allowNull: false,
  },
  submission_date: {
    type: DataTypes.STRING,

    allowNull: false,

    defaultValue: new Date().toISOString(),
    // set() {
      
    // },
  },
  assignment_updated: {
    type: DataTypes.STRING,

    allowNull: false,

    defaultValue: new Date().toISOString(),
    set() {
      
    },
   }
  }
  
   
)
return Submission;
}
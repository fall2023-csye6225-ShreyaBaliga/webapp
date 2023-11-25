const { Sequelize } = require('sequelize');


const association = (sequelize) => {
    const { Accounts, Assignments,Submission } = sequelize.models;

    Accounts.hasMany(Assignments, {
        foreignKey: "user_id",
        as: "assignment_id"
    });

    Assignments.belongsTo(Accounts, {
        foreignKey: "user_id"
    }) 
   
    Accounts.hasMany(Submission, { foreignKey: 'user_id' });
    Assignments.hasMany(Submission, { foreignKey: 'assignment_id'});
    Assignments.hasMany(Submission, { foreignKey: 'assignment_id' , onDelete: 'CASCADE' });
    Submission.belongsTo(Accounts, { foreignKey: 'user_id' });
    Submission.belongsTo(Assignments, { foreignKey: 'assignment_id' });



}

module.exports = { association };
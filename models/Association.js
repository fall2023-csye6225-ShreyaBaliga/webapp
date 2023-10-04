const { Sequelize } = require('sequelize');


const association = (sequelize) => {
    const { Accounts, Assignments } = sequelize.models;

    Accounts.hasMany(Assignments, {
        foreignKey: "user_id",
        as: "assignment_id"
    });

    Assignments.belongsTo(Accounts, {
        foreignKey: "user_id"
    }) 
}

module.exports = { association };
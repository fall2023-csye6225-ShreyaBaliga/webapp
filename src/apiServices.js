const sequelize = require('./db-bootstrap');
//const  models  = require('./models');
const dbAccount = require('../models/Accounts');
const dbAssignment = require('../models/Assignments')

const apiService = {};

apiService.getAllAssignments = async () => {
    try {
        const assignments = await dbAssignment(sequelize).findAll();
        if (assignments.length > 0) {
            return assignments;
        }
    } catch (error) {
        throw error;
    }
};

apiService.getAssignment = async (id, user_id) => {
    try {
        const assignment = await dbAssignment(sequelize).findOne({ where: { id: id } });
        console.log(!(assignment.user_id === user_id));
        console.log(assignment.user_id + " " + user_id);
        if (!(assignment.user_id === user_id)) {
            const err = new Error("Forbidden");
            err.status = 403;
            throw err;
          
        }
        if (assignment != null) {
            return assignment;
        } else {
            const err = new Error("Not found");
            throw err;
        }
    } catch (error) {
        throw error;
    }
};

apiService.createAssignment = async (assignmentObj) => {
    try {
        console.log(assignmentObj);
        const assignment = await dbAssignment(sequelize).create({
            name: assignmentObj.name,
            points: assignmentObj.points,
            num_of_attempts: assignmentObj.num_of_attempts,
            deadline: assignmentObj.deadline,
            user_id: assignmentObj.user_id,
        });
        return assignment;
    } catch (error) {
        throw error;
    }
};

apiService.updateAssignment = async (id, assignmentObj) => {
    try {
        
        const isExists = await apiService.getAssignment(id, assignmentObj.user_id);
        
        if (isExists) {
            const updatedAssignment = await dbAssignment(sequelize).update(
                {
                    name: assignmentObj.name,
                    points: assignmentObj.points,
                    num_of_attempts: assignmentObj.num_of_attempts,
                    deadline: assignmentObj.deadline,
                },
                {
                    where: { id: id },
                }
            );
            return updatedAssignment;
        }
    } catch (error) {
        throw error;
    }
};

apiService.deleteAssignment = async (id, user_id) => {
    try {
        console.log("model delete");
        const isExists = await apiService.getAssignment(id, user_id);
        console.log(isExists);
        const deletedRows = await dbAssignment(sequelize).destroy({
            where: {
                id: id,
            },
        });
        if (deletedRows == 1) {
            return true;
        } else {
            const err = new Error("Assignment not found");
            throw err;
        }
    } catch (error) {
        throw error;
    }
};

module.exports = apiService;

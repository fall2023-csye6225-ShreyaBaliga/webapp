const sequelize = require('./db-bootstrap');
//const  models  = require('./models');
const dbAccount = require('../models/Accounts');
const dbAssignment = require('../models/Assignments')

const apiService = {};

apiService.getAllAssignments = async () => {
    try {
        const assignments = await dbAssignment(sequelize).findAll();
        if (assignments.length > 0) {
            logger.info("Assignments Found");
            return assignments;
        }
    } catch (error) {
        logger.error("Assignments not found");
        throw error;
    }
};

apiService.getAssignment = async (id, user_id) => {
    try {
        const assignment = await dbAssignment(sequelize).findOne({ where: { id: id } });
        if (!(assignment.user_id === user_id)) {
            logger.error("The user is not allowed to access-Forbidden");
            const err = new Error("Forbidden");
            err.status = 403;
            throw err;
          
        }
       
        if (assignment != null) {
            logger.info("Assignment exists");
            return assignment;
        } else {
            const err = new Error("Not found");
            logger.error("Assignment Not found");
            err.status = 404;
            throw err;
        }
    } catch (error) {
        throw error;
    }
};



apiService.createAssignment = async (assignmentObj) => {
    try {
        const assignment = await dbAssignment(sequelize).create({
            name: assignmentObj.name,
            points: assignmentObj.points,
            num_of_attempts: assignmentObj.num_of_attempts,
            deadline: assignmentObj.deadline,
            user_id: assignmentObj.user_id,
        });
        logger.info("Successfully created Assignments");
        return assignment;
    } catch (error) {
        logger.error("Could not create assignment successfully");
        throw error;
    }
};

apiService.updateAssignment = async (id, assignmentObj) => {
    try {
        
        const isExists = await apiService.getAssignment(id, assignmentObj.user_id);
        
        if (isExists) {
            logger.info("Assignment Exists");
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
            logger.info("Updated Assignment is returned");
            return updatedAssignment;
           
        }
    } catch (error) {
        logger.error("Assignment update unsucessful");
        throw error;
    }
};

apiService.deleteAssignment = async (id, user_id) => {
    try {
        const isExists = await apiService.getAssignment(id, user_id);
        const deletedRows = await dbAssignment(sequelize).destroy({
            where: {
                id: id,
            },
        });
        if (deletedRows == 1) {
            logger.info("Assignment Deleted");
            return true;
        } else {
            logger.error("Assignment not found");
            const err = new Error("Assignment not found");
            err.status = 404
            throw err;
        }
    } catch (error) {
        logger.error("Assignment could not be deleted");
        throw error;
    }

};

module.exports = apiService;

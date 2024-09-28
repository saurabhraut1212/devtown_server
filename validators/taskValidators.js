import Joi from 'joi';


export const taskValidation = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().optional(),
    dueDate: Joi.date().required(),
    status: Joi.string().valid('To Do', 'In Progress', 'Completed').required(),
    assignedUser: Joi.string().required(),
    priority: Joi.string().valid('Low', 'Medium', 'High').required(),
});


export const taskUpdateValidation = Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    description: Joi.string().optional(),
    dueDate: Joi.date().optional(),
    status: Joi.string().valid('To Do', 'In Progress', 'Completed').optional(),
    assignedUser: Joi.string().optional(),
    priority: Joi.string().valid('Low', 'Medium', 'High').optional(),
}).or('title', 'description', 'dueDate', 'status', 'assignedUser', 'priority');  

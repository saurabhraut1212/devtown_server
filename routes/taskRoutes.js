import express from 'express';
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    generateReport
} from '../controllers/taskController.js';
import verifyToken from '../middleware/verifyToken.js';
import { taskValidation, taskUpdateValidation } from '../validators/taskValidators.js';
import { validate } from '../middleware/validate.js';


const router = express.Router();

router.post('/tasks', verifyToken, validate(taskValidation), createTask);
router.get('/tasks', verifyToken, getTasks);
router.put('/tasks/:id', verifyToken, validate(taskUpdateValidation), updateTask);
router.delete('/tasks/:id', verifyToken, deleteTask);
router.get('/tasks/report', verifyToken, generateReport);

export default router;

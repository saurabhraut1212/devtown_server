import Task from "../models/taskModel.js";
import { Parser } from 'json2csv';

export const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, status, assignedUser, priority } = req.body;

        const newTask = new Task({
            title,
            description,
            dueDate,
            status,
            assignedUser,
            priority,
            createdBy: req.user._id
        });

        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const {
            title,
            description,
            dueDate,
            status,
            assignedUser,
            priority
        } = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(400).json({ message: 'Task not found' });
        }


        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(400).json({ message: 'Not authorized to update this task' });
        }


        const updates = {};
        if (title) updates.title = title;
        if (description) updates.description = description;
        if (dueDate) updates.dueDate = dueDate;
        if (status) updates.status = status;
        if (assignedUser) updates.assignedUser = assignedUser;
        if (priority) updates.priority = priority;

        const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });
        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(400).json({ message: 'Task not found' });
        }


        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(400).json({ message: 'Not authorized to delete this task' });
        }

        await Task.findByIdAndDelete(taskId);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTasks = async (req, res) => {
    try {
        const { status, priority, assignedUser, userId, page = 1, limit = 10 } = req.query;

        const query = {};

        if (userId) {
            query.createdBy = userId;
        } else {
            query.createdBy = { $exists: true };
        }

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (assignedUser) query.assignedUser = assignedUser;


        const tasks = await Task.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('assignedUser', 'name email')
            .populate('createdBy', 'name email');


        const totalTasks = await Task.countDocuments(query);

        res.status(200).json({
            totalTasks,
            totalPages: Math.ceil(totalTasks / limit),
            currentPage: page,
            tasks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const generateReport = async (req, res) => {
    try {
        const { status, priority, assignedUser, format } = req.query;
        const query = {
            createdBy: req.user._id
        };
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (assignedUser) query.assignedUser = assignedUser;


        const tasks = await Task.find(query)
            .populate('assignedUser', 'name email')
            .populate('createdBy', 'name email');


        if (format === 'csv') {
            const fields = ['title', 'description', 'dueDate', 'status', 'priority', 'assignedUser', 'createdBy'];
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(tasks);


            res.header('Content-Type', 'text/csv');
            res.attachment('tasks_report.csv');
            return res.send(csv);
        }


        res.status(200).json({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




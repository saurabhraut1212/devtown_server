import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['To Do', 'In Progress', 'Completed'], default: 'To Do' },
    assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Task = mongoose.model.tasks || mongoose.model('Task', taskSchema);
export default Task;

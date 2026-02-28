const Task = require('../models/taskModel');


const getTasks = async(req, res) => {
    try {
        let tasks;


        if (req.user.role === 'admin') {
            tasks = await Task.findAll();
        } else {
            tasks = await Task.findByUser(req.user.id);
        }

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.error('Error in getTasks:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};


const getTask = async(req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }


        if (req.user.role !== 'admin' && task.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Access denied. You can only access your own tasks.'
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Error in getTask:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

const createTask = async(req, res) => {
    try {
        const { title, description } = req.body;


        if (!title) {
            return res.status(400).json({
                success: false,
                error: 'Please provide title'
            });
        }


        const task = await Task.create({
            title,
            description,
            user_id: req.user.id
        });

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Error in createTask:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};


const updateTask = async(req, res) => {
    try {
        const { title, description, completed } = req.body;


        const existingTask = await Task.findById(req.params.id);
        if (!existingTask) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }


        if (req.user.role !== 'admin' && existingTask.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Access denied. You can only update your own tasks.'
            });
        }

        const task = await Task.update(req.params.id, {
            title: title || existingTask.title,
            description: description || existingTask.description,
            completed: completed !== undefined ? completed : existingTask.completed
        });

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Error in updateTask:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};


const deleteTask = async(req, res) => {
    try {

        const existingTask = await Task.findById(req.params.id);
        if (!existingTask) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }


        if (req.user.role !== 'admin' && existingTask.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Access denied. You can only delete your own tasks.'
            });
        }

        await Task.delete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteTask:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
};
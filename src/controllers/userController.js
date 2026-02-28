const User = require('../models/userModel');

const getUsers = async(req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Error in getUsers:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};


const getUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error in getUser:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};


const updateUserRole = async(req, res) => {
    try {
        const { role } = req.body;

        if (!role || !['user', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide valid role (user or admin)'
            });
        }

        const user = await User.updateRole(req.params.id, role);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error in updateUserRole:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

module.exports = {
    getUsers,
    getUser,
    updateUserRole
};
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const { validationResult } = require('express-validator');


const generateToken = (id) => {
    return jwt.sign({ id }, authConfig.jwtSecret, {
        expiresIn: authConfig.jwtExpire
    });
};


const register = async(req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, email, password } = req.body;


        const userExists = await User.findByEmail(email);
        if (userExists) {
            return res.status(400).json({
                success: false,
                error: 'User already exists with this email'
            });
        }


        const user = await User.create({
            name,
            email,
            password
        });


        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

const login = async(req, res) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password'
            });
        }


        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }


        const isPasswordMatch = await User.comparePassword(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }


        const token = generateToken(user.id);

        res.status(200).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};


const getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

module.exports = {
    register,
    login,
    getMe
};
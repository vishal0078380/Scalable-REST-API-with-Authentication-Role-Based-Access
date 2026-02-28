const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth');

class User {

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }


    static async findById(id) {
        const query = 'SELECT id, name, email, role, created_at FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }


    static async create(userData) {
        const { name, email, password, role = 'user' } = userData;


        const hashedPassword = await bcrypt.hash(password, authConfig.bcryptRounds);

        const query = 'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at';
        const result = await pool.query(query, [name, email, hashedPassword, role]);
        return result.rows[0];
    }


    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }


    static async findAll() {
        const query = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    }


    static async updateRole(id, role) {
        const query = 'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email, role';
        const result = await pool.query(query, [role, id]);
        return result.rows[0];
    }
}

module.exports = User;
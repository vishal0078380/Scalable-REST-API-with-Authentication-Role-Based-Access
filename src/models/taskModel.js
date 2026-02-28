const pool = require('../config/database');

class Task {
    // Get all tasks (admin only)
    static async findAll() {
        const query = `
            SELECT tasks.*, users.name as user_name, users.email as user_email 
            FROM tasks 
            LEFT JOIN users ON tasks.user_id = users.id 
            ORDER BY tasks.created_at DESC
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    // Get tasks by user
    static async findByUser(userId) {
        const query = 'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [userId]);
        return result.rows;
    }

    // Get single task by ID
    static async findById(id) {
        const query = `
            SELECT tasks.*, users.name as user_name, users.email as user_email 
            FROM tasks 
            LEFT JOIN users ON tasks.user_id = users.id 
            WHERE tasks.id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    // Create new task
    static async create(taskData) {
        const { title, description, user_id } = taskData;
        const query = 'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(query, [title, description, user_id]);
        return result.rows[0];
    }

    // Update task
    static async update(id, taskData) {
        const { title, description, completed } = taskData;
        const query = 'UPDATE tasks SET title = $1, description = $2, completed = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *';
        const result = await pool.query(query, [title, description, completed, id]);
        return result.rows[0];
    }

    // Delete task
    static async delete(id) {
        const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = Task;
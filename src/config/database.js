const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool to PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error connecting to database:', err.stack);
    }
    console.log('✅ Connected to PostgreSQL database');
    release();
});

module.exports = pool;
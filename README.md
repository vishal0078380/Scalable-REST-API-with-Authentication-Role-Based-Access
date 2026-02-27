# Scalable-REST-API-with-Authentication-Role-Based-Access

# 📋 Task Manager API - Role Based Access Control (RBAC)

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.x-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.x-orange.svg)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-purple.svg)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A production-ready REST API with complete authentication system and role-based access control. Built with Node.js, Express, PostgreSQL, and JWT tokens.

## ✨ Features

### 🟢 B1 - Core CRUD Operations
- ✅ Complete REST API for task management
- ✅ PostgreSQL database integration
- ✅ Proper error handling
- ✅ Data validation

### 🟡 B2 - Authentication System
- ✅ User registration with password hashing (bcrypt)
- ✅ User login with JWT token generation
- ✅ Protected routes middleware
- ✅ Current user profile endpoint

### 🔵 B3 - Role-Based Access Control
- ✅ Admin and User roles
- ✅ Role-based route protection
- ✅ Resource ownership (users own their tasks)
- ✅ Admin-only user management
- ✅ Hierarchical permissions

## 📸 Screenshots

<!-- Add your screenshots/GIFs here -->
<details>
<summary><b>Click to view screenshots</b></summary>

### API Documentation (Swagger UI)
![Swagger UI](https://via.placeholder.com/800x400?text=Add+Swagger+UI+Screenshot+Here)

### Postman Testing
![Postman](https://via.placeholder.com/800x400?text=Add+Postman+Testing+Screenshot+Here)

### Frontend Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Add+Frontend+Dashboard+Screenshot+Here)

### Admin Panel
![Admin Panel](https://via.placeholder.com/800x400?text=Add+Admin+Panel+Screenshot+Here)

</details>

<!-- Replace placeholders with actual GIFs - you can use tools like:
- LICEcap (Windows/macOS) to record screen to GIF
- ScreenToGif (Windows)
- GIPHY Capture (macOS)
-->

## 🏗️ Project Structure






<img width="286" height="759" alt="Screenshot 2026-02-27 at 9 46 51 PM" src="https://github.com/user-attachments/assets/3d2e6900-6a7c-4d83-b37f-7110a9f130b0" />


## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Postman (for API testing)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/task-manager-api.git
cd task-manager-api

2. INSTALL DEPENDENCIES
npm install

3. Set up PostgreSQL database

# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE USER taskmanager_user WITH PASSWORD 'your_password';
CREATE DATABASE taskmanager_db OWNER taskmanager_user;
\c taskmanager_db;

# Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO taskmanager_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO taskmanager_user;


4.Configure environment variables

# Copy example env file
cp .env.example .env

# Edit .env with your values
# Make sure to set a strong JWT_SECRET

5. start the server

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

6.links 

Access the application

API: http://localhost:3000

API Documentation: http://localhost:3000/api-docs

Frontend: http://localhost:3000





📚 API Documentation
Base URL

Authentication Endpoints
Method	Endpoint	Description	Request Body	Response
POST	/auth/register	Register new user	{ "name": "John", "email": "john@test.com", "password": "123456" }	201: User created with token
POST	/auth/login	Login user	{ "email": "john@test.com", "password": "123456" }	200: User data with token
GET	/auth/me	Get current user	-	200: User profile
Task Endpoints (All require JWT token)
Method	Endpoint	Description	Request Body	Response
GET	/tasks	Get all tasks (user sees own, admin sees all)	-	200: Array of tasks
GET	/tasks/:id	Get single task	-	200: Task object
POST	/tasks	Create task	{ "title": "Task", "description": "Description" }	201: Created task
PUT	/tasks/:id	Update task	{ "title": "Updated", "completed": true }	200: Updated task
DELETE	/tasks/:id	Delete task	-	200: Success message
User Endpoints (Admin only, require JWT token)
Method	Endpoint	Description	Request Body	Response
GET	/users	Get all users	-	200: Array of users
GET	/users/:id	Get single user	-	200: User object
PUT	/users/:id/role	Update user role	{ "role": "admin" }	200: Updated user
🔐 Environment Variables
env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_USER=taskmanager_user
DB_HOST=localhost
DB_NAME=taskmanager_db
DB_PASSWORD=your_password
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
🎯 Testing the API
Using Postman
Import the Postman collection (create new collection)

Set up environment variables:





Test endpoints in order:


1. Register a user

POST {{base_url}}/auth/register
Body: {
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

2. Login to get token

POST {{base_url}}/auth/login
Body: {
  "email": "test@example.com",
  "password": "password123"
}
✅ Copy the token from response

3. Create a task

POST {{base_url}}/tasks
Headers: Authorization: Bearer {{token}}
Body: {
  "title": "My First Task",
  "description": "Learning API testing"
}

4. Get all tasks

GET {{base_url}}/tasks
Headers: Authorization: Bearer {{token}}
</details>
Using Swagger UI
Open http://localhost:3000/api-docs

Click "Authorize" button

Enter: Bearer your_jwt_token_here

Test any endpoint directly in browser

🎨 Frontend Features
Login/Register Page: Beautiful form with tab switching

Dashboard: Protected route showing user's tasks

Task Management: Create, update, delete tasks

Admin Panel: Visible only to admin users

Responsive Design: Works on mobile and desktop

👑 Role-Based Access Demo
Regular User (@user)
✅ Can create tasks

✅ Can view only their own tasks

✅ Can edit/delete their own tasks

❌ Cannot view other users' tasks

❌ Cannot access user management

Admin User (@admin)
✅ Can do everything a regular user can

✅ Can view all users' tasks

✅ Can view all users

✅ Can promote users to admin

✅ Full system access

🛠️ Built With
Backend Framework: Express.js

Database: PostgreSQL

Authentication: JWT + bcrypt

Documentation: Swagger UI

Frontend: Vanilla JavaScript, HTML5, CSS3

Security: CORS, Helmet, Input validation

📦 Dependencies

{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1",
    "swagger-ui-express": "^4.6.3",
    "swagger-jsdoc": "^6.2.8"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
🚦 API Status Codes
Status Code	Description
200	Success (GET, PUT, DELETE)
201	Created (POST)
400	Bad Request (validation error)
401	Unauthorized (no token)
403	Forbidden (insufficient role)
404	Not Found
500	Internal Server Error
📱 Screenshots/GIFs
<!-- Add your actual screenshots/GIFs here -->
Registration Page
https://via.placeholder.com/600x300?text=Add+Registration+Page+Screenshot

Dashboard
https://via.placeholder.com/600x300?text=Add+Dashboard+Screenshot

Admin Panel
https://via.placeholder.com/600x300?text=Add+Admin+Panel+Screenshot

Swagger Documentation
https://via.placeholder.com/600x300?text=Add+Swagger+Screenshot

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Author
Your Name :T.vishal

GitHub: @y

LinkedIn: Your LinkedIn

Portfolio: Your Website

🙏 Acknowledgments
Express.js community

PostgreSQL documentation

JWT.io for token debugging

Swagger for API documentation tools

⭐ Show your support
Give a ⭐️ if this project helped you!

📊 Project Status
✅ B1 - CRUD API - Complete
✅ B2 - Authentication - Complete
✅ B3 - Role-Based Access - Complete
⬜ B4 - Advanced Features - Coming Soon

Made with ❤️ and Node.js

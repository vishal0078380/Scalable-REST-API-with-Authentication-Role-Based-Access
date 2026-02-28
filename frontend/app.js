// API Base URL
const API_BASE = 'http://localhost:3000/api';

// Store token and user info
let token = localStorage.getItem('token');
let user = JSON.parse(localStorage.getItem('user') || 'null');

// Check if we're on dashboard and redirect if not logged in
if (window.location.pathname.includes('dashboard.html') && !token) {
    window.location.href = 'index.html';
}

// Login/Register Page Logic
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    // Tab switching
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active-form');
        loginForm.classList.remove('hidden-form');
        registerForm.classList.add('hidden-form');
        registerForm.classList.remove('active-form');
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active-form');
        registerForm.classList.remove('hidden-form');
        loginForm.classList.add('hidden-form');
        loginForm.classList.remove('active-form');
    });

    // Register form submission
    document.getElementById('registerForm').addEventListener('submit', async(e) => {
        e.preventDefault();

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const messageDiv = document.getElementById('registerMessage');

        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (data.success) {
                messageDiv.className = 'message success';
                messageDiv.textContent = 'Registration successful! Please login.';
                // Switch to login tab
                loginTab.click();
                document.getElementById('registerForm').reset();
            } else {
                messageDiv.className = 'message error';
                messageDiv.textContent = data.error || 'Registration failed';
            }
        } catch (error) {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Network error. Please try again.';
        }
    });

    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', async(e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const messageDiv = document.getElementById('loginMessage');

        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                // Save token and user info
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data));

                messageDiv.className = 'message success';
                messageDiv.textContent = 'Login successful! Redirecting...';

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                messageDiv.className = 'message error';
                messageDiv.textContent = data.error || 'Login failed';
            }
        } catch (error) {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Network error. Please try again.';
        }
    });
}

// Dashboard Logic
if (window.location.pathname.includes('dashboard.html')) {
    // Display user info
    document.getElementById('userName').textContent = user ? user.name : 'User';
    document.getElementById('userRole').textContent = user ? user.role : 'user';

    // Load tasks
    loadTasks();

    // Show admin section if user is admin
    if (user && user.role === 'admin') {
        document.getElementById('adminSection').classList.remove('hidden');
        loadUsers();
    }

    // Add task form submission
    document.getElementById('taskForm').addEventListener('submit', async(e) => {
        e.preventDefault();

        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const messageDiv = document.getElementById('taskMessage');

        try {
            const response = await fetch(`${API_BASE}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description })
            });

            const data = await response.json();

            if (data.success) {
                messageDiv.className = 'message success';
                messageDiv.textContent = 'Task created successfully!';
                document.getElementById('taskForm').reset();
                loadTasks(); // Reload tasks

                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 3000);
            } else {
                messageDiv.className = 'message error';
                messageDiv.textContent = data.error || 'Failed to create task';
            }
        } catch (error) {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Network error. Please try again.';
        }
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}

// Function to load tasks
async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            displayTasks(data.data);
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Function to display tasks
function displayTasks(tasks) {
    const tasksList = document.getElementById('tasksList');

    if (!tasks || tasks.length === 0) {
        tasksList.innerHTML = '<p class="no-tasks">No tasks yet. Create your first task!</p>';
        return;
    }

    tasksList.innerHTML = tasks.map(task => `
        <div class="task-card" data-task-id="${task.id}">
            <h3>${task.title}</h3>
            <p>${task.description || 'No description'}</p>
            <div class="task-meta">
                <span class="${task.completed ? 'completed' : 'pending'}">
                    ${task.completed ? '✓ Completed' : '○ Pending'}
                </span>
                <span>Created: ${new Date(task.created_at).toLocaleDateString()}</span>
            </div>
            ${user.role === 'admin' ? `
                <div class="task-user">
                    <small>User: ${task.user_name || 'Unknown'}</small>
                </div>
            ` : ''}
            <div class="task-actions">
                <button onclick="toggleTaskStatus(${task.id}, ${!task.completed})" class="btn-edit">
                    ${task.completed ? 'Mark Pending' : 'Mark Complete'}
                </button>
                <button onclick="deleteTask(${task.id})" class="btn-delete">Delete</button>
            </div>
        </div>
    `).join('');
}

// Function to load users (admin only)
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            displayUsers(data.data);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Function to display users (admin only)
function displayUsers(users) {
    const usersList = document.getElementById('usersList');
    
    usersList.innerHTML = users.map(user => `
        <div class="user-card">
            <h3>${user.name}</h3>
            <p>Email: ${user.email}</p>
            <p>Role: <strong>${user.role}</strong></p>
            <p>Joined: ${new Date(user.created_at).toLocaleDateString()}</p>
            ${user.role !== 'admin' ? `
                <button onclick="makeAdmin(${user.id})" class="btn-edit">Make Admin</button>
            ` : ''}
        </div>
    `).join('');
}

// Function to toggle task status
async function toggleTaskStatus(taskId, completed) {
    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ completed })
        });

        const data = await response.json();

        if (data.success) {
            loadTasks(); // Reload tasks
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// Function to delete task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            loadTasks(); // Reload tasks
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Function to make user admin (admin only)
async function makeAdmin(userId) {
    try {
        const response = await fetch(`${API_BASE}/users/${userId}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ role: 'admin' })
        });

        const data = await response.json();

        if (data.success) {
            loadUsers(); // Reload users
        }
    } catch (error) {
        console.error('Error updating user role:', error);
    }
}

// Make functions global for onclick handlers
window.toggleTaskStatus = toggleTaskStatus;
window.deleteTask = deleteTask;
window.makeAdmin = makeAdmin;
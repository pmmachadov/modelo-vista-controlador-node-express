const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON - necessary for the server to understand POST requests that send data in JSON
app.use(express.json());

// Logging Middleware - Logs every request to the console
app.use((req, res, next) => {
    console.log(`Received request on ${req.url} with method ${req.method}`);
    next();
});

// --- Simulated Database ---
const db = {
    users: [
        { id: 1, name: "Alice", role: "admin" },
        { id: 2, name: "Bob", role: "user" }
    ],
    status: [
        { id: 1, status: "Active", time: new Date().toLocaleTimeString() }
    ]
};

// --- Model ---
const UserModel = {
    getUsers: function () {
        return db.users;
    }
};

const StatusModel = {
    getStatus: function () {
        return db.status[0];
    }
};

// --- Controller ---
const UsersController = {
    getUsers: (req, res) => {
        try {
            const users = UserModel.getUsers();
            if (users && users.length > 0) {
                UsersView.renderUsers(res, users);
            } else {
                throw new Error('No users found');
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

const StatusController = {
    getStatus: (req, res) => {
        try {
            const status = StatusModel.getStatus();
            StatusView.renderStatus(res, status);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

// --- View ---
const UsersView = {
    renderUsers: (res, users) => {
        res.json(users);
    }
};

const StatusView = {
    renderStatus: (res, status) => {
        res.json(status);
    }
};

// Routes
app.get('/users', UsersController.getUsers);
app.get('/status', StatusController.getStatus);

// --- Error Handling ---
// Middleware to handle not found errors
app.use((req, res, next) => {
    res.status(404).send('Sorry can\'t find that!');
});

// General error handling middleware
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Something broke!');
});

// Start the server on the defined port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

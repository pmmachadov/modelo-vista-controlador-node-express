const express = require('express');
const fs = require('fs').promises; // Using fs promises for file operations
const app = express();
const PORT = 3000;

app.use(express.json());

// Middleware for logging requests to both console and file
app.use(async (req, res, next) => {
    const logMessage = `Received request on ${req.url} with method ${req.method}\n`;
    console.log(logMessage); // Log to console
    try {
        await fs.appendFile('request-log.txt', logMessage);
    } catch (err) {
        console.error('Error writing to log file:', err);
    }
    next();
});

// Simulated in-memory database
const db = {
    users: [
        { id: 1, name: "Alice", role: "admin" },
        { id: 2, name: "Bob", role: "user" }
    ],
    status: [
        { id: 1, status: "Active", time: new Date().toLocaleTimeString() }
    ]
};

// --- MODEL ---
// Functions to manage data interactions directly from the in-memory 'database'
const UserModel = {
    getUsers: async () => db.users,
    addUser: async user => {
        db.users.push(user);
        return user;
    }
};

const StatusModel = {
    getStatus: async () => db.status[0]
};

// --- CONTROLLER ---
// Managing data flow logic between the model and the view.
const UsersController = {
    getUsers: async (req, res) => {
        try {
            const users = await UserModel.getUsers();
            UsersView.renderUsers(res, users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    addUser: async (req, res) => {
        try {
            const user = await UserModel.addUser(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

const StatusController = {
    getStatus: async (req, res) => {
        try {
            const status = await StatusModel.getStatus();
            StatusView.renderStatus(res, status);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

// --- VIEW ---
// Responsible for presenting data to the end user.
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
app.post('/users', UsersController.addUser);
app.get('/status', StatusController.getStatus);

// Error Handling Middleware
app.use((req, res, next) => {
    res.status(404).send('Sorry can\'t find that!');
});

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

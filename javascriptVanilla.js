const http = require('http');
const fs = require('fs').promises;
const PORT = 3000;

// --- MODEL ---
const db = {
    users: [
        { id: 1, name: "Alice", role: "admin" },
        { id: 2, name: "Bob", role: "user" }
    ],
    status: [
        { id: 1, status: "Active", time: new Date().toLocaleTimeString() }
    ]
};

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

// --- VIEW ---
const UsersView = {
    renderUsers: (res, users) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    }
};

const StatusView = {
    renderStatus: (res, status) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(status));
    }
};

// --- CONTROLLER ---
const UsersController = {
    getUsers: async (req, res) => {
        const users = await UserModel.getUsers();
        UsersView.renderUsers(res, users);
    },
    addUser: async (req, res) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const user = JSON.parse(body);
            const newUser = await UserModel.addUser(user);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        });
    }
};

const StatusController = {
    getStatus: async (req, res) => {
        const status = await StatusModel.getStatus();
        StatusView.renderStatus(res, status);
    }
};

// Server setup
const server = http.createServer(async (req, res) => {
    const logMessage = `Received request on ${req.url} with method ${req.method}\n`;
    console.log(logMessage);
    try {
        await fs.appendFile('request-log.txt', logMessage);
    } catch (err) {
        console.error('Error writing to log file:', err);
    }

    if (req.url === '/users' && req.method === 'GET') {
        await UsersController.getUsers(req, res);
    } else if (req.url === '/users' && req.method === 'POST') {
        await UsersController.addUser(req, res);
    } else if (req.url === '/status' && req.method === 'GET') {
        await StatusController.getStatus(req, res);
    } else {
        res.writeHead(404);
        res.end('Sorry can\'t find that!');
    }
});

server.on('error', error => {
    console.error('Server error:', error);
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

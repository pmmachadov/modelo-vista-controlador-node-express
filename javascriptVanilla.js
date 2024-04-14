const http = require('http');
const PORT = 3000;

// Simulated Database
const db = {
    users: [
        { id: 1, name: "Alice", role: "admin" },
        { id: 2, name: "Bob", role: "user" }
    ],
    status: [
        { id: 1, status: "Active", time: new Date().toLocaleTimeString() }
    ]
};

// Models
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

// Controllers
const UsersController = {
    getUsers: (res) => {
        try {
            const users = UserModel.getUsers();
            if (users && users.length > 0) {
                UsersView.renderUsers(res, users);
            } else {
                throw new Error('No users found');
            }
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message }));
        }
    }
};

const StatusController = {
    getStatus: (res) => {
        try {
            const status = StatusModel.getStatus();
            StatusView.renderStatus(res, status);
        } catch (error) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message }));
        }
    }
};

// Views
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

// Server
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        switch (req.url) {
            case '/users':
                UsersController.getUsers(res);
                break;
            case '/status':
                StatusController.getStatus(res);
                break;
            default:
                res.writeHead(404);
                res.end('Sorry can\'t find that!');
        }
    } else {
        res.writeHead(405);
        res.end(`${req.method} not allowed`);
    }
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

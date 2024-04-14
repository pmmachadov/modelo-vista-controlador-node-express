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

// --- Model --- Business Logic

// What is a Model ?
//     In the context of web application development and especially in the MVC(Model - View - Controller) design pattern, the "Model" refers to the part of the application that manages data and business rules. It is responsible for accessing the data storage layer, retrieving data, manipulating it, and storing it. The model does not have knowledge of data presentation and focuses exclusively on business logic, which includes:

// Database Interaction: The model interacts with the database through queries, updates, and deletions. It may use an ORM(Object - Relational Mapping) to map database data to objects in code.

// Business Rules: Implements the business rules of the system; for example, calculating taxes, deciding user permissions, or any other logical decision required in the context of the application.

// Data Structuring: Defines the structure of the data handled in the application, such as entities and their relationships(e.g., users, products, transactions).

// In this code, the model is represented by UserModel and StatusModel. Each of these models has methods that interact with a simulated data structure(a JavaScript object in this case), which acts as an "in-memory database":

// UserModel: Has the getUsers method, which returns all users from the simulated database.
//     StatusModel: Has the getStatus method, which returns the current system status from the simulated database.
// These models are completely separated from the presentation logic(handled by the views) and the HTTP request handling logic(handled by the controllers), following the MVC pattern.This allows for greater modularity and makes the code easier to maintain and test.

// Models can also:

// 1. Data Validation: Ensuring data meets certain standards before it's stored.
// 2. Data Aggregation: Performing complex queries to summarize or analyze data.
// 3. Transaction Handling: Managing database transactions to maintain data integrity.
// 4. Relationship Management: Defining and managing relationships between data entities.
// 5. Data Transformation: Converting data formats to meet application needs.
// 6. Business Logic Implementation: Executing core business rules of the application.
// 7. Caching Strategies: Implementing caching to enhance performance.
// 8. Audit Logging: Tracking changes to data for security and recovery.
// 9. Data Synchronization: Coordinating data across multiple platforms or systems.


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

// --- Controller --- Between Model and View


// What is a Controller ?
//     In the MVC(Model - View - Controller) design pattern, the Controller acts as an intermediary between the view, which is the user interface, and the model, which involves business logic and data handling. Its primary function is to receive user inputs, process them(with the help of models if necessary), and return the appropriate response.

// Here are the key functions of a controller:

// Receive Requests
// Process Data
// Control Flow Logic
// Return Responses

// In this case:

// UsersController: Has the getUsers method that calls the UserModel to get the users and then uses UsersView to render the users in the response to the client.It also handles errors, returning a HTTP 500 status if an error occurs.

//     StatusController: Operates similarly but for the system status, using StatusModel to get the current status and StatusView to send this information to the client.

//         Controllers, therefore, coordinate the actions of the application, manage the flow logic, and delegate specific data handling tasks to the models and data representation to the views.This helps to keep the code organized, facilitates its maintenance, and enhances the scalability of the application.

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

// --- View --- Presentation Logic to the User

// In the context of the MVC(Model - View - Controller) design pattern, the View component is responsible for presenting data to the user in a specific format.It defines how data is displayed on the screen or through other interfaces, and it is strictly concerned with the user interface aspect of an application.The view interacts with the user and generates output to display data, but it does not process data or handle business logic—that's the role of the model and the controller, respectively.

// Here are the primary responsibilities and characteristics of the view component in MVC:

// User Interface Representation
// Rendering Data

// Decoupling from Business Logic
//     Reusability: Views can be designed to be reusable across different parts of an application.For example, a single view template for displaying a list can be used with different types of data(products, users, messages), provided by different controllers.

// Updates and Responsiveness: In some implementations, particularly when views are highly dynamic, they may include mechanisms to update themselves when data changes.

// In the code you provided earlier, the view components are represented by UsersView and StatusView:

// UsersView: It has a renderUsers method that takes the user data and formats it into JSON before sending it to the client.This method is focused on how user data is presented and does not involve any data processing or business logic.

// StatusView: Similarly, it has a renderStatus method that formats and presents the system status data as JSON.

// In essence, views in an MVC application are crucial for keeping the user interface separate from data handling and processing, thus facilitating cleaner, more maintainable code and improving the user experience.

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

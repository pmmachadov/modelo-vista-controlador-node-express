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

// What is a Model ?
//     In the context of web application development and especially in the MVC(Model - View - Controller) design pattern, the "Model" refers to the part of the application that manages data and business rules.It is responsible for accessing the data storage layer, retrieving data, manipulating it, and storing it.The model does not have knowledge of data presentation and focuses exclusively on business logic, which includes:

// Database Interaction: The model interacts with the database through queries, updates, and deletions.It may use an ORM(Object - Relational Mapping) to map database data to objects in code.

// Business Rules: Implements the business rules of the system; for example, calculating taxes, deciding user permissions, or any other logical decision required in the context of the application.

// Data Structuring: Defines the structure of the data handled in the application, such as entities and their relationships(e.g., users, products, transactions).

// In the code you provided, the model is represented by UserModel and StatusModel.Each of these models has methods that interact with a simulated data structure(a JavaScript object in this case), which acts as an "in-memory database":

// UserModel: Has the getUsers method, which returns all users from the simulated database.
//     StatusModel: Has the getStatus method, which returns the current system status from the simulated database.
// These models are completely separated from the presentation logic(handled by the views) and the HTTP request handling logic(handled by the controllers), following the MVC pattern.This allows for greater modularity and makes the code easier to maintain and test.


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


// What is a Controller ?
//     In the MVC(Model - View - Controller) design pattern, the Controller acts as an intermediary between the view, which is the user interface, and the model, which involves business logic and data handling.Its primary function is to receive user inputs, process them(with the help of models if necessary), and return the appropriate response.

// Here are the key functions of a controller:

// Receive Requests: The controller receives user actions, usually via HTTP requests such as GET or POST.In web applications, each application route is typically associated with a specific method in a controller.

// Process Data: Once the controller receives a request, it may need to retrieve or modify data through models.For example, if a user requests a page that lists various products, the controller will ask the product model to retrieve product information from the database.

// Control Flow Logic: The controller decides what action to take in response to user input and which view to display.If the data entered by the user is not valid, the controller may decide to redisplay the entry form with error messages.

// Return Responses: Finally, the controller passes data to a view if necessary, which is then presented to the user.It can also redirect the user to another controller action in response to different events, like the successful submission of a form.

// In the code you provided earlier, you have concrete examples of controllers:

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

// --- View ---

// In the context of the MVC(Model - View - Controller) design pattern, the View component is responsible for presenting data to the user in a specific format.It defines how data is displayed on the screen or through other interfaces, and it is strictly concerned with the user interface aspect of an application.The view interacts with the user and generates output to display data, but it does not process data or handle business logic—that's the role of the model and the controller, respectively.

// Here are the primary responsibilities and characteristics of the view component in MVC:

// User Interface Representation: The view manages the graphical or textual representation of information and user interface elements. For example, in a web application, views might consist of HTML templates, CSS for styling, and possibly JavaScript for interactive elements.

// Rendering Data: Views are used to render data from the model into a form suitable for interaction, typically under the control of the controller.For instance, when a user accesses a webpage that lists products, the controller retrieves product data from the model and passes it to the view, which then formats and displays it to the user.

// Decoupling from Business Logic: By separating the presentation of data from the business logic(handled by the model), views ensure that the user interface is independent.This separation makes the web application easier to manage and test because changes to business logic do not affect code that manages user interaction.

//     Reusability: Views can be designed to be reusable across different parts of an application.For example, a single view template for displaying a list can be used with different types of data(products, users, messages), provided by different controllers.

// Updates and Responsiveness: In some implementations, particularly when views are highly dynamic, they may include mechanisms to update themselves when data changes.In modern web applications, frameworks like React, Angular, or Vue.js help manage these dynamic views that react to data changes without full page reloads, enhancing user experience by making interfaces more responsive and interactive.

// In the code you provided earlier, the view components are represented by UsersView and StatusView:

// UsersView: It has a renderUsers method that takes the user data and formats it into JSON before sending it to the client.This method is focused on how user data is presented and does not involve any data processing or business logic.

//     StatusView: Similarly, it has a renderStatus method that formats and presents the system status data as JSON.

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

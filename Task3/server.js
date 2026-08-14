const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const usersFilePath = path.join(__dirname, "users.json");

app.use(express.json());

function readUsers() {
    const data = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(data);
}

function writeUsers(users) {
    const data = JSON.stringify(users, null, 4);
    fs.writeFileSync(usersFilePath, data);
}

// Add a new user
app.post("/user", function (request, response) {
    const { name, age, email } = request.body;

    if (!name || age === undefined || !email) {
        return response.status(400).json({
            message: "Name, age, and email are required."
        });
    }

    const users = readUsers();
    const cleanEmail = email.trim().toLowerCase();

    const emailExists = users.some(function (user) {
        return user.email.toLowerCase() === cleanEmail;
    });

    if (emailExists) {
        return response.status(409).json({
            message: "Email already exists."
        });
    }

    let newId = 1;

    for (const user of users) {
        if (user.id >= newId) {
            newId = user.id + 1;
        }
    }

    const newUser = {
        id: newId,
        name,
        age,
        email: cleanEmail
    };

    users.push(newUser);
    writeUsers(users);

    response.status(201).json({
        message: "User added successfully."
    });
});

// Update a user by ID
app.patch("/user/:id", function (request, response) {
    const userId = Number(request.params.id);

    if (!Number.isInteger(userId) || userId < 1) {
        return response.status(400).json({
            message: "Invalid user ID."
        });
    }

    const users = readUsers();

    const userIndex = users.findIndex(function (user) {
        return user.id === userId;
    });

    if (userIndex === -1) {
        return response.status(404).json({
            message: "User ID not found."
        });
    }

    const { name, age, email } = request.body;

    if (name !== undefined) {
        users[userIndex].name = name;
    }

    if (age !== undefined) {
        users[userIndex].age = age;
    }

    if (email !== undefined) {
        const cleanEmail = email.trim().toLowerCase();

        const emailExists = users.some(function (user) {
            return user.email.toLowerCase() === cleanEmail && user.id !== userId;
        });

        if (emailExists) {
            return response.status(409).json({
                message: "Email already exists."
            });
        }

        users[userIndex].email = cleanEmail;
    }

    writeUsers(users);

    response.json({
        message: "User updated successfully."
    });
});

// Delete a user using an optional URL parameter or the request body
app.delete(["/user", "/user/:id"], function (request, response) {
    const idValue = request.params.id || request.body.id;
    const userId = Number(idValue);

    if (!Number.isInteger(userId) || userId < 1) {
        return response.status(400).json({
            message: "A valid user ID is required."
        });
    }

    const users = readUsers();

    const userIndex = users.findIndex(function (user) {
        return user.id === userId;
    });

    if (userIndex === -1) {
        return response.status(404).json({
            message: "User ID not found."
        });
    }

    users.splice(userIndex, 1);
    writeUsers(users);

    response.json({
        message: "User deleted successfully."
    });
});

// Get a user by name using a query parameter
app.get("/user/getByName", function (request, response) {
    const name = request.query.name;

    if (!name) {
        return response.status(400).json({
            message: "User name is required."
        });
    }

    const users = readUsers();
    const cleanName = name.trim().toLowerCase();

    const user = users.find(function (currentUser) {
        return currentUser.name.toLowerCase() === cleanName;
    });

    if (!user) {
        return response.status(404).json({
            message: "User name not found."
        });
    }

    response.json(user);
});

// Filter users by minimum age using a query parameter
app.get("/user/filter", function (request, response) {
    const minAge = Number(request.query.minAge);

    if (request.query.minAge === undefined || Number.isNaN(minAge)) {
        return response.status(400).json({
            message: "A valid minimum age is required."
        });
    }

    const users = readUsers();

    const filteredUsers = users.filter(function (user) {
        return user.age >= minAge;
    });

    if (filteredUsers.length === 0) {
        return response.status(404).json({
            message: "No user found."
        });
    }

    response.json(filteredUsers);
});

// Get all users
app.get("/user", function (request, response) {
    const users = readUsers();
    response.json(users);
});

// Get one user by ID
app.get("/user/:id", function (request, response) {
    const userId = Number(request.params.id);

    if (!Number.isInteger(userId) || userId < 1) {
        return response.status(400).json({
            message: "Invalid user ID."
        });
    }

    const users = readUsers();

    const user = users.find(function (currentUser) {
        return currentUser.id === userId;
    });

    if (!user) {
        return response.status(404).json({
            message: "User not found."
        });
    }

    response.json(user);
});

app.use(function (request, response) {
    response.status(404).json({
        message: "Route not found."
    });
});

app.use(function (error, request, response, next) {
    if (error instanceof SyntaxError) {
        return response.status(400).json({
            message: "Invalid JSON data."
        });
    }

    next(error);
});

app.listen(port, function () {
    console.log(`Server is running on http://localhost:${port}`);
});

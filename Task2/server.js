const http = require("http");
const fs = require("fs");
const path = require("path");

const usersFilePath = path.join(__dirname, "users.json");
const port = 3000;

function sendJson(response, statusCode, data) {
    response.statusCode = statusCode;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(data));
}

function readUsers() {
    const data = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(data);
}

function writeUsers(users) {
    const jsonData = JSON.stringify(users, null, 4);
    fs.writeFileSync(usersFilePath, jsonData);
}

function readRequestBody(request) {
    return new Promise(function (resolve, reject) {
        let body = "";

        request.on("data", function (chunk) {
            body += chunk;
        });

        request.on("end", function () {
            try {
                const data = JSON.parse(body);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });

        request.on("error", function (error) {
            reject(error);
        });
    });
}

function getUserId(url) {
    const parts = url.split("/");

    if (parts.length !== 3 || parts[1] !== "user" || parts[2] === "") {
        return null;
    }

    const userId = Number(parts[2]);

    if (!Number.isInteger(userId) || userId < 1) {
        return null;
    }

    return userId;
}

const server = http.createServer(async function (request, response) {
    // Add a new user
    if (request.method === "POST" && request.url === "/user") {
        try {
            const userData = await readRequestBody(request);

            if (!userData.name || userData.age === undefined || !userData.email) {
                sendJson(response, 400, {
                    message: "Name, age, and email are required."
                });
                return;
            }

            const users = readUsers();
            const cleanEmail = userData.email.trim().toLowerCase();

            const emailExists = users.some(function (user) {
                return user.email.toLowerCase() === cleanEmail;
            });

            if (emailExists) {
                sendJson(response, 409, {
                    message: "Email already exists."
                });
                return;
            }

            let newId = 1;

            for (const user of users) {
                if (user.id >= newId) {
                    newId = user.id + 1;
                }
            }

            const newUser = {
                id: newId,
                name: userData.name,
                age: userData.age,
                email: cleanEmail
            };

            users.push(newUser);
            writeUsers(users);

            sendJson(response, 201, {
                message: "User added successfully."
            });
        } catch (error) {
            sendJson(response, 400, {
                message: "Invalid JSON data."
            });
        }

        return;
    }

    // Get all users
    if (request.method === "GET" && request.url === "/user") {
        try {
            const users = readUsers();
            sendJson(response, 200, users);
        } catch (error) {
            sendJson(response, 500, {
                message: "Could not read users."
            });
        }

        return;
    }

    // Get one user by ID
    if (request.method === "GET" && request.url.startsWith("/user/")) {
        const userId = getUserId(request.url);

        if (userId === null) {
            sendJson(response, 400, {
                message: "Invalid user ID."
            });
            return;
        }

        try {
            const users = readUsers();

            const user = users.find(function (currentUser) {
                return currentUser.id === userId;
            });

            if (!user) {
                sendJson(response, 404, {
                    message: "User not found."
                });
                return;
            }

            sendJson(response, 200, user);
        } catch (error) {
            sendJson(response, 500, {
                message: "Could not read users."
            });
        }

        return;
    }

    // Update a user by ID
    if (request.method === "PATCH" && request.url.startsWith("/user/")) {
        const userId = getUserId(request.url);

        if (userId === null) {
            sendJson(response, 400, {
                message: "Invalid user ID."
            });
            return;
        }

        try {
            const updates = await readRequestBody(request);
            const users = readUsers();

            const userIndex = users.findIndex(function (user) {
                return user.id === userId;
            });

            if (userIndex === -1) {
                sendJson(response, 404, {
                    message: "User ID not found."
                });
                return;
            }

            if (updates.name !== undefined) {
                users[userIndex].name = updates.name;
            }

            if (updates.age !== undefined) {
                users[userIndex].age = updates.age;
            }

            if (updates.email !== undefined) {
                const cleanEmail = updates.email.trim().toLowerCase();

                const emailExists = users.some(function (user) {
                    return user.email === cleanEmail && user.id !== userId;
                });

                if (emailExists) {
                    sendJson(response, 409, {
                        message: "Email already exists."
                    });
                    return;
                }

                users[userIndex].email = cleanEmail;
            }

            writeUsers(users);

            sendJson(response, 200, {
                message: "User updated successfully."
            });
        } catch (error) {
            sendJson(response, 400, {
                message: "Invalid JSON data."
            });
        }

        return;
    }

    // Delete a user by ID
    if (request.method === "DELETE" && request.url.startsWith("/user/")) {
        const userId = getUserId(request.url);

        if (userId === null) {
            sendJson(response, 400, {
                message: "Invalid user ID."
            });
            return;
        }

        try {
            const users = readUsers();

            const userIndex = users.findIndex(function (user) {
                return user.id === userId;
            });

            if (userIndex === -1) {
                sendJson(response, 404, {
                    message: "User ID not found."
                });
                return;
            }

            users.splice(userIndex, 1);
            writeUsers(users);

            sendJson(response, 200, {
                message: "User deleted successfully."
            });
        } catch (error) {
            sendJson(response, 500, {
                message: "Could not delete the user."
            });
        }

        return;
    }

    sendJson(response, 404, {
        message: "Route not found."
    });
});

server.listen(port, function () {
    console.log(`Server is running on http://localhost:${port}`);
});

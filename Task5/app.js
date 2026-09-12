const express = require("express");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.get("/user/:id", require("./controllers/userController").getUserById);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

app.use(function (request, response) {
    response.status(404).json({
        message: "Route not found."
    });
});

app.use(function (error, request, response, next) {
    if (error.status) {
        return response.status(error.status).json({
            message: error.message
        });
    }

    if (error.name === "SequelizeValidationError") {
        return response.status(400).json({
            message: error.errors.map(function (item) {
                return item.message;
            })
        });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
        return response.status(409).json({
            message: "This value already exists."
        });
    }

    if (error.name === "SequelizeForeignKeyConstraintError") {
        return response.status(400).json({
            message: "The connected user or post does not exist."
        });
    }

    console.error(error.message);
    response.status(500).json({
        message: error.message || "Something went wrong."
    });
});

module.exports = app;

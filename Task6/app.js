const express = require("express");
const collectionRoutes = require("./routes/collectionRoutes");
const bookRoutes = require("./routes/bookRoutes");
const logRoutes = require("./routes/logRoutes");

const app = express();

app.use(express.json());

app.use("/collection", collectionRoutes);
app.use("/books", bookRoutes);
app.use("/logs", logRoutes);

app.use(function (request, response) {
    response.status(404).json({
        message: "Route not found."
    });
});

app.use(function (error, request, response, next) {
    if (error.code === 121) {
        return response.status(400).json({
            message: "Book title must be a non-empty string."
        });
    }

    console.error(error.message);
    response.status(500).json({
        message: "Something went wrong."
    });
});

module.exports = app;

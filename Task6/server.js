const app = require("./app");
const { connectDatabase } = require("./config/database");

const port = process.env.PORT || 3000;

async function startServer() {
    await connectDatabase();

    app.listen(port, function () {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

startServer().catch(function (error) {
    console.error("Could not start the server:", error.message);
});

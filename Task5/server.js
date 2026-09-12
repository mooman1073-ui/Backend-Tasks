const app = require("./app");
const { sequelize, createDatabase } = require("./config/database");
require("./models");

const port = process.env.PORT || 3000;

async function startServer() {
    await createDatabase();
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(port, function () {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

startServer().catch(function (error) {
    console.error("Could not start the server:", error.message);
});

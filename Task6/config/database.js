require("dotenv").config({ quiet: true });

const { MongoClient } = require("mongodb");

const client = new MongoClient(
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017"
);

let database;

async function connectDatabase() {
    await client.connect();
    database = client.db(process.env.DB_NAME || "assignment6");
    return database;
}

function getDatabase() {
    return database;
}

module.exports = {
    connectDatabase,
    getDatabase
};

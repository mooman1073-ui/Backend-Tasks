require("dotenv").config({ quiet: true });

const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

const databaseName = process.env.DB_NAME || "assignment5";

const sequelize = new Sequelize(
    databaseName,
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        logging: false
    }
);

async function createDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || ""
    });

    await connection.query(
        `CREATE DATABASE IF NOT EXISTS \`${databaseName}\``
    );

    await connection.end();
}

module.exports = {
    sequelize,
    createDatabase
};

require("dotenv").config({ quiet: true });

const mysql = require("mysql2/promise");

const databaseName = "retail_store";

const connectionSettings = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || ""
};

async function initializeDatabase() {
    const firstPool = mysql.createPool(connectionSettings);

    await firstPool.query(
        `CREATE DATABASE IF NOT EXISTS ${databaseName}`
    );

    await firstPool.end();

    const pool = mysql.createPool({
        ...connectionSettings,
        database: databaseName,
        waitForConnections: true,
        connectionLimit: 10
    });

    await pool.query(`
        CREATE TABLE IF NOT EXISTS Suppliers (
            SupplierID INT AUTO_INCREMENT PRIMARY KEY,
            SupplierName VARCHAR(100) NOT NULL,
            ContactNumber VARCHAR(20)
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS Products (
            ProductID INT AUTO_INCREMENT PRIMARY KEY,
            ProductName VARCHAR(100),
            Price DECIMAL(10, 2),
            StockQuantity INT,
            SupplierID INT,
            FOREIGN KEY (SupplierID)
                REFERENCES Suppliers(SupplierID)
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS Sales (
            SaleID INT AUTO_INCREMENT PRIMARY KEY,
            ProductID INT,
            QuantitySold INT,
            SaleDate DATE,
            FOREIGN KEY (ProductID)
                REFERENCES Products(ProductID)
                ON DELETE CASCADE
        )
    `);

    return pool;
}

module.exports = initializeDatabase;

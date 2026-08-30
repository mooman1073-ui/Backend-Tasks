const express = require("express");
const initializeDatabase = require("./database");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

async function startServer() {
    const pool = await initializeDatabase();

    app.post("/products", async function (request, response, next) {
        try {
            const { productName, price, stockQuantity, supplierId } = request.body;

            if (!productName || price === undefined || stockQuantity === undefined || !supplierId) {
                return response.status(400).json({ message: "All product fields are required." });
            }

            const [result] = await pool.execute(
                `INSERT INTO Products
                (ProductName, Price, StockQuantity, SupplierID)
                VALUES (?, ?, ?, ?)`,
                [productName, price, stockQuantity, supplierId]
            );

            response.status(201).json({
                message: "Product created successfully.",
                productId: result.insertId
            });
        } catch (error) {
            next(error);
        }
    });

    app.get("/products", async function (request, response, next) {
        try {
            const [products] = await pool.execute("SELECT * FROM Products");
            response.json(products);
        } catch (error) {
            next(error);
        }
    });

    app.patch("/products/bread/price", async function (request, response, next) {
        try {
            const [result] = await pool.execute(
                `UPDATE Products SET Price = ? WHERE ProductName = ?`,
                [25, "Bread"]
            );

            if (result.affectedRows === 0) {
                return response.status(404).json({ message: "Bread was not found." });
            }

            response.json({ message: "Bread price updated successfully." });
        } catch (error) {
            next(error);
        }
    });

    app.delete("/products/eggs", async function (request, response, next) {
        try {
            const [result] = await pool.execute(
                `DELETE FROM Products WHERE ProductName = ?`,
                ["Eggs"]
            );

            if (result.affectedRows === 0) {
                return response.status(404).json({ message: "Eggs was not found." });
            }

            response.json({ message: "Eggs deleted successfully." });
        } catch (error) {
            next(error);
        }
    });

    app.get("/products/:id", async function (request, response, next) {
        try {
            const { id } = request.params;
            const [products] = await pool.execute(
                "SELECT * FROM Products WHERE ProductID = ?",
                [id]
            );

            if (products.length === 0) {
                return response.status(404).json({ message: "Product not found." });
            }

            response.json(products[0]);
        } catch (error) {
            next(error);
        }
    });

    app.patch("/products/:id", async function (request, response, next) {
        try {
            const { id } = request.params;
            const { productName, price, stockQuantity, supplierId } = request.body;

            if (!productName || price === undefined || stockQuantity === undefined || !supplierId) {
                return response.status(400).json({ message: "All product fields are required." });
            }

            const [result] = await pool.execute(
                `UPDATE Products
                 SET ProductName = ?, Price = ?, StockQuantity = ?, SupplierID = ?
                 WHERE ProductID = ?`,
                [productName, price, stockQuantity, supplierId, id]
            );

            if (result.affectedRows === 0) {
                return response.status(404).json({ message: "Product not found." });
            }

            response.json({ message: "Product updated successfully." });
        } catch (error) {
            next(error);
        }
    });

    app.delete("/products/:id", async function (request, response, next) {
        try {
            const { id } = request.params;
            const [result] = await pool.execute(
                "DELETE FROM Products WHERE ProductID = ?",
                [id]
            );

            if (result.affectedRows === 0) {
                return response.status(404).json({ message: "Product not found." });
            }

            response.json({ message: "Product deleted successfully." });
        } catch (error) {
            next(error);
        }
    });

    app.post("/suppliers", async function (request, response, next) {
        try {
            const { supplierName, contactNumber } = request.body;

            if (!supplierName || !contactNumber) {
                return response.status(400).json({ message: "Supplier name and contact number are required." });
            }

            const [result] = await pool.execute(
                `INSERT INTO Suppliers (SupplierName, ContactNumber)
                 VALUES (?, ?)`,
                [supplierName, contactNumber]
            );

            response.status(201).json({
                message: "Supplier created successfully.",
                supplierId: result.insertId
            });
        } catch (error) {
            next(error);
        }
    });

    app.get("/suppliers", async function (request, response, next) {
        try {
            const [suppliers] = await pool.execute("SELECT * FROM Suppliers");
            response.json(suppliers);
        } catch (error) {
            next(error);
        }
    });

    app.patch("/suppliers/:id", async function (request, response, next) {
        try {
            const { id } = request.params;
            const { supplierName, contactNumber } = request.body;

            if (!supplierName || !contactNumber) {
                return response.status(400).json({ message: "Supplier name and contact number are required." });
            }

            const [result] = await pool.execute(
                `UPDATE Suppliers
                 SET SupplierName = ?, ContactNumber = ?
                 WHERE SupplierID = ?`,
                [supplierName, contactNumber, id]
            );

            if (result.affectedRows === 0) {
                return response.status(404).json({ message: "Supplier not found." });
            }

            response.json({ message: "Supplier updated successfully." });
        } catch (error) {
            next(error);
        }
    });

    app.delete("/suppliers/:id", async function (request, response, next) {
        try {
            const { id } = request.params;
            const [result] = await pool.execute(
                "DELETE FROM Suppliers WHERE SupplierID = ?",
                [id]
            );

            if (result.affectedRows === 0) {
                return response.status(404).json({ message: "Supplier not found." });
            }

            response.json({ message: "Supplier deleted successfully." });
        } catch (error) {
            next(error);
        }
    });

    app.post("/sales", async function (request, response, next) {
        try {
            const { productId, quantitySold, saleDate } = request.body;

            if (!productId || quantitySold === undefined || !saleDate) {
                return response.status(400).json({ message: "All sale fields are required." });
            }

            const [result] = await pool.execute(
                `INSERT INTO Sales (ProductID, QuantitySold, SaleDate)
                 VALUES (?, ?, ?)`,
                [productId, quantitySold, saleDate]
            );

            response.status(201).json({
                message: "Sale recorded successfully.",
                saleId: result.insertId
            });
        } catch (error) {
            next(error);
        }
    });

    app.get("/sales", async function (request, response, next) {
        try {
            const [sales] = await pool.execute("SELECT * FROM Sales");
            response.json(sales);
        } catch (error) {
            next(error);
        }
    });

    app.get("/sales/product/:productId", async function (request, response, next) {
        try {
            const { productId } = request.params;
            const [sales] = await pool.execute(
                "SELECT * FROM Sales WHERE ProductID = ?",
                [productId]
            );

            response.json(sales);
        } catch (error) {
            next(error);
        }
    });

    app.post("/database/products/category", async function (request, response, next) {
        try {
            const [columns] = await pool.execute(
                `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE()
                 AND TABLE_NAME = 'Products'
                 AND COLUMN_NAME = 'Category'`
            );

            if (columns.length > 0) {
                return response.status(409).json({ message: "Category column already exists." });
            }

            await pool.query(
                "ALTER TABLE Products ADD COLUMN Category VARCHAR(100)"
            );

            response.json({ message: "Category column added successfully." });
        } catch (error) {
            next(error);
        }
    });

    app.delete("/database/products/category", async function (request, response, next) {
        try {
            const [columns] = await pool.execute(
                `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE()
                 AND TABLE_NAME = 'Products'
                 AND COLUMN_NAME = 'Category'`
            );

            if (columns.length === 0) {
                return response.status(404).json({ message: "Category column does not exist." });
            }

            await pool.query("ALTER TABLE Products DROP COLUMN Category");
            response.json({ message: "Category column removed successfully." });
        } catch (error) {
            next(error);
        }
    });

    app.patch("/database/suppliers/contact-number", async function (request, response, next) {
        try {
            await pool.query(
                "ALTER TABLE Suppliers MODIFY COLUMN ContactNumber VARCHAR(15)"
            );
            response.json({ message: "ContactNumber changed to VARCHAR(15)." });
        } catch (error) {
            next(error);
        }
    });

    app.patch("/database/products/name-required", async function (request, response, next) {
        try {
            await pool.query(
                "ALTER TABLE Products MODIFY COLUMN ProductName VARCHAR(100) NOT NULL"
            );
            response.json({ message: "ProductName is now required." });
        } catch (error) {
            next(error);
        }
    });

    app.post("/setup-data", async function (request, response, next) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            let [suppliers] = await connection.execute(
                "SELECT SupplierID FROM Suppliers WHERE SupplierName = ? LIMIT 1",
                ["FreshFoods"]
            );

            let supplierId;

            if (suppliers.length === 0) {
                const [supplierResult] = await connection.execute(
                    `INSERT INTO Suppliers (SupplierName, ContactNumber)
                     VALUES (?, ?)`,
                    ["FreshFoods", "01001234567"]
                );
                supplierId = supplierResult.insertId;
            } else {
                supplierId = suppliers[0].SupplierID;
            }

            const productsToAdd = [
                ["Milk", 15, 50],
                ["Bread", 10, 30],
                ["Eggs", 20, 40]
            ];

            for (const product of productsToAdd) {
                const [existingProducts] = await connection.execute(
                    "SELECT ProductID FROM Products WHERE ProductName = ? LIMIT 1",
                    [product[0]]
                );

                if (existingProducts.length === 0) {
                    await connection.execute(
                        `INSERT INTO Products
                        (ProductName, Price, StockQuantity, SupplierID)
                        VALUES (?, ?, ?, ?)`,
                        [product[0], product[1], product[2], supplierId]
                    );
                } else {
                    await connection.execute(
                        `UPDATE Products
                         SET Price = ?, StockQuantity = ?, SupplierID = ?
                         WHERE ProductID = ?`,
                        [product[1], product[2], supplierId, existingProducts[0].ProductID]
                    );
                }
            }

            const [milkProducts] = await connection.execute(
                "SELECT ProductID FROM Products WHERE ProductName = ? LIMIT 1",
                ["Milk"]
            );

            const milkId = milkProducts[0].ProductID;

            const [existingSales] = await connection.execute(
                `SELECT SaleID FROM Sales
                 WHERE ProductID = ? AND QuantitySold = ? AND SaleDate = ?`,
                [milkId, 2, "2025-05-20"]
            );

            if (existingSales.length === 0) {
                await connection.execute(
                    `INSERT INTO Sales (ProductID, QuantitySold, SaleDate)
                     VALUES (?, ?, ?)`,
                    [milkId, 2, "2025-05-20"]
                );
            }

            await connection.commit();
            response.json({ message: "Required data inserted successfully." });
        } catch (error) {
            await connection.rollback();
            next(error);
        } finally {
            connection.release();
        }
    });

    app.get("/reports/total-sales", async function (request, response, next) {
        try {
            const [report] = await pool.execute(`
                SELECT
                    p.ProductID,
                    p.ProductName,
                    COALESCE(SUM(s.QuantitySold), 0) AS TotalQuantitySold
                FROM Products p
                LEFT JOIN Sales s ON p.ProductID = s.ProductID
                GROUP BY p.ProductID, p.ProductName
            `);

            response.json(report);
        } catch (error) {
            next(error);
        }
    });

    app.get("/reports/highest-stock", async function (request, response, next) {
        try {
            const [products] = await pool.execute(`
                SELECT * FROM Products
                ORDER BY StockQuantity DESC
                LIMIT 1
            `);

            if (products.length === 0) {
                return response.status(404).json({ message: "No products found." });
            }

            response.json(products[0]);
        } catch (error) {
            next(error);
        }
    });

    app.get("/reports/suppliers-starting-f", async function (request, response, next) {
        try {
            const [suppliers] = await pool.execute(
                "SELECT * FROM Suppliers WHERE SupplierName LIKE ?",
                ["F%"]
            );

            response.json(suppliers);
        } catch (error) {
            next(error);
        }
    });

    app.get("/reports/never-sold", async function (request, response, next) {
        try {
            const [products] = await pool.execute(`
                SELECT p.*
                FROM Products p
                LEFT JOIN Sales s ON p.ProductID = s.ProductID
                WHERE s.SaleID IS NULL
            `);

            response.json(products);
        } catch (error) {
            next(error);
        }
    });

    app.get("/reports/sales-details", async function (request, response, next) {
        try {
            const [sales] = await pool.execute(`
                SELECT
                    p.ProductName,
                    s.QuantitySold,
                    s.SaleDate
                FROM Sales s
                INNER JOIN Products p ON s.ProductID = p.ProductID
            `);

            response.json(sales);
        } catch (error) {
            next(error);
        }
    });

    app.use(function (request, response) {
        response.status(404).json({ message: "Route not found." });
    });

    app.use(function (error, request, response, next) {
        console.error(error.message);

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return response.status(400).json({ message: "The connected record does not exist." });
        }

        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return response.status(409).json({ message: "This record is still connected to other data." });
        }

        response.status(500).json({ message: "Something went wrong." });
    });

    app.listen(port, function () {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

startServer().catch(function (error) {
    console.error("Could not start the server:", error.message);
});

const { getDatabase } = require("../config/database");

async function createBooksCollection(request, response, next) {
    try {
        const database = getDatabase();
        const collections = await database
            .listCollections({ name: "books" })
            .toArray();

        if (collections.length > 0) {
            return response.status(409).json({
                message: "Books collection already exists."
            });
        }

        await database.createCollection("books", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["title"],
                    properties: {
                        title: {
                            bsonType: "string",
                            minLength: 1
                        }
                    }
                }
            }
        });

        response.status(201).json({
            message: "Books collection created successfully."
        });
    } catch (error) {
        next(error);
    }
}

async function createAuthorsCollection(request, response, next) {
    try {
        const database = getDatabase();
        const author = request.body;

        if (!author.name) {
            return response.status(400).json({
                message: "Author name is required."
            });
        }

        const result = await database
            .collection("authors")
            .insertOne(author);

        response.status(201).json({
            message: "Author inserted successfully.",
            authorId: result.insertedId
        });
    } catch (error) {
        next(error);
    }
}

async function createLogsCollection(request, response, next) {
    try {
        const database = getDatabase();
        const collections = await database
            .listCollections({ name: "logs" })
            .toArray();

        if (collections.length > 0) {
            return response.status(409).json({
                message: "Logs collection already exists."
            });
        }

        await database.createCollection("logs", {
            capped: true,
            size: 1048576
        });

        response.status(201).json({
            message: "Capped logs collection created successfully."
        });
    } catch (error) {
        next(error);
    }
}

async function createTitleIndex(request, response, next) {
    try {
        const database = getDatabase();
        const indexName = await database
            .collection("books")
            .createIndex({ title: 1 });

        response.status(201).json({
            message: "Title index created successfully.",
            indexName
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createBooksCollection,
    createAuthorsCollection,
    createLogsCollection,
    createTitleIndex
};

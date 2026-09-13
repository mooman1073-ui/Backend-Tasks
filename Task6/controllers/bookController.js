const { getDatabase } = require("../config/database");

async function createBook(request, response, next) {
    try {
        const database = getDatabase();
        const result = await database
            .collection("books")
            .insertOne(request.body);

        response.status(201).json({
            message: "Book inserted successfully.",
            bookId: result.insertedId
        });
    } catch (error) {
        next(error);
    }
}

async function createBooksBatch(request, response, next) {
    try {
        const database = getDatabase();
        const books = Array.isArray(request.body)
            ? request.body
            : request.body.books;

        if (!Array.isArray(books) || books.length < 3) {
            return response.status(400).json({
                message: "Send at least three books."
            });
        }

        const result = await database
            .collection("books")
            .insertMany(books);

        response.status(201).json({
            message: "Books inserted successfully.",
            insertedCount: result.insertedCount
        });
    } catch (error) {
        next(error);
    }
}

async function updateFuture(request, response, next) {
    try {
        const database = getDatabase();
        const result = await database.collection("books").updateOne(
            { title: "Future" },
            { $set: { year: 2022 } }
        );

        if (result.matchedCount === 0) {
            return response.status(404).json({
                message: "Future was not found."
            });
        }

        response.json({
            message: "Future year updated successfully."
        });
    } catch (error) {
        next(error);
    }
}

async function findByTitle(request, response, next) {
    try {
        const database = getDatabase();
        const { title } = request.query;
        const book = await database
            .collection("books")
            .findOne({ title });

        if (!book) {
            return response.status(404).json({
                message: "Book not found."
            });
        }

        response.json(book);
    } catch (error) {
        next(error);
    }
}

async function findByYearRange(request, response, next) {
    try {
        const database = getDatabase();
        const from = Number(request.query.from);
        const to = Number(request.query.to);

        if (!Number.isInteger(from) || !Number.isInteger(to)) {
            return response.status(400).json({
                message: "Valid from and to years are required."
            });
        }

        const books = await database.collection("books").find({
            year: { $gte: from, $lte: to }
        }).toArray();

        response.json(books);
    } catch (error) {
        next(error);
    }
}

async function findByGenre(request, response, next) {
    try {
        const database = getDatabase();
        const { genre } = request.query;
        const books = await database
            .collection("books")
            .find({ genres: genre })
            .toArray();

        response.json(books);
    } catch (error) {
        next(error);
    }
}

async function skipLimitBooks(request, response, next) {
    try {
        const database = getDatabase();
        const books = await database
            .collection("books")
            .find()
            .sort({ year: -1 })
            .skip(2)
            .limit(3)
            .toArray();

        response.json(books);
    } catch (error) {
        next(error);
    }
}

async function findIntegerYears(request, response, next) {
    try {
        const database = getDatabase();
        const books = await database
            .collection("books")
            .find({ year: { $type: "int" } })
            .toArray();

        response.json(books);
    } catch (error) {
        next(error);
    }
}

async function excludeGenres(request, response, next) {
    try {
        const database = getDatabase();
        const books = await database.collection("books").find({
            genres: { $nin: ["Horror", "Science Fiction"] }
        }).toArray();

        response.json(books);
    } catch (error) {
        next(error);
    }
}

async function deleteBeforeYear(request, response, next) {
    try {
        const database = getDatabase();
        const year = Number(request.query.year);

        if (!Number.isInteger(year)) {
            return response.status(400).json({
                message: "A valid year is required."
            });
        }

        const result = await database
            .collection("books")
            .deleteMany({ year: { $lt: year } });

        response.json({
            message: "Old books deleted successfully.",
            deletedCount: result.deletedCount
        });
    } catch (error) {
        next(error);
    }
}

async function aggregateAfterYear(request, response, next) {
    try {
        const database = getDatabase();
        const books = await database.collection("books").aggregate([
            { $match: { year: { $gt: 2000 } } },
            { $sort: { year: -1 } }
        ]).toArray();

        response.json(books);
    } catch (error) {
        next(error);
    }
}

async function aggregateSelectedFields(request, response, next) {
    try {
        const database = getDatabase();
        const books = await database.collection("books").aggregate([
            { $match: { year: { $gt: 2000 } } },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    author: 1,
                    year: 1
                }
            }
        ]).toArray();

        response.json(books);
    } catch (error) {
        next(error);
    }
}

async function unwindGenres(request, response, next) {
    try {
        const database = getDatabase();
        const books = await database.collection("books").aggregate([
            { $unwind: "$genres" }
        ]).toArray();

        response.json(books);
    } catch (error) {
        next(error);
    }
}

async function joinBooksAndLogs(request, response, next) {
    try {
        const database = getDatabase();
        const books = await database.collection("books").aggregate([
            {
                $lookup: {
                    from: "logs",
                    localField: "title",
                    foreignField: "bookTitle",
                    as: "logs"
                }
            }
        ]).toArray();

        response.json(books);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createBook,
    createBooksBatch,
    updateFuture,
    findByTitle,
    findByYearRange,
    findByGenre,
    skipLimitBooks,
    findIntegerYears,
    excludeGenres,
    deleteBeforeYear,
    aggregateAfterYear,
    aggregateSelectedFields,
    unwindGenres,
    joinBooksAndLogs
};

const { getDatabase } = require("../config/database");

async function createLog(request, response, next) {
    try {
        const database = getDatabase();
        const log = {
            ...request.body,
            createdAt: new Date()
        };

        const result = await database
            .collection("logs")
            .insertOne(log);

        response.status(201).json({
            message: "Log inserted successfully.",
            logId: result.insertedId
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createLog
};

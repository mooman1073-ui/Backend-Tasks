const express = require("express");
const collectionController = require("../controllers/collectionController");

const router = express.Router();

router.post("/books", collectionController.createBooksCollection);
router.post("/authors", collectionController.createAuthorsCollection);
router.post("/logs/capped", collectionController.createLogsCollection);
router.post("/books/index", collectionController.createTitleIndex);

module.exports = router;

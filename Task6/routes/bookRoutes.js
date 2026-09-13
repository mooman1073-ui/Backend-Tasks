const express = require("express");
const bookController = require("../controllers/bookController");

const router = express.Router();

router.post("/", bookController.createBook);
router.post("/batch", bookController.createBooksBatch);
router.patch("/Future", bookController.updateFuture);
router.get("/title", bookController.findByTitle);
router.get("/year", bookController.findByYearRange);
router.get("/genre", bookController.findByGenre);
router.get("/skip-limit", bookController.skipLimitBooks);
router.get("/year-integer", bookController.findIntegerYears);
router.get("/exclude-genres", bookController.excludeGenres);
router.delete("/before-year", bookController.deleteBeforeYear);
router.get("/aggregate1", bookController.aggregateAfterYear);
router.get("/aggregate2", bookController.aggregateSelectedFields);
router.get("/aggregate3", bookController.unwindGenres);
router.get("/aggregate4", bookController.joinBooksAndLogs);

module.exports = router;

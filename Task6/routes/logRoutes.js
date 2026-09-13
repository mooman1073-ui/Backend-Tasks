const express = require("express");
const logController = require("../controllers/logController");

const router = express.Router();

router.post("/", logController.createLog);

module.exports = router;

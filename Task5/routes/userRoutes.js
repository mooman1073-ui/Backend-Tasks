const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", userController.signup);
router.put("/upsert/:id", userController.upsertUser);
router.get("/by-email", userController.getUserByEmail);
router.get("/:id", userController.getUserById);

module.exports = router;

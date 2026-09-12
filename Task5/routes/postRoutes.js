const express = require("express");
const postController = require("../controllers/postController");

const router = express.Router();

router.post("/", postController.createPost);
router.delete("/:postId", postController.deletePost);
router.get("/details", postController.getPostDetails);
router.get("/comment-count", postController.getCommentCount);

module.exports = router;

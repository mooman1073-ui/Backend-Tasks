const { sequelize } = require("../config/database");
const { User, Post, Comment } = require("../models");

async function createPost(request, response, next) {
    try {
        const { title, content, userId } = request.body;

        const post = new Post({
            title,
            content,
            userId
        });

        await post.save();
        response.status(201).json(post);
    } catch (error) {
        next(error);
    }
}

async function deletePost(request, response, next) {
    try {
        const { postId } = request.params;
        const { userId } = request.body;
        const post = await Post.findByPk(postId);

        if (!post) {
            return response.status(404).json({
                message: "Post not found."
            });
        }

        if (post.userId !== Number(userId)) {
            return response.status(403).json({
                message: "Only the post owner can delete it."
            });
        }

        await post.destroy();
        response.json({
            message: "Post deleted successfully."
        });
    } catch (error) {
        next(error);
    }
}

async function getPostDetails(request, response, next) {
    try {
        const posts = await Post.findAll({
            attributes: ["id", "title"],
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name"]
                },
                {
                    model: Comment,
                    as: "comments",
                    attributes: ["id", "content"]
                }
            ]
        });

        response.json(posts);
    } catch (error) {
        next(error);
    }
}

async function getCommentCount(request, response, next) {
    try {
        const posts = await Post.findAll({
            attributes: [
                "id",
                "title",
                [
                    sequelize.fn("COUNT", sequelize.col("comments.id")),
                    "commentCount"
                ]
            ],
            include: [
                {
                    model: Comment,
                    as: "comments",
                    attributes: [],
                    required: false
                }
            ],
            group: ["Post.id", "Post.title"]
        });

        response.json(posts);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createPost,
    deletePost,
    getPostDetails,
    getCommentCount
};

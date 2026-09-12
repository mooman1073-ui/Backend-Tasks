const { Op } = require("sequelize");
const { User, Post, Comment } = require("../models");

async function createComments(request, response, next) {
    try {
        const commentsData = Array.isArray(request.body)
            ? request.body
            : request.body.comments;

        if (!Array.isArray(commentsData) || commentsData.length === 0) {
            return response.status(400).json({
                message: "Send an array of comments."
            });
        }

        const comments = await Comment.bulkCreate(commentsData, {
            validate: true
        });

        response.status(201).json(comments);
    } catch (error) {
        next(error);
    }
}

async function updateComment(request, response, next) {
    try {
        const { commentId } = request.params;
        const { userId, content } = request.body;
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            return response.status(404).json({
                message: "Comment not found."
            });
        }

        if (comment.userId !== Number(userId)) {
            return response.status(403).json({
                message: "Only the comment owner can update it."
            });
        }

        comment.content = content;
        await comment.save();
        response.json(comment);
    } catch (error) {
        next(error);
    }
}

async function findOrCreateComment(request, response, next) {
    try {
        const { content, postId, userId } = request.body;

        const [comment, created] = await Comment.findOrCreate({
            where: {
                content,
                postId,
                userId
            },
            defaults: {
                content,
                postId,
                userId
            }
        });

        response.status(created ? 201 : 200).json({
            created,
            comment
        });
    } catch (error) {
        next(error);
    }
}

async function searchComments(request, response, next) {
    try {
        const { word } = request.query;

        if (!word) {
            return response.status(400).json({
                message: "Search word is required."
            });
        }

        const result = await Comment.findAndCountAll({
            where: {
                content: {
                    [Op.like]: `%${word}%`
                }
            }
        });

        response.json(result);
    } catch (error) {
        next(error);
    }
}

async function getNewestComments(request, response, next) {
    try {
        const { postId } = request.params;

        const comments = await Comment.findAll({
            where: { postId },
            order: [["createdAt", "DESC"]],
            limit: 3
        });

        response.json(comments);
    } catch (error) {
        next(error);
    }
}

async function getCommentDetails(request, response, next) {
    try {
        const { id } = request.params;

        const comment = await Comment.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name"]
                },
                {
                    model: Post,
                    as: "post",
                    attributes: ["id", "title"]
                }
            ]
        });

        if (!comment) {
            return response.status(404).json({
                message: "Comment not found."
            });
        }

        response.json(comment);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createComments,
    updateComment,
    findOrCreateComment,
    searchComments,
    getNewestComments,
    getCommentDetails
};

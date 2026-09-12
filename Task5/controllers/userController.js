const { User } = require("../models");

async function signup(request, response, next) {
    try {
        const { name, email, password, role } = request.body;

        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return response.status(409).json({
                message: "Email already exists."
            });
        }

        const user = User.build({
            name,
            email,
            password,
            role
        });

        await user.save();
        response.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

async function upsertUser(request, response, next) {
    try {
        const { id } = request.params;
        const { name, email, password, role } = request.body;

        const [user, created] = await User.upsert(
            {
                id,
                name,
                email,
                password,
                role
            },
            {
                validate: false
            }
        );

        response.json({
            message: created ? "User created successfully." : "User updated successfully.",
            user
        });
    } catch (error) {
        next(error);
    }
}

async function getUserByEmail(request, response, next) {
    try {
        const { email } = request.query;

        if (!email) {
            return response.status(400).json({
                message: "Email is required."
            });
        }

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return response.status(404).json({
                message: "User not found."
            });
        }

        response.json(user);
    } catch (error) {
        next(error);
    }
}

async function getUserById(request, response, next) {
    try {
        const { id } = request.params;

        const user = await User.findByPk(id, {
            attributes: {
                exclude: ["role"]
            }
        });

        if (!user) {
            return response.status(404).json({
                message: "User not found."
            });
        }

        response.json(user);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    signup,
    upsertUser,
    getUserByEmail,
    getUserById
};

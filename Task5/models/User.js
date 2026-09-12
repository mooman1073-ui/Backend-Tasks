const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

function checkNameLength(user) {
    if (!user.name || user.name.length <= 2) {
        const error = new Error("Name must be longer than 2 characters.");
        error.status = 400;
        throw error;
    }
}

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                checkPasswordLength(value) {
                    if (value.length <= 6) {
                        throw new Error("Password must be longer than 6 characters.");
                    }
                }
            }
        },
        role: {
            type: DataTypes.ENUM("user", "admin"),
            allowNull: false,
            defaultValue: "user"
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    },
    {
        tableName: "Users",
        timestamps: true,
        hooks: {
            beforeCreate: checkNameLength
        }
    }
);

module.exports = User;

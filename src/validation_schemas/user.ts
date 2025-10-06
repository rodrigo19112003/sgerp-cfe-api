import { Schema } from "express-validator";

const getAllUsersValidationSchema: Schema = {
    offset: {
        in: ["query"],
        optional: { options: { nullable: true } },
        isInt: {
            options: { min: 1 },
            errorMessage: "Query value offset must be a positive integer",
        },
        toInt: true,
    },
    limit: {
        in: ["query"],
        optional: { options: { nullable: true } },
        isInt: {
            options: { min: 1 },
            errorMessage: "Query value limit must be a positive integer",
        },
        toInt: true,
    },
    query: {
        in: ["query"],
        trim: true,
        optional: { options: { nullable: true } },
    },
};

const deleteUserValidationSchema: Schema = {
    userId: {
        in: ["params"],
        isInt: {
            options: { min: 1 },
            errorMessage: "Parameter idProduct must be a positive integer",
        },
        toInt: true,
    },
};

export { getAllUsersValidationSchema, deleteUserValidationSchema };

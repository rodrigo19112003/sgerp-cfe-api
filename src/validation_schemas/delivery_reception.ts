import { Schema } from "express-validator";

const getAllDeliveriesReceptionsValidationSchema: Schema = {
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

export { getAllDeliveriesReceptionsValidationSchema };

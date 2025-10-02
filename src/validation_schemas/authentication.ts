import { Schema } from "express-validator";

const sendCodeToChangePasswordSchema: Schema = {
    email: {
        in: ["body"],
        trim: true,
        isString: {
            errorMessage: "Email must be a string",
        },
        notEmpty: {
            errorMessage: "Email is required",
        },
        matches: {
            options: /^[a-zA-Z0-9._%+-]+@cfe\.mx$/,
            errorMessage:
                "Email must be a valid CFE address (e.g. usuario@cfe.mx)",
        },
    },
};

export default sendCodeToChangePasswordSchema;

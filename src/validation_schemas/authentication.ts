import { Schema } from "express-validator";

const sendEmailToChangePasswordSchema: Schema = {
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
    code: {
        in: ["body"],
        trim: true,
        notEmpty: {
            errorMessage: "Code is required",
        },
        isLength: {
            options: { min: 6, max: 6 },
            errorMessage: "Code must be exactly 6 characters",
        },
        matches: {
            options: /^[A-Z0-9]{6}$/,
            errorMessage:
                "Code must contain only uppercase letters and numbers (e.g. A1B2C3)",
        },
    },
};

const changePasswordSchema: Schema = {
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
    password: {
        in: ["body"],
        trim: true,
        notEmpty: {
            errorMessage: "Password is required",
        },
        isLength: {
            options: { min: 8, max: 16 },
            errorMessage: "Password must be between 8 and 16 characters",
        },
        matches: {
            options:
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!$%&_¿?])[A-Za-z0-9!$%&_¿?]{8,16}$/,
            errorMessage:
                "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (!$%&_¿?)",
        },
    },
};

export {
    sendEmailToChangePasswordSchema,
    sendCodeToChangePasswordSchema,
    changePasswordSchema,
};

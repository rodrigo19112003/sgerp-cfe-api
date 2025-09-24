import { Schema } from "express-validator";

const loginSchema: Schema = {
    employeeNumber: {
        in: ["body"],
        trim: true,
        isString: {
            errorMessage: "Employee Number must be a string",
        },
        isAlphanumeric: {
            errorMessage:
                "Employee Number must contain only letters and numbers",
        },
        isLength: {
            options: { min: 5, max: 5 },
            errorMessage: "Employee Number must be exactly 5 characters",
        },
    },
    password: {
        in: ["body"],
        trim: true,
        notEmpty: {
            errorMessage: "Password is required",
        },
    },
};

export default loginSchema;

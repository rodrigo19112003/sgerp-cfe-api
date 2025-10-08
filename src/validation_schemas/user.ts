import { Schema } from "express-validator";
import UserRoles from "../types/enums/user_roles";

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

const createUserValidationSchema: Schema = {
    employeeNumber: {
        in: ["body"],
        isString: { errorMessage: "employeeNumber must be a string" },
        isLength: {
            options: { min: 5, max: 5 },
            errorMessage: "employeeNumber must be exactly 5 characters long",
        },
        notEmpty: { errorMessage: "employeeNumber is required" },
        trim: true,
    },
    fullName: {
        in: ["body"],
        isString: { errorMessage: "fullName must be a string" },
        isLength: {
            options: { max: 100 },
            errorMessage: "fullName must not exceed 100 characters",
        },
        notEmpty: { errorMessage: "fullName is required" },
        trim: true,
    },
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
            options: /^[a-zA-Z0-9._%+-]+@(cfe\.mx|gmail\.com)$/,
            errorMessage:
                "email must be a valid CFE address (e.g. usuario@cfe.mx)",
        },
    },
    userRoles: {
        in: ["body"],
        isArray: {
            errorMessage: "userRoles must be an array of strings",
        },
        custom: {
            options: (roles: any[]) => {
                if (!Array.isArray(roles) || roles.length === 0) {
                    throw new Error("userRoles must contain at least one role");
                }

                const validRoles = Object.values(UserRoles);
                const invalidRoles = roles.filter(
                    (role) => !validRoles.includes(role)
                );

                if (invalidRoles.length > 0) {
                    throw new Error(
                        `Invalid roles: ${invalidRoles.join(
                            ", "
                        )}. Allowed roles are: ${validRoles.join(", ")}`
                    );
                }

                const hasWorker = roles.includes(UserRoles.WORKER);
                const hasZoneManager = roles.includes(UserRoles.ZONE_MANAGER);
                const hasWitness = roles.includes(UserRoles.WITNESS);
                const hasAdmin = roles.includes(UserRoles.ADMINISTRATOR);

                if (hasWorker && roles.length > 1) {
                    throw new Error(
                        "A user with role 'Trabajador' cannot have any other roles."
                    );
                }

                if (hasZoneManager) {
                    if (hasWorker) {
                        throw new Error(
                            "A user with role 'Jefe de la zona' cannot also be 'Trabajador'."
                        );
                    }
                }

                if (!hasZoneManager && (hasWitness || hasAdmin)) {
                    throw new Error(
                        "Only 'Jefe de la zona' can have roles 'Testigo' or 'Administrador'."
                    );
                }

                return true;
            },
        },
        customSanitizer: {
            options: (roles: any[]) => roles.map((r) => String(r).trim()),
        },
    },
};

export {
    getAllUsersValidationSchema,
    deleteUserValidationSchema,
    createUserValidationSchema,
};

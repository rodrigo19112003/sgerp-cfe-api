import db from "../models";
import SQLException from "../exceptions/services/SQL_Exception";
import { IUserWithRoles } from "../types/interfaces/response_bodies";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import ErrorMessages from "../types/enums/error_messages";
import UserRoles from "../types/enums/user_roles";
import User from "../models/User";
import { InferAttributes } from "sequelize";
import { DeleteUserErrorCodes } from "../types/enums/error_codes";

async function getUserByEmployeeNumber(
    employeeNumber: string
): Promise<IUserWithRoles> {
    let userInformation: IUserWithRoles;

    try {
        const user = await db.User.findOne({
            where: { employeeNumber },
            include: [
                {
                    model: db.Role,
                    as: "roles",
                    through: { attributes: [] },
                },
            ],
        });

        if (user === null) {
            throw new BusinessLogicException(ErrorMessages.INVALID_CREDENTIALS);
        }

        const userRoles: UserRoles[] = user.roles!.map(
            (role: any) => role.name as UserRoles
        );

        userInformation = {
            ...user.toJSON(),
            roles: userRoles,
        };
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return userInformation;
}

async function getUserById(id: number): Promise<IUserWithRoles> {
    let userInformation: IUserWithRoles;

    try {
        const user = await db.User.findByPk(id, {
            include: [
                {
                    model: db.Role,
                    as: "roles",
                    through: { attributes: [] },
                },
            ],
        });

        if (user === null) {
            throw new BusinessLogicException(ErrorMessages.USER_NOT_FOUND);
        }

        const userRoles: UserRoles[] = user.roles!.map(
            (role: any) => role.name as UserRoles
        );

        userInformation = {
            ...user.toJSON(),
            roles: userRoles,
        };
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return userInformation;
}

async function getAllUsers(pagination: {
    offset: number;
    limit: number;
}): Promise<InferAttributes<User>[]> {
    let usersList: InferAttributes<User>[] = [];

    try {
        const { offset, limit } = pagination;

        const users = await db.User.findAll({
            limit,
            offset,
            order: [["id", "DESC"]],
        });

        users.forEach((user) => {
            usersList.push({
                ...user.toJSON(),
            });
        });
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return usersList;
}

async function deleteUserById(userId: number): Promise<void> {
    try {
        const user = await db.User.findByPk(userId);

        if (user === null) {
            throw new BusinessLogicException(
                ErrorMessages.USER_NOT_FOUND,
                DeleteUserErrorCodes.USER_NOT_FOUND
            );
        }

        await db.User.destroy({
            where: {
                id: userId,
            },
        });
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

async function validateEmailExists(email: string): Promise<void> {
    try {
        const user = await db.User.findOne({
            where: { email },
        });

        if (user === null) {
            throw new BusinessLogicException(
                ErrorMessages.EMAIL_DOES_NOT_EXISTS
            );
        }
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

async function createValidationCode(
    validationCodeHash: string,
    email: string
): Promise<void> {
    try {
        const user = await db.User.findOne({
            where: {
                email,
            },
        });

        if (user === null) {
            throw new BusinessLogicException(
                ErrorMessages.EMAIL_DOES_NOT_EXISTS
            );
        }

        const userId = user.id;

        const codeAlreadyExists = await db.EmailValidationCode.findOne({
            where: {
                userId,
            },
        });

        if (codeAlreadyExists !== null) {
            await db.EmailValidationCode.destroy({
                where: {
                    id: codeAlreadyExists.id,
                },
            });
        }

        await db.EmailValidationCode.create({
            code: validationCodeHash,
            userId,
        });
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

async function getValidationCodeByEmail(email: string): Promise<string> {
    let validationCodeHash: string;

    try {
        const user = await db.User.findOne({
            where: {
                email,
            },
        });

        if (user === null) {
            throw new BusinessLogicException(
                ErrorMessages.EMAIL_DOES_NOT_EXISTS
            );
        }

        const userId = user.id;

        const code = await db.EmailValidationCode.findOne({
            where: {
                userId,
            },
        });

        if (code === null) {
            throw new BusinessLogicException(
                ErrorMessages.VALIDATION_CODE_DOES_NOT_EXISTS
            );
        }

        validationCodeHash = code.code;
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return validationCodeHash;
}

async function updatePasswordByEmail(
    email: string,
    passwordHash: string
): Promise<void> {
    try {
        await validateEmailExists(email);

        await db.User.update(
            { passwordHash },
            {
                where: {
                    email,
                },
            }
        );
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

export {
    getUserByEmployeeNumber,
    getUserById,
    getAllUsers,
    deleteUserById,
    validateEmailExists,
    createValidationCode,
    getValidationCodeByEmail,
    updatePasswordByEmail,
};

import { Op } from "sequelize";
import db from "../models";
import SQLException from "../exceptions/services/SQL_Exception";
import { IUserWithRoles } from "../types/interfaces/response_bodies";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import ErrorMessages from "../types/enums/error_messages";
import UserRoles from "../types/enums/user_roles";
import User from "../models/User";
import { InferAttributes } from "sequelize";
import {
    CreateUserErrorCodes,
    DeleteUserErrorCodes,
} from "../types/enums/error_codes";
import Role from "../models/Role";

async function getUserByEmployeeNumber(
    employeeNumber: string,
    isLogin: boolean
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
            if (isLogin) {
                throw new BusinessLogicException(
                    ErrorMessages.INVALID_CREDENTIALS
                );
            } else {
                throw new BusinessLogicException(ErrorMessages.USER_NOT_FOUND);
            }
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
    query: string;
}): Promise<InferAttributes<User>[]> {
    let usersList: InferAttributes<User>[] = [];

    try {
        const { offset, limit, query } = pagination;

        const whereCondition =
            query && query.trim() !== ""
                ? {
                      [Op.or]: [
                          { employeeNumber: { [Op.like]: `%${query}%` } },
                          { fullName: { [Op.like]: `%${query}%` } },
                      ],
                  }
                : undefined;

        const users = await db.User.findAll({
            where: whereCondition,
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

async function createUser(user: {
    employeeNumber: string;
    fullName: string;
    email: string;
    passwordHash: string;
    userRoles: UserRoles[];
}): Promise<void> {
    try {
        let workerId: number,
            zoneManagerId: number,
            witnessId: number,
            administratorId: number;

        const { employeeNumber, fullName, email, passwordHash, userRoles } =
            user;

        if (userRoles.includes(UserRoles.WORKER)) {
            workerId = (await validateRoleExists(UserRoles.WORKER)).id;
        }
        if (userRoles.includes(UserRoles.ZONE_MANAGER)) {
            zoneManagerId = (await validateRoleExists(UserRoles.ZONE_MANAGER))
                .id;
        }
        if (userRoles.includes(UserRoles.ADMINISTRATOR)) {
            administratorId = (
                await validateRoleExists(UserRoles.ADMINISTRATOR)
            ).id;
        }
        if (userRoles.includes(UserRoles.WITNESS)) {
            witnessId = (await validateRoleExists(UserRoles.WITNESS)).id;

            const witnessCounter = await db.UserRole.findAndCountAll({
                where: { roleId: witnessId },
            });

            if (witnessCounter.count === 2) {
                throw new BusinessLogicException(
                    ErrorMessages.TWO_WITNESSES_ALREADY_EXIST,
                    CreateUserErrorCodes.TWO_WITNESSES_ALREADY_EXIST
                );
            }
        }

        await db.sequelize.transaction(async (t) => {
            const newUser = await db.User.create(
                { employeeNumber, fullName, email, passwordHash },
                { transaction: t }
            );

            const roleMap: { [key in UserRoles]?: number } = {
                [UserRoles.WORKER]: workerId,
                [UserRoles.ZONE_MANAGER]: zoneManagerId,
                [UserRoles.ADMINISTRATOR]: administratorId,
                [UserRoles.WITNESS]: witnessId,
            };

            for (const role of userRoles) {
                await db.UserRole.create(
                    {
                        userId: newUser.id,
                        roleId: roleMap[role]!,
                    },
                    { transaction: t }
                );
            }
        });
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

async function validateRoleExists(roleName: string): Promise<Role> {
    let role: Role;
    try {
        const roleInDatabse = await db.Role.findOne({
            where: {
                name: roleName,
            },
        });

        if (roleInDatabse === null) {
            throw new BusinessLogicException(
                ErrorMessages.ROLE_NOT_FOUND,
                CreateUserErrorCodes.ROLE_NOT_FOUND
            );
        }

        role = roleInDatabse;
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return role;
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
    createUser,
    validateEmailExists,
    createValidationCode,
    getValidationCodeByEmail,
    updatePasswordByEmail,
};

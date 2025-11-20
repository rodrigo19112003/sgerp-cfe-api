import { Op, where } from "sequelize";
import db from "../models";
import SQLException from "../exceptions/services/SQL_Exception";
import { IUserWithRoles } from "../types/interfaces/response_bodies";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import ErrorMessages from "../types/enums/error_messages";
import UserRoles from "../types/enums/user_roles";
import User from "../models/User";
import { InferAttributes } from "sequelize";
import {
    CreateOrUpdateUserErrorCodes,
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

        const userWithSameEmployeeNumber = await db.User.findOne({
            where: {
                employeeNumber,
            },
        });

        if (userWithSameEmployeeNumber !== null) {
            throw new BusinessLogicException(
                ErrorMessages.EMPLOYEENUMBER_ALREADY_EXIST,
                CreateOrUpdateUserErrorCodes.EMPLOYEE_NUMBER_ALREADY_EXIST
            );
        }

        const userWithSameEmail = await db.User.findOne({
            where: {
                email,
            },
        });

        if (userWithSameEmail !== null) {
            throw new BusinessLogicException(
                ErrorMessages.EMAIL_ALREADY_EXIST,
                CreateOrUpdateUserErrorCodes.EMAIL_ALREADY_EXIST
            );
        }

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
                    CreateOrUpdateUserErrorCodes.TWO_WITNESSES_ALREADY_EXIST
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

async function updateUser(user: {
    userId: number;
    employeeNumber: string;
    fullName: string;
    userRoles: UserRoles[];
}): Promise<string> {
    let userEmail: string;
    try {
        let workerId: number,
            zoneManagerId: number,
            witnessId: number,
            administratorId: number;

        const { userId, employeeNumber, fullName, userRoles } = user;

        const userWithSameEmployeeNumber = await db.User.findOne({
            where: {
                employeeNumber,
                id: { [Op.ne]: userId },
            },
        });

        if (userWithSameEmployeeNumber !== null) {
            throw new BusinessLogicException(
                ErrorMessages.EMPLOYEENUMBER_ALREADY_EXIST,
                CreateOrUpdateUserErrorCodes.EMPLOYEE_NUMBER_ALREADY_EXIST
            );
        }

        const userInDatabase = await db.User.findByPk(userId);

        if (userInDatabase === null) {
            throw new BusinessLogicException(
                ErrorMessages.USER_NOT_FOUND,
                CreateOrUpdateUserErrorCodes.USER_NOT_FOUND
            );
        }

        userEmail = userInDatabase.email;

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
                    CreateOrUpdateUserErrorCodes.TWO_WITNESSES_ALREADY_EXIST
                );
            }
        }

        await db.sequelize.transaction(async (t) => {
            await db.User.update(
                { employeeNumber, fullName },
                {
                    where: { id: userId },
                    transaction: t,
                }
            );

            const roleMap: { [key in UserRoles]?: number } = {
                [UserRoles.WORKER]: workerId,
                [UserRoles.ZONE_MANAGER]: zoneManagerId,
                [UserRoles.ADMINISTRATOR]: administratorId,
                [UserRoles.WITNESS]: witnessId,
            };

            await db.UserRole.destroy({
                where: { userId },
                transaction: t,
            });

            for (const role of userRoles) {
                await db.UserRole.create(
                    {
                        userId: userId,
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

    return userEmail;
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
                CreateOrUpdateUserErrorCodes.ROLE_NOT_FOUND
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

async function getZoneManagersAndReceivingWorkerEmailsByDeliveryReceptionId(
    deliveryReceptionId: number,
    userId?: number
): Promise<string[]> {
    try {
        const deliveriesReceptions = await db.DeliveryReceptionReceived.findAll(
            {
                where: { deliveryReceptionId },
                include: [
                    {
                        model: db.User,
                        as: "user",
                        where: userId ? { id: { [Op.ne]: userId } } : {},
                    },
                ],
            }
        );

        return deliveriesReceptions.map((dr) => dr.user!.email);
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

async function getZoneManagerEmployeeNumberAndNameById(
    userId: number
): Promise<string> {
    try {
        const user = await db.User.findByPk(userId);
        return user!.employeeNumber + " - " + user!.fullName;
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

async function getSendingWorkerEmail(
    deliveryReceptionId: number
): Promise<string> {
    try {
        const deliveryReception = await db.DeliveryReception.findByPk(
            deliveryReceptionId,
            {
                include: [{ model: db.User, as: "user" }],
            }
        );
        return deliveryReception!.user!.email;
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

async function getSendingWorkerAndReceivingWorkerByDeliveryReceptionId(
    deliveryReceptionId: number
): Promise<string[]> {
    try {
        const deliveryReception = await db.DeliveryReception.findByPk(
            deliveryReceptionId,
            {
                include: [{ model: db.User, as: "user" }],
            }
        );

        const deliveryReceptionReceived =
            await db.DeliveryReceptionReceived.findOne({
                where: { deliveryReceptionId },
                include: [
                    {
                        model: db.User,
                        as: "user",
                        required: true,
                        include: [
                            {
                                model: db.Role,
                                as: "roles",
                                through: { attributes: [] },
                                where: { name: UserRoles.WORKER },
                                required: true,
                            },
                        ],
                    },
                ],
            });

        return [
            deliveryReception!.user!.employeeNumber +
                " - " +
                deliveryReception!.user!.fullName,
            deliveryReceptionReceived!.user!.employeeNumber +
                " - " +
                deliveryReceptionReceived!.user!.fullName,
        ];
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
    updateUser,
    createValidationCode,
    getValidationCodeByEmail,
    updatePasswordByEmail,
    getZoneManagersAndReceivingWorkerEmailsByDeliveryReceptionId,
    getZoneManagerEmployeeNumberAndNameById,
    getSendingWorkerAndReceivingWorkerByDeliveryReceptionId,
    getSendingWorkerEmail,
};

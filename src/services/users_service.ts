import db from "../models";
import SQLException from "../exceptions/services/SQL_Exception";
import { IUserWithRoles } from "../types/interfaces/response_bodies";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import ErrorMessages from "../types/enums/error_messages";
import UserRoles from "../types/enums/user_roles";

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

export { getUserByEmployeeNumber, validateEmailExists, createValidationCode };

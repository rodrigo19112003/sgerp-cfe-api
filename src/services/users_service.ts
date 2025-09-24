import db from "../models";
import SQLException from "../exceptions/services/SQL_Exception";
import { IUserWithRoles } from "../types/interfaces/response_bodies";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import ErrorMessages from "../types/enums/error_messages";
import UserRoles from "../types/enums/user_roles";

async function getUserByEmployeeNumber(employeeNumber: string) {
    let userInformation: IUserWithRoles;

    try {
        const user = await db.User.findOne({
            where: { employeeNumber },
            include: [
                {
                    model: db.UserRole,
                    as: "roles",
                    include: [
                        {
                            model: db.Role,
                            as: "role",
                        },
                    ],
                },
            ],
        });

        if (user === null) {
            throw new BusinessLogicException(ErrorMessages.INVALID_CREDENTIALS);
        }

        const userRoles: UserRoles[] = user.roles!.map(
            (ur: any) => ur.role.name as UserRoles
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

export { getUserByEmployeeNumber };

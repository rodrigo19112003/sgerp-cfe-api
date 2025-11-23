import { NextFunction, Request, Response } from "express";
import { InferAttributes } from "sequelize";
import User from "../models/User";
import {
    createUser,
    deleteUserById,
    getAllUsers,
    getUserByEmployeeNumber,
    getUserById,
    updateUser,
} from "../services/users_service";
import { HttpStatusCodes } from "../types/enums/http";
import {
    IUserByEmployeeNumberParams,
    IUserByIdParams,
} from "../types/interfaces/request_parameters";
import { ICreateOrUpdateUserBody } from "../types/interfaces/request_bodies";
import { generateSecurePassword, hashString } from "../lib/security_service";
import {
    sendDeletedUserNotificationEmail,
    sendUpdatedUserInformationEmail,
    sendUserCredentialsEmail,
} from "../lib/utils";
import { IUserWithRoles } from "../types/interfaces/response_bodies";

async function getAllUsersController(
    req: Request,
    res: Response<InferAttributes<User>[]>,
    next: NextFunction
) {
    try {
        const { limit, offset, query } = (req as any).validatedQuery;

        const users = await getAllUsers({ limit, offset, query });

        res.status(HttpStatusCodes.OK).json(users);
    } catch (error) {
        next(error);
    }
}

async function deleteUserController(
    req: Request<IUserByIdParams, {}, {}, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { userId } = req.params;

        const user = await getUserById(userId!);

        await deleteUserById(userId!);

        setImmediate(() => {
            sendDeletedUserNotificationEmail({
                employeeNumber: user.employeeNumber,
                fullName: user.fullName,
                email: user.email,
            }).catch(() => {});
        });

        res.sendStatus(HttpStatusCodes.NO_CONTENT);
    } catch (error) {
        next(error);
    }
}

async function createUserController(
    req: Request<{}, {}, ICreateOrUpdateUserBody, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { employeeNumber, fullName, email, userRoles } = req.body;
        const password = generateSecurePassword();
        const passwordHash = hashString(password);
        await createUser({
            employeeNumber: employeeNumber!,
            fullName: fullName!,
            email: email!,
            passwordHash: passwordHash,
            userRoles: userRoles!,
        });

        setImmediate(() => {
            sendUserCredentialsEmail({
                employeeNumber: employeeNumber!,
                fullName: fullName!,
                email: email!,
                password: password,
                userRoles: userRoles!,
            }).catch(() => {});
        });

        res.sendStatus(HttpStatusCodes.CREATED);
    } catch (error) {
        next(error);
    }
}

async function getUserByEmployeeNumberController(
    req: Request<IUserByEmployeeNumberParams>,
    res: Response<IUserWithRoles>,
    next: NextFunction
) {
    try {
        const { employeeNumber } = req.params;
        const user = await getUserByEmployeeNumber(employeeNumber!, false);

        delete user.passwordHash;

        res.status(HttpStatusCodes.OK).json(user);
    } catch (error) {
        next(error);
    }
}

async function updateUserController(
    req: Request<IUserByIdParams, {}, ICreateOrUpdateUserBody, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { userId } = req.params;
        const { employeeNumber, fullName, userRoles } = req.body;
        const email = await updateUser({
            userId: userId!,
            employeeNumber: employeeNumber!,
            fullName: fullName!,
            userRoles: userRoles!,
        });

        setImmediate(() => {
            sendUpdatedUserInformationEmail({
                employeeNumber: employeeNumber!,
                fullName: fullName!,
                email: email!,
                userRoles: userRoles!,
            }).catch(() => {});
        });

        res.sendStatus(HttpStatusCodes.OK);
    } catch (error) {
        next(error);
    }
}

export {
    getAllUsersController,
    deleteUserController,
    createUserController,
    getUserByEmployeeNumberController,
    updateUserController,
};

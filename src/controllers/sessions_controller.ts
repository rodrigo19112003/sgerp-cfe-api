import { HttpStatusCodes } from "../types/enums/http";
import { NextFunction, Request, Response } from "express";
import { signToken } from "../lib/token_store";
import { ILoginBody } from "../types/interfaces/request_bodies";
import { IUserWithRoles } from "../types/interfaces/response_bodies";
import { getUserByEmployeeNumber } from "../services/users_service";
import { compareHashedString } from "../lib/security_service";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import ErrorMessages from "../types/enums/error_messages";

async function loginController(
    req: Request<{}, {}, ILoginBody, {}>,
    res: Response<IUserWithRoles>,
    next: NextFunction
) {
    try {
        const { employeeNumber, password } = req.body;

        const user = await getUserByEmployeeNumber(employeeNumber!);

        const validateCredentials = await compareHashedString(
            password!,
            user.passwordHash!
        );

        if (!validateCredentials) {
            throw new BusinessLogicException(ErrorMessages.INVALID_CREDENTIALS);
        }

        let token;

        token = signToken({
            id: user.id,
            userRoles: user.roles,
        });

        delete user.passwordHash;

        res.status(HttpStatusCodes.CREATED).json({
            token,
            ...user,
        });
    } catch (error) {
        next(error);
    }
}

export { loginController };

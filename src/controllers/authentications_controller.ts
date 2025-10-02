import { HttpStatusCodes } from "../types/enums/http";
import { NextFunction, Request, Response } from "express";
import { hashString, compareHashedString } from "../lib/security_service";
import { ISendingCodeToChangePasswordBody } from "../types/interfaces/request_bodies";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import ErrorMessages from "../types/enums/error_messages";
import {
    validateEmailExists,
    createValidationCode,
} from "../services/users_service";
import { generateValidationCode, sendValidationCodeEmail } from "../lib/utils";

async function sendCodeByEmailController(
    req: Request<{}, {}, ISendingCodeToChangePasswordBody, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { email } = req.body;

        await validateEmailExists(email!);

        const validationCode = generateValidationCode();

        const validationCodeHash = hashString(validationCode);

        await createValidationCode(validationCodeHash, email!);

        await sendValidationCodeEmail(email!, validationCode);

        res.status(HttpStatusCodes.CREATED);
    } catch (error) {
        next(error);
    }
}

export { sendCodeByEmailController };

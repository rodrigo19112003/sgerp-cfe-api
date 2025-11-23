import { HttpStatusCodes } from "../types/enums/http";
import { NextFunction, Request, Response } from "express";
import { hashString, compareHashedString } from "../lib/security_service";
import {
    IChangingPasswordBody,
    ISendingCodeToChangePasswordBody,
    IValidationCodeBody,
} from "../types/interfaces/request_bodies";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import ErrorMessages from "../types/enums/error_messages";
import {
    createValidationCode,
    getValidationCodeByEmail,
    updatePasswordByEmail,
} from "../services/users_service";
import { generateValidationCode, sendValidationCodeEmail } from "../lib/utils";

async function sendCodeByEmailController(
    req: Request<{}, {}, ISendingCodeToChangePasswordBody, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { email } = req.body;

        const validationCode = generateValidationCode();

        const validationCodeHash = hashString(validationCode);

        await createValidationCode(validationCodeHash, email!);

        res.sendStatus(HttpStatusCodes.CREATED);

        setImmediate(() => {
            sendValidationCodeEmail({
                email: email!,
                code: validationCode,
            }).catch(() => {});
        });
    } catch (error) {
        next(error);
    }
}

async function verifyValidationCodeController(
    req: Request<{}, {}, IValidationCodeBody, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { email, code } = req.body;

        const validationCodeHash = await getValidationCodeByEmail(email!);

        const validateCode = await compareHashedString(
            code!,
            validationCodeHash
        );

        if (!validateCode) {
            throw new BusinessLogicException(
                ErrorMessages.INVALID_VALIDATION_CODE,
                undefined,
                HttpStatusCodes.UNAUTHORIZED
            );
        }

        res.sendStatus(HttpStatusCodes.OK);
    } catch (error) {
        next(error);
    }
}

async function updatePasswordController(
    req: Request<{}, {}, IChangingPasswordBody, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { email, code, password } = req.body;

        const validationCodeHash = await getValidationCodeByEmail(email!);

        const validateCode = await compareHashedString(
            code!,
            validationCodeHash
        );

        if (!validateCode) {
            throw new BusinessLogicException(
                ErrorMessages.INVALID_VALIDATION_CODE,
                undefined,
                HttpStatusCodes.UNAUTHORIZED
            );
        }

        const passwordHash = hashString(password!);

        await updatePasswordByEmail(email!, passwordHash);

        res.sendStatus(HttpStatusCodes.CREATED);
    } catch (error) {
        next(error);
    }
}

export {
    sendCodeByEmailController,
    verifyValidationCodeController,
    updatePasswordController,
};

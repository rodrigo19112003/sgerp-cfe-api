import {
    getToken,
    isTokenAboutToExpire,
    isValidAuthHeader,
    signToken,
    verifyToken,
} from "../lib/token_store";
import { HttpStatusCodes } from "../types/enums/http";
import UserRoles from "../types/enums/user_roles";
import { NextFunction, Request, Response } from "express";

function checkTokenValidity(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authorizationHeader = String(req.headers.authorization);
    if (!isValidAuthHeader(authorizationHeader)) {
        res.status(HttpStatusCodes.UNAUTHORIZED).send();
        return;
    }

    const token = getToken(authorizationHeader);
    const payload = verifyToken(token);

    if (!payload) {
        res.status(HttpStatusCodes.UNAUTHORIZED).send();
        return;
    }

    if (isTokenAboutToExpire(payload)) {
        const { id, userRoles } = payload;
        const newToken = signToken({ id, userRoles });

        res.header("Set-Authorization", newToken);
    }

    req.user = payload;
    next();
}

function allowRoles(allowedRoles: UserRoles[]) {
    return function (req: Request, res: Response, next: NextFunction) {
        const { userRole } = req.user;

        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            res.status(HttpStatusCodes.FORBIDDEN).send();
        }
    };
}

function validateWorkerOwnership(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const idWorker = parseInt(
        req.params.idWorker ? req.params.idWorker : req.body.idWorker,
        10
    );
    const idUser = req.user.id;

    if (idWorker !== idUser) {
        res.status(HttpStatusCodes.FORBIDDEN).send();
    } else {
        next();
    }
}

export { checkTokenValidity, allowRoles, validateWorkerOwnership };

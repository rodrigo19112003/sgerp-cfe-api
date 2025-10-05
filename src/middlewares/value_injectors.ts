import { NextFunction, Request, Response } from "express";
import { IPaginationQuery } from "../types/interfaces/request_queries";

function injectDefaultGetUsersListQueryMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const MAX_USERS_BATCH_SIZE = 12;
    const query = req.query as IPaginationQuery;

    if (!query.limit || query.limit > MAX_USERS_BATCH_SIZE) {
        query.limit = MAX_USERS_BATCH_SIZE;
    }

    if (!query.offset) {
        query.offset = 0;
    }

    next();
}

export { injectDefaultGetUsersListQueryMiddleware };

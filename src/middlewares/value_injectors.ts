import { NextFunction, Request, Response } from "express";
import { IPaginationQuery } from "../types/interfaces/request_queries";

function injectDefaultGetUsersListQueryMiddleware(
    req: Request<{}, {}, {}, IPaginationQuery>,
    res: Response,
    next: NextFunction
) {
    const MAX_USERS_BATCH_SIZE = 12;

    const rawLimit = Number(req.query.limit);
    const rawOffset = Number(req.query.offset);

    const validatedQuery: IPaginationQuery = {
        limit:
            isNaN(rawLimit) || rawLimit < 1 || rawLimit > MAX_USERS_BATCH_SIZE
                ? MAX_USERS_BATCH_SIZE
                : rawLimit,
        offset: isNaN(rawOffset) || rawOffset < 0 ? 0 : rawOffset,
        query: req.query.query?.toString().trim() || "",
    };

    (req as any).validatedQuery = validatedQuery;

    next();
}

export { injectDefaultGetUsersListQueryMiddleware };

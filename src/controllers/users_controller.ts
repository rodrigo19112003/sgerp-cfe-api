import { NextFunction, Request, Response } from "express";
import { IPaginationQuery } from "../types/interfaces/request_queries";
import { InferAttributes } from "sequelize";
import User from "../models/User";
import { getAllUsers } from "../services/users_service";
import { HttpStatusCodes } from "../types/enums/http";

async function getAllUsersController(
    req: Request<{}, {}, {}, IPaginationQuery>,
    res: Response<InferAttributes<User>[]>,
    next: NextFunction
) {
    try {
        const { limit, offset } = req.query;

        const users = await getAllUsers({ limit: limit!, offset: offset! });

        res.status(HttpStatusCodes.OK).json(users);
    } catch (error) {
        next(error);
    }
}

export { getAllUsersController };

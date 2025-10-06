import { NextFunction, Request, Response } from "express";
import { IPaginationQuery } from "../types/interfaces/request_queries";
import { InferAttributes } from "sequelize";
import User from "../models/User";
import { deleteUserById, getAllUsers } from "../services/users_service";
import { HttpStatusCodes } from "../types/enums/http";
import { IUserByIdParams } from "../types/interfaces/request_parameters";

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

async function deleteUserController(
    req: Request<IUserByIdParams, {}, {}, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { userId } = req.params;

        await deleteUserById(userId!);

        res.sendStatus(HttpStatusCodes.CREATED);
    } catch (error) {
        next(error);
    }
}

export { getAllUsersController, deleteUserController };

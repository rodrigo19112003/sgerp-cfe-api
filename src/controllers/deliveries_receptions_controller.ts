import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { getAllDeliveriesReceptions } from "../services/deliveries_receptions_service";
import { IDeliveriesReceptionsWithWorkerWhoReceives } from "../types/interfaces/response_bodies";

async function getAllDeliveriesReceptionsController(
    req: Request,
    res: Response<IDeliveriesReceptionsWithWorkerWhoReceives[]>,
    next: NextFunction
) {
    try {
        const { id } = req.user;
        const { limit, offset, query } = (req as any).validatedQuery;

        const deliveriesReceptions = await getAllDeliveriesReceptions({
            userId: id,
            limit,
            offset,
            query,
        });

        res.status(HttpStatusCodes.OK).json(deliveriesReceptions);
    } catch (error) {
        next(error);
    }
}

export { getAllDeliveriesReceptionsController };

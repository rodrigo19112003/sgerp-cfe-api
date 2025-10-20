import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import {
    deleteDeliveryReceptionById,
    getAllDeliveriesReceptions,
} from "../services/deliveries_receptions_service";
import { IDeliveriesReceptionsWithWorkerWhoReceives } from "../types/interfaces/response_bodies";
import { IDeliveryReceptionByIdParams } from "../types/interfaces/request_parameters";
import { getZoneManagerAndReceivingWorkerEmailsByDeliveryReceptionId } from "../services/users_service";
import { sendDeletedDeliveryReceptionEmail } from "../lib/utils";

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

async function deleteDeliveryReceptionController(
    req: Request<IDeliveryReceptionByIdParams, {}, {}, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { deliveryReceptionId } = req.params;
        const { id } = req.user;

        const emails =
            await getZoneManagerAndReceivingWorkerEmailsByDeliveryReceptionId(
                deliveryReceptionId!
            );

        const users =
            await getZoneManagerAndReceivingWorkerEmailsByDeliveryReceptionId(
                deliveryReceptionId!
            );

        const sendingWorker = users[0];
        const receivingWorker = users[1];

        await deleteDeliveryReceptionById(deliveryReceptionId!, id!);

        for (const email of emails) {
            setImmediate(() => {
                sendDeletedDeliveryReceptionEmail({
                    sendingWorker,
                    receivingWorker,
                    email,
                }).catch(() => {});
            });
        }

        res.sendStatus(HttpStatusCodes.CREATED);
    } catch (error) {
        next(error);
    }
}

export {
    getAllDeliveriesReceptionsController,
    deleteDeliveryReceptionController,
};

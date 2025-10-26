import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import {
    deleteDeliveryReceptionById,
    getAllDeliveriesReceptionsMade,
    getAllDeliveriesReceptionsReceived,
} from "../services/deliveries_receptions_service";
import { IDeliveriesReceptionsWithWorker } from "../types/interfaces/response_bodies";
import { IDeliveryReceptionByIdParams } from "../types/interfaces/request_parameters";
import { getZoneManagerAndReceivingWorkerEmailsByDeliveryReceptionId } from "../services/users_service";
import { sendDeletedDeliveryReceptionEmail } from "../lib/utils";
import DeliveryReceptionStatusCodes from "../types/enums/delivery_reception_status_codes";

async function getAllDeliveriesReceptionsMadeController(
    req: Request,
    res: Response<IDeliveriesReceptionsWithWorker[]>,
    next: NextFunction
) {
    try {
        const { id } = req.user;
        const { limit, offset, query } = (req as any).validatedQuery;

        const deliveriesReceptions = await getAllDeliveriesReceptionsMade({
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

async function getAllDeliveriesReceptionsReceivedController(
    req: Request,
    res: Response<IDeliveriesReceptionsWithWorker[]>,
    next: NextFunction
) {
    try {
        const { id } = req.user;
        const { limit, offset, query } = (req as any).validatedQuery;

        const deliveriesReceptions = await getAllDeliveriesReceptionsReceived({
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

async function getAllDeliveriesReceptionsPendingController(
    req: Request,
    res: Response<IDeliveriesReceptionsWithWorker[]>,
    next: NextFunction
) {
    try {
        const { id, userRoles } = req.user;
        const { limit, offset, query } = (req as any).validatedQuery;

        const deliveriesReceptions = await getAllDeliveriesReceptionsReceived({
            userId: id,
            userRoles,
            limit,
            offset,
            query,
            deliveryReceptionStatus: DeliveryReceptionStatusCodes.PENDING,
        });

        res.status(HttpStatusCodes.OK).json(deliveriesReceptions);
    } catch (error) {
        next(error);
    }
}

async function getAllDeliveriesReceptionsInProcessController(
    req: Request,
    res: Response<IDeliveriesReceptionsWithWorker[]>,
    next: NextFunction
) {
    try {
        const { id, userRoles } = req.user;
        const { limit, offset, query } = (req as any).validatedQuery;

        const deliveriesReceptions = await getAllDeliveriesReceptionsReceived({
            userId: id,
            userRoles,
            limit,
            offset,
            query,
            deliveryReceptionStatus: DeliveryReceptionStatusCodes.IN_PROCESS,
        });

        res.status(HttpStatusCodes.OK).json(deliveriesReceptions);
    } catch (error) {
        next(error);
    }
}

async function getAllDeliveriesReceptionsReleasedController(
    req: Request,
    res: Response<IDeliveriesReceptionsWithWorker[]>,
    next: NextFunction
) {
    try {
        const { id, userRoles } = req.user;
        const { limit, offset, query } = (req as any).validatedQuery;

        const deliveriesReceptions = await getAllDeliveriesReceptionsReceived({
            userId: id,
            userRoles,
            limit,
            offset,
            query,
            deliveryReceptionStatus: DeliveryReceptionStatusCodes.RELEASED,
        });

        res.status(HttpStatusCodes.OK).json(deliveriesReceptions);
    } catch (error) {
        next(error);
    }
}

export {
    getAllDeliveriesReceptionsMadeController,
    deleteDeliveryReceptionController,
    getAllDeliveriesReceptionsReceivedController,
    getAllDeliveriesReceptionsPendingController,
    getAllDeliveriesReceptionsInProcessController,
    getAllDeliveriesReceptionsReleasedController,
};

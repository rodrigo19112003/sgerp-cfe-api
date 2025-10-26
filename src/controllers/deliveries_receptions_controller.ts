import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import {
    createDeliveryReception,
    deleteDeliveryReceptionById,
    getAllDeliveriesReceptionsMade,
    getAllDeliveriesReceptionsReceived,
} from "../services/deliveries_receptions_service";
import { IDeliveriesReceptionsWithWorker } from "../types/interfaces/response_bodies";
import { IDeliveryReceptionByIdParams } from "../types/interfaces/request_parameters";
import {
    getSendingWorkerAndReceivingWorkerByDeliveryReceptionId,
    getZoneManagersAndReceivingWorkerEmailsByDeliveryReceptionId,
} from "../services/users_service";
import {
    sendCreatedDeliveryReceptionEmail,
    sendDeletedDeliveryReceptionEmail,
} from "../lib/utils";
import DeliveryReceptionStatusCodes from "../types/enums/delivery_reception_status_codes";
import { ICreateOrUpdateDeliveryReceptionBody } from "../types/interfaces/request_bodies";

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
            await getZoneManagersAndReceivingWorkerEmailsByDeliveryReceptionId(
                deliveryReceptionId!
            );

        const users =
            await getSendingWorkerAndReceivingWorkerByDeliveryReceptionId(
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

async function createDeliveryReceptionController(
    req: Request<{}, {}, ICreateOrUpdateDeliveryReceptionBody, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { id } = req.user;

        const {
            generalData,
            procedureReport,
            otherFacts,
            financialResources,
            humanResources,
            materialResources,
            areaBudgetStatus,
            programmaticStatus,
            procedureReportFile,
            financialResourcesFile,
            humanResourcesFile,
            materialResourcesFile,
            areaBugdetStatusFile,
            programmaticStatusFile,
            employeeNumberReceiver,
        } = req.body;

        procedureReportFile!.content! = Buffer.from(
            procedureReportFile!.content! as string,
            "base64"
        );
        financialResourcesFile!.content! = Buffer.from(
            financialResourcesFile!.content! as string,
            "base64"
        );
        humanResourcesFile!.content! = Buffer.from(
            humanResourcesFile!.content! as string,
            "base64"
        );
        materialResourcesFile!.content! = Buffer.from(
            materialResourcesFile!.content! as string,
            "base64"
        );
        areaBugdetStatusFile!.content! = Buffer.from(
            areaBugdetStatusFile!.content! as string,
            "base64"
        );
        programmaticStatusFile!.content! = Buffer.from(
            programmaticStatusFile!.content! as string,
            "base64"
        );

        const deliveryReceptionId = await createDeliveryReception({
            generalData: generalData!,
            procedureReport: procedureReport!,
            otherFacts: otherFacts!,
            financialResources: financialResources!,
            humanResources: humanResources!,
            materialResources: materialResources!,
            areaBudgetStatus: areaBudgetStatus!,
            programmaticStatus: programmaticStatus!,
            procedureReportFile: procedureReportFile!,
            financialResourcesFile: financialResourcesFile!,
            humanResourcesFile: humanResourcesFile!,
            materialResourcesFile: materialResourcesFile!,
            areaBugdetStatusFile: areaBugdetStatusFile!,
            programaticStatusFile: programmaticStatusFile!,
            employeeNumberReceiver: employeeNumberReceiver!,
            makerUserId: id!,
        });

        const emails =
            await getZoneManagersAndReceivingWorkerEmailsByDeliveryReceptionId(
                deliveryReceptionId!
            );

        const users =
            await getSendingWorkerAndReceivingWorkerByDeliveryReceptionId(
                deliveryReceptionId!
            );

        const sendingWorker = users[0];
        const receivingWorker = users[1];

        for (const email of emails) {
            setImmediate(() => {
                sendCreatedDeliveryReceptionEmail({
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
    getAllDeliveriesReceptionsMadeController,
    deleteDeliveryReceptionController,
    getAllDeliveriesReceptionsReceivedController,
    getAllDeliveriesReceptionsPendingController,
    getAllDeliveriesReceptionsInProcessController,
    getAllDeliveriesReceptionsReleasedController,
    createDeliveryReceptionController,
};

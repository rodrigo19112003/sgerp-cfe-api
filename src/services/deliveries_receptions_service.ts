import { InferAttributes, Op } from "sequelize";
import db from "../models";
import SQLException from "../exceptions/services/SQL_Exception";
import { IDeliveriesReceptionsWithWorker } from "../types/interfaces/response_bodies";
import DeliveryReceptionStatusCodes from "../types/enums/delivery_reception_status_codes";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import ErrorMessages from "../types/enums/error_messages";
import { DeleteDeliveryReceptionMadeErrorCodes } from "../types/enums/error_codes";
import { HttpStatusCodes } from "../types/enums/http";
import DeliveryReceptionReceived from "../models/DeliveryReceptionReceived";
import UserRoles from "../types/enums/user_roles";

async function getAllDeliveriesReceptionsMade(pagination: {
    userId: number;
    offset: number;
    limit: number;
    query: string;
}): Promise<IDeliveriesReceptionsWithWorker[]> {
    try {
        const { userId, offset, limit, query } = pagination;

        const whereCondition =
            query && query.trim() !== ""
                ? {
                      [Op.or]: [
                          { employeeNumber: { [Op.like]: `%${query}%` } },
                          { fullName: { [Op.like]: `%${query}%` } },
                      ],
                  }
                : undefined;

        const deliveriesReceptionsReceived =
            await db.DeliveryReceptionReceived.findAll({
                include: [
                    {
                        model: db.DeliveryReception,
                        as: "deliveryReception",
                        where: { userId },
                    },
                    {
                        model: db.User,
                        as: "user",
                        where: whereCondition,
                        include: [
                            {
                                model: db.Role,
                                as: "roles",
                                through: { attributes: [] },
                            },
                        ],
                    },
                ],
                order: [["id", "DESC"]],
            });

        const grouped = new Map<number, typeof deliveriesReceptionsReceived>();

        for (const dr of deliveriesReceptionsReceived) {
            const id = dr.deliveryReceptionId;
            if (!grouped.has(id)) grouped.set(id, []);
            grouped.get(id)!.push(dr);
        }

        const deliveriesReceptionsList: IDeliveriesReceptionsWithWorker[] = [];

        for (const [_, group] of grouped) {
            const acceptedValues = group.map((g) => g.accepted);

            let status: DeliveryReceptionStatusCodes;

            const signedCount = acceptedValues.filter(
                (accepted) => accepted === true
            ).length;

            if (signedCount === 0) {
                status = DeliveryReceptionStatusCodes.PENDING;
            } else if (signedCount === 3) {
                status = DeliveryReceptionStatusCodes.RELEASED;
            } else {
                status = DeliveryReceptionStatusCodes.IN_PROCESS;
            }

            let deliveryReceptionReceived: DeliveryReceptionReceived;

            for (const dr of group) {
                if (
                    dr.user!.roles!.some(
                        (role) => role.name === UserRoles.WORKER
                    )
                ) {
                    deliveryReceptionReceived = dr;
                    break;
                }
            }

            deliveriesReceptionsList.push({
                ...deliveryReceptionReceived!.toJSON(),
                deliveryReceptionId:
                    deliveryReceptionReceived!.deliveryReceptionId,
                employeeNumberReceiver:
                    deliveryReceptionReceived!.user!.employeeNumber,
                fullNameReceiver: deliveryReceptionReceived!.user!.fullName,
                status,
            });
        }

        const start = offset || 0;
        const end = limit ? start + limit : undefined;

        return deliveriesReceptionsList.slice(start, end);
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

async function deleteDeliveryReceptionById(
    deliveryReceptionId: number,
    userId: number
): Promise<void> {
    try {
        const deliveryReception = await db.DeliveryReception.findOne({
            where: { id: deliveryReceptionId, userId },
        });

        if (deliveryReception === null) {
            throw new BusinessLogicException(
                ErrorMessages.DELIVERY_RECEPTION_MADE_NOT_FOUND,
                DeleteDeliveryReceptionMadeErrorCodes.DELIVERY_RECEPTION_MADE_NOT_FOUND,
                HttpStatusCodes.NOT_FOUND
            );
        }

        const deliveriesReceptions = await db.DeliveryReceptionReceived.findAll(
            {
                include: [
                    {
                        model: db.DeliveryReception,
                        as: "deliveryReception",
                        where: { id: deliveryReceptionId },
                    },
                ],
                order: [["id", "DESC"]],
            }
        );

        const grouped = new Map<number, typeof deliveriesReceptions>();

        for (const dr of deliveriesReceptions) {
            const id = dr.deliveryReceptionId;
            if (!grouped.has(id)) grouped.set(id, []);
            grouped.get(id)!.push(dr);
        }

        for (const [_, group] of grouped) {
            const acceptedValues = group.map((g) => g.accepted);

            let status: DeliveryReceptionStatusCodes;

            const signedCount = acceptedValues.filter(
                (accepted) => accepted === true
            ).length;

            if (signedCount === 0) {
                status = DeliveryReceptionStatusCodes.PENDING;
            } else if (signedCount === 3) {
                status = DeliveryReceptionStatusCodes.RELEASED;
            } else {
                status = DeliveryReceptionStatusCodes.IN_PROCESS;
            }

            if (status !== DeliveryReceptionStatusCodes.PENDING) {
                throw new BusinessLogicException(
                    ErrorMessages.DELIVERY_RECEPTION_MADE_CANNOT_BE_DELETED,
                    DeleteDeliveryReceptionMadeErrorCodes.DELIVERY_RECEPTION_MADE_CANNOT_BE_DELETED,
                    HttpStatusCodes.BAD_REQUEST
                );
            }
        }

        await db.DeliveryReception.destroy({
            where: { id: deliveryReceptionId, userId },
        });
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

async function getAllDeliveriesReceptionsReceived(pagination: {
    userId: number;
    offset: number;
    limit: number;
    query: string;
    deliveryReceptionStatus?: DeliveryReceptionStatusCodes | null;
}): Promise<IDeliveriesReceptionsWithWorker[]> {
    try {
        const { userId, offset, limit, query, deliveryReceptionStatus } =
            pagination;

        const whereCondition =
            query && query.trim() !== ""
                ? {
                      [Op.or]: [
                          { employeeNumber: { [Op.like]: `%${query}%` } },
                          { fullName: { [Op.like]: `%${query}%` } },
                      ],
                  }
                : undefined;

        const deliveriesReceptionsByUserId =
            await db.DeliveryReceptionReceived.findAll({
                where: { userId },
                include: [
                    {
                        model: db.DeliveryReception,
                        as: "deliveryReception",
                        include: [
                            {
                                model: db.User,
                                as: "user",
                                where: whereCondition,
                                include: [
                                    {
                                        model: db.Role,
                                        as: "roles",
                                        through: { attributes: [] },
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        model: db.User,
                        as: "user",
                        include: [
                            {
                                model: db.Role,
                                as: "roles",
                                through: { attributes: [] },
                            },
                        ],
                    },
                ],
                order: [["id", "DESC"]],
                limit,
                offset,
            });

        if (deliveriesReceptionsByUserId.length === 0) return [];

        const deliveryReceptionIds = deliveriesReceptionsByUserId.map(
            (dr) => dr.deliveryReceptionId
        );

        const allSignatures = await db.DeliveryReceptionReceived.findAll({
            where: {
                deliveryReceptionId: { [Op.in]: deliveryReceptionIds },
            },
        });

        const groupedByReception = new Map<number, typeof allSignatures>();
        for (const sig of allSignatures) {
            const id = sig.deliveryReceptionId;
            if (!groupedByReception.has(id)) groupedByReception.set(id, []);
            groupedByReception.get(id)!.push(sig);
        }

        const deliveriesReceptionsList: IDeliveriesReceptionsWithWorker[] = [];

        for (const deliveryReceptionReceived of deliveriesReceptionsByUserId) {
            const group = groupedByReception.get(
                deliveryReceptionReceived.deliveryReceptionId
            );

            const signedCount = group
                ? group.filter((g) => g.accepted).length
                : 0;

            let status: DeliveryReceptionStatusCodes;
            if (signedCount === 0) {
                status = DeliveryReceptionStatusCodes.PENDING;
            } else if (signedCount === 3) {
                status = DeliveryReceptionStatusCodes.RELEASED;
            } else {
                status = DeliveryReceptionStatusCodes.IN_PROCESS;
            }

            if (
                !deliveryReceptionStatus ||
                status === deliveryReceptionStatus
            ) {
                deliveriesReceptionsList.push({
                    ...deliveryReceptionReceived.toJSON(),
                    deliveryReceptionId:
                        deliveryReceptionReceived.deliveryReception!.id,
                    employeeNumberReceiver:
                        deliveryReceptionReceived.user!.employeeNumber,
                    fullNameReceiver: deliveryReceptionReceived.user!.fullName,
                    employeeNumberMaker:
                        deliveryReceptionReceived.deliveryReception!.user!
                            .employeeNumber,
                    fullNameMaker:
                        deliveryReceptionReceived.deliveryReception!.user!
                            .fullName,
                    status,
                });
            }
        }

        return deliveriesReceptionsList;
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

export {
    getAllDeliveriesReceptionsMade,
    deleteDeliveryReceptionById,
    getAllDeliveriesReceptionsReceived,
};

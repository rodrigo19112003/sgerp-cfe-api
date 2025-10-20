import { InferAttributes, Op } from "sequelize";
import db from "../models";
import SQLException from "../exceptions/services/SQL_Exception";
import { IDeliveriesReceptionsWithWorkerWhoReceives } from "../types/interfaces/response_bodies";
import DeliveryReceptionStatusCodes from "../types/enums/delivery_reception_status_codes";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import ErrorMessages from "../types/enums/error_messages";
import { DeleteDeliveryReceptionMadeErrorCodes } from "../types/enums/error_codes";
import { HttpStatusCodes } from "../types/enums/http";
import DeliveryReceptionReceived from "../models/DeliveryReceptionReceived";
import UserRoles from "../types/enums/user_roles";

async function getAllDeliveriesReceptions(pagination: {
    userId: number;
    offset: number;
    limit: number;
    query: string;
}): Promise<IDeliveriesReceptionsWithWorkerWhoReceives[]> {
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

        const deliveriesReceptions = await db.DeliveryReceptionReceived.findAll(
            {
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
            }
        );

        const grouped = new Map<number, typeof deliveriesReceptions>();

        for (const dr of deliveriesReceptions) {
            const id = dr.deliveryReceptionId;
            if (!grouped.has(id)) grouped.set(id, []);
            grouped.get(id)!.push(dr);
        }

        const deliveriesReceptionsList: IDeliveriesReceptionsWithWorkerWhoReceives[] =
            [];

        for (const [_, group] of grouped) {
            const acceptedValues = group.map((g) => g.accepted);

            let status: DeliveryReceptionStatusCodes;

            const allNull = acceptedValues.every((v) => v === null);
            const allTrue = acceptedValues.every((v) => v === true);

            if (allNull) {
                status = DeliveryReceptionStatusCodes.PENDING;
            } else if (allTrue) {
                status = DeliveryReceptionStatusCodes.RELEASED;
            } else {
                status = DeliveryReceptionStatusCodes.IN_PROCESS;
            }

            let deliveryReception: DeliveryReceptionReceived;

            for (const dr of group) {
                if (dr.user!.roles!.some((role) => role.name === "WORKER")) {
                    deliveryReception = dr;
                    break;
                }
            }

            deliveriesReceptionsList.push({
                ...deliveryReception!.toJSON(),
                deliveryReceptionId: deliveryReception!.deliveryReceptionId,
                employeeNumberReceiver: deliveryReception!.user!.employeeNumber,
                fullNameReceiver: deliveryReception!.user!.fullName,
                status,
            });
        }

        const start = offset || 0;
        const end = limit ? start + limit : undefined;

        return deliveriesReceptionsList.slice(start, end);
    } catch (error: any) {
        if (error.isTrusted) throw error;
        else throw new SQLException(error);
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

        await db.DeliveryReception.destroy({
            where: { id: deliveryReceptionId, userId },
        });
    } catch (error: any) {
        if (error.isTrusted) throw error;
        else throw new SQLException(error);
    }
}

export { getAllDeliveriesReceptions, deleteDeliveryReceptionById };

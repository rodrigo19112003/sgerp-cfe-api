import { InferAttributes, Op } from "sequelize";
import db from "../models";
import SQLException from "../exceptions/services/SQL_Exception";
import { IDeliveriesReceptionsWithWorkerWhoReceives } from "../types/interfaces/response_bodies";
import DeliveryReceptionStatusCodes from "../types/enums/delivery_reception_status_codes";

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

            const first = group[0];

            deliveriesReceptionsList.push({
                ...first.toJSON(),
                employeeNumberReceiver: first.user!.employeeNumber,
                fullNameReceiver: first.user!.fullName,
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

export { getAllDeliveriesReceptions };

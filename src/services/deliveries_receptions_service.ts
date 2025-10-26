import { InferAttributes, Op } from "sequelize";
import db from "../models";
import SQLException from "../exceptions/services/SQL_Exception";
import { IDeliveriesReceptionsWithWorker } from "../types/interfaces/response_bodies";
import DeliveryReceptionStatusCodes from "../types/enums/delivery_reception_status_codes";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import ErrorMessages from "../types/enums/error_messages";
import {
    CreateOrUpdateDeliveryReceptionErrorCodes,
    DeleteDeliveryReceptionMadeErrorCodes,
} from "../types/enums/error_codes";
import { HttpStatusCodes } from "../types/enums/http";
import DeliveryReceptionReceived from "../models/DeliveryReceptionReceived";
import UserRoles from "../types/enums/user_roles";
import { IFile } from "../types/interfaces/request_bodies";
import Category from "../models/Category";

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
                ErrorMessages.DELIVERY_RECEPTION_NOT_FOUND,
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
                    ErrorMessages.DELIVERY_RECEPTION_CANNOT_BE_DELETED,
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
    userRoles?: UserRoles[];
    offset: number;
    limit: number;
    query: string;
    deliveryReceptionStatus?: DeliveryReceptionStatusCodes | null;
}): Promise<IDeliveriesReceptionsWithWorker[]> {
    try {
        const {
            userId,
            userRoles,
            offset,
            limit,
            query,
            deliveryReceptionStatus,
        } = pagination;

        let filteredReceptionIds: number[] | null = null;
        if (query && query.trim() !== "") {
            const matchedReceptions = await db.DeliveryReception.findAll({
                attributes: ["id"],
                include: [
                    {
                        model: db.User,
                        as: "user",
                        where: {
                            [Op.or]: [
                                { nombreCompleto: { [Op.like]: `%${query}%` } },
                                {
                                    registroPersonal: {
                                        [Op.like]: `%${query}%`,
                                    },
                                },
                            ],
                        },
                        attributes: [],
                    },
                ],
            });
            filteredReceptionIds = matchedReceptions.map((r) => r.id);
            if (filteredReceptionIds.length === 0) return [];
        }

        const deliveriesReceptionsByUserId =
            await db.DeliveryReceptionReceived.findAll({
                where: {
                    userId,
                    ...(filteredReceptionIds
                        ? {
                              deliveryReceptionId: {
                                  [Op.in]: filteredReceptionIds,
                              },
                          }
                        : {}),
                },
                include: [
                    {
                        model: db.DeliveryReception,
                        as: "deliveryReception",
                        include: [
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
                offset,
                limit,
                order: [["id", "DESC"]],
            });

        if (
            !deliveriesReceptionsByUserId ||
            deliveriesReceptionsByUserId.length === 0
        )
            return [];

        const deliveryReceptionIds = deliveriesReceptionsByUserId.map(
            (dr) => dr.deliveryReceptionId
        );

        const allSignatures = await db.DeliveryReceptionReceived.findAll({
            where: { deliveryReceptionId: { [Op.in]: deliveryReceptionIds } },
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
            if (signedCount === 0)
                status = DeliveryReceptionStatusCodes.PENDING;
            else if (signedCount === 3)
                status = DeliveryReceptionStatusCodes.RELEASED;
            else status = DeliveryReceptionStatusCodes.IN_PROCESS;

            if (userRoles && userRoles.includes(UserRoles.WITNESS)) {
                const userSignature = group?.find(
                    (g) => g.userId === userId && g.accepted
                );
                status = userSignature
                    ? DeliveryReceptionStatusCodes.IN_PROCESS
                    : DeliveryReceptionStatusCodes.PENDING;
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
        console.log(error);
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

async function createDeliveryReception(deliveryReception: {
    generalData: string;
    otherFacts: string;
    procedureReport: string;
    financialResources: string;
    humanResources: string;
    materialResources: string;
    areaBudgetStatus: string;
    programmaticStatus: string;
    procedureReportFile: IFile;
    financialResourcesFile: IFile;
    humanResourcesFile: IFile;
    materialResourcesFile: IFile;
    areaBudgetStatusFile: IFile;
    programmaticStatusFile: IFile;
    employeeNumberReceiver: string;
    makerUserId: number;
}): Promise<number | null> {
    let deliveryReceptionId: number | null = null;
    try {
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
            areaBudgetStatusFile,
            programmaticStatusFile,
            employeeNumberReceiver,
            makerUserId,
        } = deliveryReception;

        const receivingWorker = await db.User.findOne({
            where: { employeeNumber: employeeNumberReceiver },
        });

        if (receivingWorker === null) {
            throw new BusinessLogicException(
                ErrorMessages.RECEIVING_WORKER_NOT_FOUND,
                CreateOrUpdateDeliveryReceptionErrorCodes.RECEIVING_WORKER_NOT_FOUND,
                HttpStatusCodes.NOT_FOUND
            );
        }

        const deliveryReceptionExists = await db.DeliveryReception.findOne({
            where: {
                userId: makerUserId,
            },
            include: [
                {
                    model: db.DeliveryReceptionReceived,
                    as: "received",
                    where: { userId: receivingWorker.id },
                },
            ],
        });

        if (deliveryReceptionExists !== null) {
            const deliveriesReceptionsReceived =
                await db.DeliveryReceptionReceived.findAll({
                    where: {
                        deliveryReceptionId: deliveryReceptionExists.id,
                    },
                });

            const signedCount = deliveriesReceptionsReceived
                ? deliveriesReceptionsReceived.filter((g) => g.accepted).length
                : 0;

            if (signedCount !== 3) {
                throw new BusinessLogicException(
                    ErrorMessages.DELIVERY_RECEPTION_ALREADY_EXISTS_FOR_WORKER,
                    CreateOrUpdateDeliveryReceptionErrorCodes.DELIVERY_RECEPTION_ALREADY_EXISTS_FOR_WORKER,
                    HttpStatusCodes.BAD_REQUEST
                );
            }
        }

        await db.sequelize.transaction(async () => {
            const deliveryReceptionCreated = await db.DeliveryReception.create({
                generalData,
                procedureReport,
                otherFacts,
                financialResources,
                humanResources,
                materialResources,
                areaBudgetStatus,
                programmaticStatus,
                userId: makerUserId,
            });

            deliveryReceptionId = deliveryReceptionCreated.id;

            const reportCategory = await validateCategoryExists(
                procedureReportFile.category
            );
            const financialCategory = await validateCategoryExists(
                financialResourcesFile.category
            );
            const humanCategory = await validateCategoryExists(
                humanResourcesFile.category
            );
            const materialCategory = await validateCategoryExists(
                materialResourcesFile.category
            );
            const areaBudgetCategory = await validateCategoryExists(
                areaBudgetStatusFile.category
            );
            const programmaticCategory = await validateCategoryExists(
                programmaticStatusFile.category
            );

            await db.Evidence.bulkCreate([
                {
                    name: procedureReportFile.name,
                    content: procedureReportFile.content as Buffer,
                    categoryId: reportCategory.id,
                    deliveryReceptionId: deliveryReceptionCreated.id,
                },
                {
                    name: financialResourcesFile.name,
                    content: financialResourcesFile.content as Buffer,
                    categoryId: financialCategory.id,
                    deliveryReceptionId: deliveryReceptionCreated.id,
                },
                {
                    name: humanResourcesFile.name,
                    content: humanResourcesFile.content as Buffer,
                    categoryId: humanCategory.id,
                    deliveryReceptionId: deliveryReceptionCreated.id,
                },
                {
                    name: materialResourcesFile.name,
                    content: materialResourcesFile.content as Buffer,
                    categoryId: materialCategory.id,
                    deliveryReceptionId: deliveryReceptionCreated.id,
                },
                {
                    name: areaBudgetStatusFile.name,
                    content: areaBudgetStatusFile.content as Buffer,
                    categoryId: areaBudgetCategory.id,
                    deliveryReceptionId: deliveryReceptionCreated.id,
                },
                {
                    name: programmaticStatusFile.name,
                    content: programmaticStatusFile.content as Buffer,
                    categoryId: programmaticCategory.id,
                    deliveryReceptionId: deliveryReceptionCreated.id,
                },
            ]);

            const zoneManagers = await db.User.findAll({
                include: [
                    {
                        model: db.Role,
                        as: "roles",
                        where: { name: UserRoles.ZONE_MANAGER },
                        through: { attributes: [] },
                    },
                ],
            });

            await db.DeliveryReceptionReceived.bulkCreate([
                {
                    deliveryReceptionId: deliveryReceptionCreated.id,
                    userId: receivingWorker.id,
                    accepted: null,
                },
                ...zoneManagers.map((zm) => ({
                    deliveryReceptionId: deliveryReceptionCreated.id,
                    userId: zm.id,
                    accepted: null,
                })),
            ]);
        });
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return deliveryReceptionId;
}

async function updateDeliveryReception(deliveryReception: {
    deliveryReceptionId: number;
    generalData: string;
    otherFacts: string;
    procedureReport: string;
    financialResources: string;
    humanResources: string;
    materialResources: string;
    areaBudgetStatus: string;
    programmaticStatus: string;
    procedureReportFile: IFile;
    financialResourcesFile: IFile;
    humanResourcesFile: IFile;
    materialResourcesFile: IFile;
    areaBudgetStatusFile: IFile;
    programmaticStatusFile: IFile;
    makerUserId: number;
}): Promise<void> {
    try {
        const {
            deliveryReceptionId,
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
            areaBudgetStatusFile,
            programmaticStatusFile,
            makerUserId,
        } = deliveryReception;

        const deliveryReceptionExists = await db.DeliveryReception.findOne({
            where: {
                id: deliveryReceptionId,
                userId: makerUserId,
            },
        });

        if (deliveryReceptionExists === null) {
            throw new BusinessLogicException(
                ErrorMessages.DELIVERY_RECEPTION_NOT_FOUND,
                CreateOrUpdateDeliveryReceptionErrorCodes.DELIVERY_RECEPTION_NOT_FOUND,
                HttpStatusCodes.NOT_FOUND
            );
        }

        await db.sequelize.transaction(async () => {
            await db.DeliveryReception.update(
                {
                    generalData,
                    procedureReport,
                    otherFacts,
                    financialResources,
                    humanResources,
                    materialResources,
                    areaBudgetStatus,
                    programmaticStatus,
                },
                {
                    where: {
                        id: deliveryReceptionId,
                    },
                }
            );

            const reportCategory = await validateCategoryExists(
                procedureReportFile.category
            );
            const financialCategory = await validateCategoryExists(
                financialResourcesFile.category
            );
            const humanCategory = await validateCategoryExists(
                humanResourcesFile.category
            );
            const materialCategory = await validateCategoryExists(
                materialResourcesFile.category
            );
            const areaBudgetCategory = await validateCategoryExists(
                areaBudgetStatusFile.category
            );
            const programmaticCategory = await validateCategoryExists(
                programmaticStatusFile.category
            );

            const evidencesToUpdate = [
                { file: procedureReportFile, category: reportCategory },
                { file: financialResourcesFile, category: financialCategory },
                { file: humanResourcesFile, category: humanCategory },
                { file: materialResourcesFile, category: materialCategory },
                { file: areaBudgetStatusFile, category: areaBudgetCategory },
                {
                    file: programmaticStatusFile,
                    category: programmaticCategory,
                },
            ];

            await Promise.all(
                evidencesToUpdate.map(({ file, category }) =>
                    db.Evidence.update(
                        {
                            name: file.name,
                            content: file.content as Buffer,
                        },
                        {
                            where: {
                                deliveryReceptionId,
                                categoryId: category.id,
                            },
                        }
                    )
                )
            );
        });
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

async function validateCategoryExists(roleName: string): Promise<Category> {
    let category: Category;
    try {
        const categoryInDatabse = await db.Category.findOne({
            where: {
                name: roleName,
            },
        });

        if (categoryInDatabse === null) {
            throw new BusinessLogicException(
                ErrorMessages.CATEGORY_NOT_FOUND,
                CreateOrUpdateDeliveryReceptionErrorCodes.CATEGORY_NOT_FOUND,
                HttpStatusCodes.NOT_FOUND
            );
        }

        category = categoryInDatabse;
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return category;
}

export {
    getAllDeliveriesReceptionsMade,
    deleteDeliveryReceptionById,
    getAllDeliveriesReceptionsReceived,
    createDeliveryReception,
    updateDeliveryReception,
};

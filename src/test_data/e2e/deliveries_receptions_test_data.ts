import db from "../../models";
import EvidenceCategories from "../../types/enums/evidence_categories";
import UserRoles from "../../types/enums/user_roles";

async function insertE2EGetAllDeliveriesReceptionsMadeTestData() {
    const workerMakerUser = await db.User.create({
        employeeNumber: "200AA",
        fullName: "Eva Martinez",
        email: "eva.martinez@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const workerReceiverUser = await db.User.create({
        employeeNumber: "202BB",
        fullName: "Luis Garcia",
        email: "luis.garcia@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const workerRole = await db.Role.create({
        name: UserRoles.WORKER,
    });

    const zoneManagerAndWitnessUser1 = await db.User.create({
        employeeNumber: "201AA",
        fullName: "Carlos Lopez",
        email: "carlos.lopez@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const zoneManagerAndWitnessUser2 = await db.User.create({
        employeeNumber: "203BB",
        fullName: "Ana Torres",
        email: "ana.torres@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const witnessRole = await db.Role.create({
        name: UserRoles.WITNESS,
    });

    const zoneManagerRole = await db.Role.create({
        name: UserRoles.ZONE_MANAGER,
    });

    await db.UserRole.bulkCreate([
        {
            userId: workerMakerUser.id,
            roleId: workerRole.id,
        },
        {
            userId: workerReceiverUser.id,
            roleId: workerRole.id,
        },
        {
            userId: zoneManagerAndWitnessUser1.id,
            roleId: witnessRole.id,
        },
        {
            userId: zoneManagerAndWitnessUser1.id,
            roleId: zoneManagerRole.id,
        },
        { userId: zoneManagerAndWitnessUser2.id, roleId: witnessRole.id },
        {
            userId: zoneManagerAndWitnessUser2.id,
            roleId: zoneManagerRole.id,
        },
    ]);

    const deliveryReception = await db.DeliveryReception.create({
        generalData: "General data 1",
        procedureReport: "Procedure report 1",
        otherFacts: "Other facts 1",
        financialResources: "Financial resources 1",
        humanResources: "Human resources 1",
        materialResources: "Material resources 1",
        areaBudgetStatus: "Area budget status 1",
        programmaticStatus: "Programmatic status 1",
        userId: workerMakerUser.id,
    });

    const categories = await db.Category.bulkCreate([
        { name: EvidenceCategories.BUDGET },
        { name: EvidenceCategories.DATA },
        { name: EvidenceCategories.FINANCE },
        { name: EvidenceCategories.HUMAN },
        { name: EvidenceCategories.MATERIAL },
        { name: EvidenceCategories.OTHER },
        { name: EvidenceCategories.PROGRAMMATIC },
        { name: EvidenceCategories.REPORT },
    ]);

    for (const category of categories) {
        await db.Evidence.create({
            name: `Evidence for ${category.name}`,
            content: Buffer.from("Sample content"),
            deliveryReceptionId: deliveryReception.id,
            categoryId: category.id,
        });
    }

    await db.DeliveryReceptionReceived.bulkCreate([
        {
            userId: zoneManagerAndWitnessUser1.id,
            deliveryReceptionId: deliveryReception.id,
            accepted: true,
        },
        {
            userId: zoneManagerAndWitnessUser2.id,
            deliveryReceptionId: deliveryReception.id,
            accepted: true,
        },
        {
            userId: workerReceiverUser.id,
            deliveryReceptionId: deliveryReception.id,
            accepted: true,
        },
    ]);

    return {
        workerMakerUser,
        workerReceiverUser,
        zoneManagerAndWitnessUser1,
        deliveryReception,
    };
}

async function insertE2EDeleteDeliveryReceptionTestData() {
    const workerMakerUser = await db.User.create({
        employeeNumber: "200AA",
        fullName: "Eva Martinez",
        email: "eva.martinez@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const workerReceiverUser = await db.User.create({
        employeeNumber: "202BB",
        fullName: "Luis Garcia",
        email: "luis.garcia@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const workerRole = await db.Role.create({
        name: UserRoles.WORKER,
    });

    const zoneManagerAndWitnessUser1 = await db.User.create({
        employeeNumber: "201AA",
        fullName: "Carlos Lopez",
        email: "carlos.lopez@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const zoneManagerAndWitnessUser2 = await db.User.create({
        employeeNumber: "203BB",
        fullName: "Ana Torres",
        email: "ana.torres@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const witnessRole = await db.Role.create({
        name: UserRoles.WITNESS,
    });

    const zoneManagerRole = await db.Role.create({
        name: UserRoles.ZONE_MANAGER,
    });

    await db.UserRole.bulkCreate([
        {
            userId: workerMakerUser.id,
            roleId: workerRole.id,
        },
        {
            userId: workerReceiverUser.id,
            roleId: workerRole.id,
        },
        {
            userId: zoneManagerAndWitnessUser1.id,
            roleId: witnessRole.id,
        },
        {
            userId: zoneManagerAndWitnessUser1.id,
            roleId: zoneManagerRole.id,
        },
        { userId: zoneManagerAndWitnessUser2.id, roleId: witnessRole.id },
        {
            userId: zoneManagerAndWitnessUser2.id,
            roleId: zoneManagerRole.id,
        },
    ]);

    const deliveryReception = await db.DeliveryReception.create({
        generalData: "General data 1",
        procedureReport: "Procedure report 1",
        otherFacts: "Other facts 1",
        financialResources: "Financial resources 1",
        humanResources: "Human resources 1",
        materialResources: "Material resources 1",
        areaBudgetStatus: "Area budget status 1",
        programmaticStatus: "Programmatic status 1",
        userId: workerMakerUser.id,
    });

    const categories = await db.Category.bulkCreate([
        { name: EvidenceCategories.BUDGET },
        { name: EvidenceCategories.DATA },
        { name: EvidenceCategories.FINANCE },
        { name: EvidenceCategories.HUMAN },
        { name: EvidenceCategories.MATERIAL },
        { name: EvidenceCategories.OTHER },
        { name: EvidenceCategories.PROGRAMMATIC },
        { name: EvidenceCategories.REPORT },
    ]);

    for (const category of categories) {
        await db.Evidence.create({
            name: `Evidence for ${category.name}`,
            content: Buffer.from("Sample content"),
            deliveryReceptionId: deliveryReception.id,
            categoryId: category.id,
        });
    }

    await db.DeliveryReceptionReceived.bulkCreate([
        {
            userId: zoneManagerAndWitnessUser1.id,
            deliveryReceptionId: deliveryReception.id,
            accepted: false,
        },
        {
            userId: zoneManagerAndWitnessUser2.id,
            deliveryReceptionId: deliveryReception.id,
            accepted: false,
        },
        {
            userId: workerReceiverUser.id,
            deliveryReceptionId: deliveryReception.id,
            accepted: false,
        },
    ]);

    return {
        workerMakerUser,
        workerReceiverUser,
        zoneManagerAndWitnessUser1,
        categories,
        deliveryReception,
    };
}

async function insertE2EGetAllDeliveriesReceptionsReceivedTestData() {
    const { workerReceiverUser, deliveryReception } =
        await insertE2EGetAllDeliveriesReceptionsMadeTestData();

    return {
        workerReceiverUser,
        deliveryReception,
    };
}

async function insertE2EGetAllDeliveriesReceptionsPendingTestData() {
    const { zoneManagerAndWitnessUser1, deliveryReception } =
        await insertE2EGetAllDeliveriesReceptionsMadeTestData();

    return {
        zoneManagerAndWitnessUser1,
        deliveryReception,
    };
}

async function insertE2EGetAllDeliveriesReceptionsInProcessTestData() {
    const workerMakerUser = await db.User.create({
        employeeNumber: "200AA",
        fullName: "Eva Martinez",
        email: "eva.martinez@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const workerReceiverUser = await db.User.create({
        employeeNumber: "202BB",
        fullName: "Luis Garcia",
        email: "luis.garcia@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const workerRole = await db.Role.create({
        name: UserRoles.WORKER,
    });

    const zoneManagerAndWitnessUser1 = await db.User.create({
        employeeNumber: "201AA",
        fullName: "Carlos Lopez",
        email: "carlos.lopez@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const zoneManagerAndWitnessUser2 = await db.User.create({
        employeeNumber: "203BB",
        fullName: "Ana Torres",
        email: "ana.torres@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const witnessRole = await db.Role.create({
        name: UserRoles.WITNESS,
    });

    const zoneManagerRole = await db.Role.create({
        name: UserRoles.ZONE_MANAGER,
    });

    await db.UserRole.bulkCreate([
        {
            userId: workerMakerUser.id,
            roleId: workerRole.id,
        },
        {
            userId: workerReceiverUser.id,
            roleId: workerRole.id,
        },
        {
            userId: zoneManagerAndWitnessUser1.id,
            roleId: witnessRole.id,
        },
        {
            userId: zoneManagerAndWitnessUser1.id,
            roleId: zoneManagerRole.id,
        },
        { userId: zoneManagerAndWitnessUser2.id, roleId: witnessRole.id },
        {
            userId: zoneManagerAndWitnessUser2.id,
            roleId: zoneManagerRole.id,
        },
    ]);

    const deliveryReception = await db.DeliveryReception.create({
        generalData: "General data 1",
        procedureReport: "Procedure report 1",
        otherFacts: "Other facts 1",
        financialResources: "Financial resources 1",
        humanResources: "Human resources 1",
        materialResources: "Material resources 1",
        areaBudgetStatus: "Area budget status 1",
        programmaticStatus: "Programmatic status 1",
        userId: workerMakerUser.id,
    });

    await db.DeliveryReceptionReceived.bulkCreate([
        {
            userId: zoneManagerAndWitnessUser1.id,
            deliveryReceptionId: deliveryReception.id,
            accepted: true,
        },
        {
            userId: zoneManagerAndWitnessUser2.id,
            deliveryReceptionId: deliveryReception.id,
            accepted: false,
        },
        {
            userId: workerReceiverUser.id,
            deliveryReceptionId: deliveryReception.id,
            accepted: false,
        },
    ]);

    return {
        zoneManagerAndWitnessUser1,
        deliveryReception,
    };
}

async function insertE2EGetAllDeliveriesReceptionsReleasedTestData() {
    const { zoneManagerAndWitnessUser1, deliveryReception } =
        await insertE2EGetAllDeliveriesReceptionsMadeTestData();
    return {
        zoneManagerAndWitnessUser1,
        deliveryReception,
    };
}

async function insertE2ECreateDeliveryReceptionTestData() {
    const workerMakerUser = await db.User.create({
        employeeNumber: "200AA",
        fullName: "Eva Martinez",
        email: "eva.martinez@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const workerReceiverUser = await db.User.create({
        employeeNumber: "202BB",
        fullName: "Luis Garcia",
        email: "luis.garcia@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const workerRole = await db.Role.create({
        name: UserRoles.WORKER,
    });

    const zoneManagerAndWitnessUser1 = await db.User.create({
        employeeNumber: "201AA",
        fullName: "Carlos Lopez",
        email: "carlos.lopez@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const zoneManagerAndWitnessUser2 = await db.User.create({
        employeeNumber: "203BB",
        fullName: "Ana Torres",
        email: "ana.torres@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const witnessRole = await db.Role.create({
        name: UserRoles.WITNESS,
    });

    const zoneManagerRole = await db.Role.create({
        name: UserRoles.ZONE_MANAGER,
    });

    await db.UserRole.bulkCreate([
        {
            userId: workerMakerUser.id,
            roleId: workerRole.id,
        },
        {
            userId: workerReceiverUser.id,
            roleId: workerRole.id,
        },
        {
            userId: zoneManagerAndWitnessUser1.id,
            roleId: witnessRole.id,
        },
        {
            userId: zoneManagerAndWitnessUser1.id,
            roleId: zoneManagerRole.id,
        },
        { userId: zoneManagerAndWitnessUser2.id, roleId: witnessRole.id },
        {
            userId: zoneManagerAndWitnessUser2.id,
            roleId: zoneManagerRole.id,
        },
    ]);

    await db.Category.bulkCreate([
        { name: EvidenceCategories.BUDGET },
        { name: EvidenceCategories.DATA },
        { name: EvidenceCategories.FINANCE },
        { name: EvidenceCategories.HUMAN },
        { name: EvidenceCategories.MATERIAL },
        { name: EvidenceCategories.OTHER },
        { name: EvidenceCategories.PROGRAMMATIC },
        { name: EvidenceCategories.REPORT },
    ]);

    return { workerMakerUser, workerReceiverUser };
}

async function insertE2EGetDeliveryReceptionByIdTestData() {
    const {
        workerMakerUser,
        workerReceiverUser,
        zoneManagerAndWitnessUser1,
        deliveryReception,
    } = await insertE2EGetAllDeliveriesReceptionsMadeTestData();

    return {
        workerMakerUser,
        workerReceiverUser,
        zoneManagerAndWitnessUser1,
        deliveryReception,
    };
}

async function insertE2EUpdateDeliveryReceptionTestData() {
    const { workerMakerUser, workerReceiverUser, deliveryReception } =
        await insertE2EDeleteDeliveryReceptionTestData();
    return {
        workerMakerUser,
        workerReceiverUser,
        deliveryReception,
    };
}

async function insertE2EAcceptDeliveryReceptionTestData() {
    const {
        workerReceiverUser,
        zoneManagerAndWitnessUser1,
        deliveryReception,
    } = await insertE2EDeleteDeliveryReceptionTestData();
    return {
        workerReceiverUser,
        zoneManagerAndWitnessUser1,
        deliveryReception,
    };
}

async function insertE2ECreateCommentForDeliveryReceptionTestData() {
    const { zoneManagerAndWitnessUser1, deliveryReception } =
        await insertE2EDeleteDeliveryReceptionTestData();
    return {
        zoneManagerAndWitnessUser1,
        deliveryReception,
    };
}

async function insertE2EGetAllCommentsByDeliveryReceptionIdAndCategoryTestData() {
    const {
        workerMakerUser,
        zoneManagerAndWitnessUser1,
        categories,
        deliveryReception,
    } = await insertE2EDeleteDeliveryReceptionTestData();

    for (const category of categories) {
        await db.Comment.create({
            text: `Comment for ${category.name}`,
            categoryId: category.id,
            deliveryReceptionId: deliveryReception.id,
            userId: zoneManagerAndWitnessUser1.id,
        });
    }

    return {
        workerMakerUser,
        deliveryReception,
    };
}

export {
    insertE2EGetAllDeliveriesReceptionsMadeTestData,
    insertE2EDeleteDeliveryReceptionTestData,
    insertE2EGetAllDeliveriesReceptionsReceivedTestData,
    insertE2EGetAllDeliveriesReceptionsPendingTestData,
    insertE2EGetAllDeliveriesReceptionsInProcessTestData,
    insertE2EGetAllDeliveriesReceptionsReleasedTestData,
    insertE2ECreateDeliveryReceptionTestData,
    insertE2EGetDeliveryReceptionByIdTestData,
    insertE2EUpdateDeliveryReceptionTestData,
    insertE2EAcceptDeliveryReceptionTestData,
    insertE2ECreateCommentForDeliveryReceptionTestData,
    insertE2EGetAllCommentsByDeliveryReceptionIdAndCategoryTestData,
};

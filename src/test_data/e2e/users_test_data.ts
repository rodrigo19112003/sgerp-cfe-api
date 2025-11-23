import db from "../../models";
import UserRoles from "../../types/enums/user_roles";

async function insertE2EGetAllUsersTestData() {
    const adminUser = await db.User.create({
        employeeNumber: "111AA",
        fullName: "Rodrigo Hernandez",
        email: "rodrigo.hernandez@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const users = await db.User.bulkCreate([
        {
            employeeNumber: "100AA",
            fullName: "Alice Smith",
            email: "alice.smith@cfe.mx",
            passwordHash:
                "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
        },
        {
            employeeNumber: "101BB",
            fullName: "Bob Johnson",
            email: "bob.johnson@cfe.mx",
            passwordHash:
                "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
        },
        {
            employeeNumber: "102CC",
            fullName: "Charlie Davis",
            email: "charlie.davis@cfe.mx",
            passwordHash:
                "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
        },
    ]);

    const roles = await db.Role.bulkCreate([
        { name: UserRoles.ADMINISTRATOR },
        { name: UserRoles.WORKER },
    ]);

    await db.UserRole.create({
        userId: adminUser.id,
        roleId: roles.find((role) => role.name === UserRoles.ADMINISTRATOR)!.id,
    });

    for (const user of users) {
        await db.UserRole.create({
            userId: user.id,
            roleId: roles.find((role) => role.name === UserRoles.WORKER)!.id,
        });
    }

    return adminUser;
}

async function insertE2EDeleteUserTestData() {
    const adminUser = await db.User.create({
        employeeNumber: "111AA",
        fullName: "Rodrigo Hernandez",
        email: "rodrigo.hernandez@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const workerUser = await db.User.create({
        employeeNumber: "100AA",
        fullName: "Alice Smith",
        email: "alice.smith@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const adminRole = await db.Role.create({
        name: UserRoles.ADMINISTRATOR,
    });

    const workerRole = await db.Role.create({
        name: UserRoles.WORKER,
    });

    await db.UserRole.bulkCreate([
        {
            userId: workerUser.id,
            roleId: workerRole.id,
        },
        {
            userId: adminUser.id,
            roleId: adminRole.id,
        },
    ]);

    const userToDelete = await db.User.create({
        employeeNumber: "200DD",
        fullName: "David Evans",
        email: "david.evans@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    await db.UserRole.create({
        userId: userToDelete.id,
        roleId: workerRole.id,
    });

    return { adminUser, userToDelete };
}

async function insertE2ECreateUserTestData() {
    const adminUser = await db.User.create({
        employeeNumber: "111AA",
        fullName: "Rodrigo Hernandez",
        email: "rodrigo.hernandez@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const workerUser = await db.User.create({
        employeeNumber: "100AA",
        fullName: "Alice Smith",
        email: "alice.smith@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const adminRole = await db.Role.create({
        name: UserRoles.ADMINISTRATOR,
    });

    const workerRole = await db.Role.create({
        name: UserRoles.WORKER,
    });

    await db.UserRole.bulkCreate([
        {
            userId: workerUser.id,
            roleId: workerRole.id,
        },
        {
            userId: adminUser.id,
            roleId: adminRole.id,
        },
    ]);

    return { adminUser, workerUser };
}

async function insertE2EGetUserByEmployeeNumberTestData() {
    const adminUser = await db.User.create({
        employeeNumber: "111AA",
        fullName: "Rodrigo Hernandez",
        email: "rodrigo.hernandez@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });
    const workerUser = await db.User.create({
        employeeNumber: "100AA",
        fullName: "Alice Smith",
        email: "alice.smith@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });
    const adminRole = await db.Role.create({
        name: UserRoles.ADMINISTRATOR,
    });
    const workerRole = await db.Role.create({
        name: UserRoles.WORKER,
    });
    await db.UserRole.bulkCreate([
        {
            userId: workerUser.id,
            roleId: workerRole.id,
        },
        {
            userId: adminUser.id,
            roleId: adminRole.id,
        },
    ]);

    const anotherWorkerUser = await db.User.create({
        employeeNumber: "200BB",
        fullName: "Bob Johnson",
        email: "bob.johnson@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });
    await db.UserRole.create({
        userId: anotherWorkerUser.id,
        roleId: workerRole.id,
    });

    return { adminUser, workerUser };
}

async function insertE2EUpdateUserTestData() {
    const adminUser = await db.User.create({
        employeeNumber: "111AA",
        fullName: "Rodrigo Hernandez",
        email: "rodrigo.hernandez@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });
    const workerUser = await db.User.create({
        employeeNumber: "100AA",
        fullName: "Alice Smith",
        email: "alice.smith@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });
    const adminRole = await db.Role.create({
        name: UserRoles.ADMINISTRATOR,
    });
    const workerRole = await db.Role.create({
        name: UserRoles.WORKER,
    });
    await db.UserRole.bulkCreate([
        {
            userId: workerUser.id,
            roleId: workerRole.id,
        },
        {
            userId: adminUser.id,
            roleId: adminRole.id,
        },
    ]);
    const anotherWorkerUser = await db.User.create({
        employeeNumber: "200BB",
        fullName: "Bob Johnson",
        email: "bob.johnson@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });
    await db.UserRole.create({
        userId: anotherWorkerUser.id,
        roleId: workerRole.id,
    });
    return { adminUser, workerUser, anotherWorkerUser };
}

export {
    insertE2EGetAllUsersTestData,
    insertE2EDeleteUserTestData,
    insertE2ECreateUserTestData,
    insertE2EGetUserByEmployeeNumberTestData,
    insertE2EUpdateUserTestData,
};

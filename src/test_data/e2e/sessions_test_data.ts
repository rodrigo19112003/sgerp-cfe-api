import db from "../../models";
import UserRoles from "../../types/enums/user_roles";

async function insertE2ELogingTestData() {
    const user = await db.User.create({
        employeeNumber: "111AA",
        fullName: "Robert Brown",
        email: "robert.brown@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const roles = await db.Role.create({ name: UserRoles.ZONE_MANAGER });

    await db.UserRole.create({
        userId: user.id,
        roleId: roles.id,
    });
}

async function insertE2EGetUserProfileTestData() {
    const user = await db.User.create({
        employeeNumber: "111AA",
        fullName: "Robert Brown",
        email: "robert.brown@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const roles = await db.Role.create({ name: UserRoles.ZONE_MANAGER });

    await db.UserRole.create({
        userId: user.id,
        roleId: roles.id,
    });
}

export { insertE2ELogingTestData, insertE2EGetUserProfileTestData };

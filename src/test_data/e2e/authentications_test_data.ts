import { hashString } from "../../lib/security_service";
import { generateValidationCode } from "../../lib/utils";
import db from "../../models";
import { getValidationCodeByEmail } from "../../services/users_service";
import UserRoles from "../../types/enums/user_roles";

async function insertE2ESendCodeByEmailTestData() {
    const workerUser = await db.User.create({
        employeeNumber: "100AA",
        fullName: "Alice Smith",
        email: "alice.smith@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const workerRole = await db.Role.create({
        name: UserRoles.WORKER,
    });

    await db.UserRole.create({
        userId: workerUser.id,
        roleId: workerRole.id,
    });

    return workerUser;
}

async function insertE2EVerifyCodeTestData() {
    const workerUser = await db.User.create({
        employeeNumber: "101BB",
        fullName: "Bob Johnson",
        email: "bob.johnson@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const workerRole = await db.Role.create({
        name: UserRoles.WORKER,
    });

    await db.UserRole.create({
        userId: workerUser.id,
        roleId: workerRole.id,
    });

    const validationCode = generateValidationCode();

    const validationCodeHash = hashString(validationCode);

    await db.EmailValidationCode.create({
        userId: workerUser.id,
        code: validationCodeHash,
    });

    return { workerUser, validationCode };
}

async function insertE2EUpdatePasswordTestData() {
    const workerUser = await db.User.create({
        employeeNumber: "102CC",
        fullName: "Charlie Davis",
        email: "charlie.davis@cfe.mx",
        passwordHash:
            "$2a$10$cRdGg2dEuOy5muW6UxgbNeXxISm7V77wsWBXpNNozVHPtT5UFJ0Eq",
    });

    const workerRole = await db.Role.create({
        name: UserRoles.WORKER,
    });
    await db.UserRole.create({
        userId: workerUser.id,
        roleId: workerRole.id,
    });

    const validationCode = generateValidationCode();

    const validationCodeHash = hashString(validationCode);

    await db.EmailValidationCode.create({
        userId: workerUser.id,
        code: validationCodeHash,
    });

    return { workerUser, validationCode };
}

export {
    insertE2ESendCodeByEmailTestData,
    insertE2EVerifyCodeTestData,
    insertE2EUpdatePasswordTestData,
};

import request from "supertest";
import createApp from "../../../lib/app";
import { Express, response } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2ECreateUserTestData } from "../../../test_data/e2e/users_test_data";
import UserRoles from "../../../types/enums/user_roles";
import User from "../../../models/User";
import { Sequelize } from "sequelize";

describe("POST /api/users", () => {
    let app: Express;
    let adminToken: string;
    let worker: User;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
        const { adminUser, workerUser } = await insertE2ECreateUserTestData();

        const loginResponse = await request(app).post("/api/sessions").send({
            employeeNumber: adminUser.employeeNumber,
            password: "rodrigo10",
        });
        const adminUserBody = loginResponse.body;
        adminToken = adminUserBody.token;
        worker = workerUser;
    });

    it("Should create a new user successfully for an administrator", async () => {
        const newUserData = {
            employeeNumber: "300EE",
            fullName: "David Wilson",
            email: "david.wilson@cfe.mx",
            userRoles: [UserRoles.WORKER],
        };

        const response = await request(app)
            .post("/api/users")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(newUserData);
        expect(response.status).toBe(HttpStatusCodes.CREATED);
    });

    it("Should fail to create a new user with an existing employee number", async () => {
        const newUserData = {
            employeeNumber: worker.employeeNumber,
            fullName: "Another User",
            email: "another.user@cfe.mx",
            userRoles: [UserRoles.WORKER],
        };
        const response = await request(app)
            .post("/api/users")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(newUserData);
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("Should fail to create a new user with an existing email", async () => {
        const newUserData = {
            employeeNumber: "400FF",
            fullName: "Another User",
            email: worker.email,
            userRoles: [UserRoles.WORKER],
        };
        const response = await request(app)
            .post("/api/users")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(newUserData);
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("Should fail to create a new user for a non-administrator", async () => {
        const loginResponse = await request(app).post("/api/sessions").send({
            employeeNumber: worker.employeeNumber,
            password: "rodrigo10",
        });
        const workerUserBody = loginResponse.body;
        const workerToken = workerUserBody.token;
        const newUserData = {
            employeeNumber: "400FF",
            fullName: "Eve Adams",
            email: "eve.adams@cfe.mx",
            userRoles: [UserRoles.WORKER],
        };
        const response = await request(app)
            .post("/api/users")
            .set("Authorization", `Bearer ${workerToken}`)
            .send(newUserData);
        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should return an error for server error", async () => {
        await db.sequelize.close();
        const newUserData = {
            employeeNumber: "500GG",
            fullName: "Frank Miller",
            email: "frank.miller@cfe.mx",
            userRoles: [UserRoles.WORKER],
        };
        const response = await request(app)
            .post("/api/users")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(newUserData);
        expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });

    afterAll(async () => {
        db.sequelize = new Sequelize("database", "username", "password", {
            host: "localhost",
            port: 3306,
            dialect: "mysql",
        });
        await db.sequelize.close();
    });
});

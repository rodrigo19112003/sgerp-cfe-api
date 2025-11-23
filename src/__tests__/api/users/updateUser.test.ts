import request from "supertest";
import createApp from "../../../lib/app";
import { Express, response } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2EUpdateUserTestData } from "../../../test_data/e2e/users_test_data";
import UserRoles from "../../../types/enums/user_roles";
import User from "../../../models/User";
import { Sequelize } from "sequelize";

describe("PUT /api/users/:userId", () => {
    let app: Express;
    let adminToken: string;
    let worker: User;
    let anotherWorker: User;
    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
        const { adminUser, workerUser, anotherWorkerUser } =
            await insertE2EUpdateUserTestData();
        const loginResponse = await request(app).post("/api/sessions").send({
            employeeNumber: adminUser.employeeNumber,
            password: "rodrigo10",
        });
        const adminUserBody = loginResponse.body;
        adminToken = adminUserBody.token;
        worker = workerUser;
        anotherWorker = anotherWorkerUser;
    });

    it("Should update a user's information successfully for an administrator", async () => {
        const updatedUserData = {
            employeeNumber: "100AA",
            fullName: "Updated Worker Name",
            email: "updated.worker@cfe.mx",
            userRoles: [UserRoles.WORKER],
        };

        const response = await request(app)
            .put(`/api/users/${worker.id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(updatedUserData);
        expect(response.status).toBe(HttpStatusCodes.OK);
    });

    it("Should fail to update a user with an existing employee number", async () => {
        const updatedUserData = {
            employeeNumber: anotherWorker.employeeNumber,
            fullName: "Another Name",
            email: "another.name@cfe.mx",
            userRoles: [UserRoles.WORKER],
        };
        const response = await request(app)
            .put(`/api/users/${worker.id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(updatedUserData);
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("Should fail to update a user with an existing email", async () => {
        const updatedUserData = {
            employeeNumber: "200BB",
            fullName: "Another Name",
            email: anotherWorker.email,
            userRoles: [UserRoles.WORKER],
        };
        const response = await request(app)
            .put(`/api/users/${worker.id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(updatedUserData);
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("Should fail to update a user for a non-administrator", async () => {
        const loginResponse = await request(app).post("/api/sessions").send({
            employeeNumber: worker.employeeNumber,
            password: "rodrigo10",
        });
        const workerUserBody = loginResponse.body;
        const workerToken = workerUserBody.token;
        const updatedUserData = {
            employeeNumber: "100AA",
            fullName: "Updated Worker Name",
            email: "updated.worker@cfe.mx",
            userRoles: [UserRoles.WORKER],
        };
        const response = await request(app)
            .put(`/api/users/${anotherWorker.id}`)
            .set("Authorization", `Bearer ${workerToken}`)
            .send(updatedUserData);
        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should fail to update a user with an invalid token", async () => {
        const updatedUserData = {
            employeeNumber: "100AA",
            fullName: "Updated Worker Name",
            email: "updated.worker@cfe.mx",
            userRoles: [UserRoles.WORKER],
        };
        const response = await request(app)
            .put(`/api/users/${worker.id}`)
            .set("Authorization", `Bearer invalidtoken`)
            .send(updatedUserData);
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should fail to update a user without a token", async () => {
        const updatedUserData = {
            employeeNumber: "100AA",
            fullName: "Updated Worker Name",
            email: "updated.worker@cfe.mx",
            userRoles: [UserRoles.WORKER],
        };
        const response = await request(app)
            .put(`/api/users/${worker.id}`)
            .send(updatedUserData);
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should fail to update a non-existing user", async () => {
        const updatedUserData = {
            employeeNumber: "999ZZ",
            fullName: "Non Existing User",
            email: "non.existing@cfe.mx",
            userRoles: [UserRoles.WORKER],
        };
        const response = await request(app)
            .put(`/api/users/9999`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(updatedUserData);
        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("Should return an error for server error", async () => {
        await db.sequelize.close();
        const updatedUserData = {
            employeeNumber: "100AA",
            fullName: "Updated Worker Name",
            email: "updated.worker@cfe.mx",
            userRoles: [UserRoles.WORKER],
        };
        const response = await request(app)
            .put(`/api/users/${worker.id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(updatedUserData);
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

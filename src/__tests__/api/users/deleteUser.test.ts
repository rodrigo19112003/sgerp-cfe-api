import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { Sequelize } from "sequelize";
import { insertE2EDeleteUserTestData } from "../../../test_data/e2e/users_test_data";

describe("DELETE /api/users/:userId", () => {
    let app: Express;
    let adminToken: string;
    let userIdToDelete: number;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
        const { adminUser, userToDelete } = await insertE2EDeleteUserTestData();
        userIdToDelete = userToDelete.id;

        const loginResponse = await request(app).post("/api/sessions").send({
            employeeNumber: adminUser.employeeNumber,
            password: "rodrigo10",
        });
        const adminUserBody = loginResponse.body;
        adminToken = adminUserBody.token;
    });

    it("Should delete a user successfully for an administrator", async () => {
        const response = await request(app)
            .delete(`/api/users/${userIdToDelete}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("Should return an error for deleting a non-existent user", async () => {
        const response = await request(app)
            .delete(`/api/users/100`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("Should return an error for missing token", async () => {
        const response = await request(app).delete(
            `/api/users/${userIdToDelete}`
        );
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });
    it("Should return an error for invalid token", async () => {
        const response = await request(app)
            .delete(`/api/users/${userIdToDelete}`)
            .set("Authorization", `Bearer invalidtoken`);
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return an error for non-administrator user", async () => {
        const loginResponse = await request(app).post("/api/sessions").send({
            employeeNumber: "100AA",
            password: "rodrigo10",
        });
        const normalUser = loginResponse.body;
        const normalUserToken = normalUser.token;
        const response = await request(app)
            .delete(`/api/users/${userIdToDelete}`)
            .set("Authorization", `Bearer ${normalUserToken}`);
        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should return an error for server error", async () => {
        await db.sequelize.close();
        const response = await request(app)
            .delete(`/api/users/${userIdToDelete}`)
            .set("Authorization", `Bearer ${adminToken}`);
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

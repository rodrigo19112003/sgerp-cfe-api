import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { Sequelize } from "sequelize";
import { insertE2EGetUserByEmployeeNumberTestData } from "../../../test_data/e2e/users_test_data";

describe("GET /api/users/:employeeNumber", () => {
    let app: Express;
    let adminToken: string;
    let workerEmployeeNumber: string;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
        const { adminUser, workerUser } =
            await insertE2EGetUserByEmployeeNumberTestData();
        workerEmployeeNumber = workerUser.employeeNumber;

        const loginResponse = await request(app).post("/api/sessions").send({
            employeeNumber: adminUser.employeeNumber,
            password: "rodrigo10",
        });
        const adminUserBody = loginResponse.body;
        adminToken = adminUserBody.token;
    });

    it("Should return user details for a valid employee number", async () => {
        const response = await request(app)
            .get(`/api/users/${workerEmployeeNumber}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(response.body).toHaveProperty(
            "employeeNumber",
            workerEmployeeNumber
        );
    });

    it("Should return an error for non-existing employee number", async () => {
        const response = await request(app)
            .get(`/api/users/999ZZ`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("Should return an error for missing token", async () => {
        const response = await request(app).get(
            `/api/users/${workerEmployeeNumber}`
        );
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return an error for invalid token", async () => {
        const response = await request(app)
            .get(`/api/users/${workerEmployeeNumber}`)
            .set("Authorization", `Bearer invalidtoken`);
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return an error for non-administrator user", async () => {
        const loginResponse = await request(app).post("/api/sessions").send({
            employeeNumber: workerEmployeeNumber,
            password: "rodrigo10",
        });
        const workerUser = loginResponse.body;
        const workerUserToken = workerUser.token;
        const response = await request(app)
            .get(`/api/users/${workerEmployeeNumber}`)
            .set("Authorization", `Bearer ${workerUserToken}`);
        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    });

    it("Should return an error for server error", async () => {
        await db.sequelize.close();
        const response = await request(app)
            .get(`/api/users/${workerEmployeeNumber}`)
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

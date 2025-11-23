import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { Sequelize } from "sequelize";
import { insertE2EGetAllUsersTestData } from "../../../test_data/e2e/users_test_data";

describe("GET /api/users", () => {
    let app: Express;
    let adminToken: string;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
        const adminUser = await insertE2EGetAllUsersTestData();

        const loginResponse = await request(app).post("/api/sessions").send({
            employeeNumber: adminUser.employeeNumber,
            password: "rodrigo10",
        });
        const adminUserBody = loginResponse.body;
        adminToken = adminUserBody.token;
    });

    it("Should return all users for an administrator", async () => {
        const response = await request(app)
            .get("/api/users")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("Should return an error for missing token", async () => {
        const response = await request(app).get("/api/users");
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return an error for invalid token", async () => {
        const response = await request(app)
            .get("/api/users")
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
            .get("/api/users")
            .set("Authorization", `Bearer ${normalUserToken}`);
        expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
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

import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { Sequelize } from "sequelize";
import { insertE2EGetAllDeliveriesReceptionsReceivedTestData } from "../../../test_data/e2e/deliveries_receptions_test_data";

describe("GET /api/deliveries-receptions/received", () => {
    let app: Express;
    let workerToken: string;
    let deliveryReceptionId: number;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
        const { workerReceiverUser, deliveryReception } =
            await insertE2EGetAllDeliveriesReceptionsReceivedTestData();
        deliveryReceptionId = deliveryReception.id;
        const loginResponse = await request(app).post("/api/sessions").send({
            employeeNumber: workerReceiverUser.employeeNumber,
            password: "rodrigo10",
        });
        const workerUserBody = loginResponse.body;
        workerToken = workerUserBody.token;
    });

    it("Should return all received deliveries receptions for a worker", async () => {
        const response = await request(app)
            .get("/api/deliveries-receptions/received")
            .set("Authorization", `Bearer ${workerToken}`);
        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("Should return an error for missing token", async () => {
        const response = await request(app).get(
            "/api/deliveries-receptions/received"
        );
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return an error for invalid token", async () => {
        const response = await request(app)
            .get("/api/deliveries-receptions/received")
            .set("Authorization", `Bearer invalidtoken`);
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return an error for server error", async () => {
        await db.sequelize.close();
        const response = await request(app)
            .get("/api/deliveries-receptions/received")
            .set("Authorization", `Bearer ${workerToken}`);
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

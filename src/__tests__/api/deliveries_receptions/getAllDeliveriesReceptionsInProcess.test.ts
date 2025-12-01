import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { Sequelize } from "sequelize";
import { insertE2EGetAllDeliveriesReceptionsInProcessTestData } from "../../../test_data/e2e/deliveries_receptions_test_data";

describe("GET /api/deliveries-receptions/in-process", () => {
    let app: Express;
    let zoneManagerToken: string;
    let deliveryReceptionId: number;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
        const { zoneManagerAndWitnessUser1, deliveryReception } =
            await insertE2EGetAllDeliveriesReceptionsInProcessTestData();
        deliveryReceptionId = deliveryReception.id;
        const loginResponse = await request(app).post("/api/sessions").send({
            employeeNumber: zoneManagerAndWitnessUser1.employeeNumber,
            password: "rodrigo10",
        });
        const zoneManagerUserBody = loginResponse.body;
        zoneManagerToken = zoneManagerUserBody.token;
    });

    it("Should return all in-process deliveries receptions for a zone manager", async () => {
        const response = await request(app)
            .get("/api/deliveries-receptions/in-process")
            .set("Authorization", `Bearer ${zoneManagerToken}`);
        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("Should return an error for missing token", async () => {
        const response = await request(app).get(
            "/api/deliveries-receptions/in-process"
        );
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return an error for invalid token", async () => {
        const response = await request(app)
            .get("/api/deliveries-receptions/in-process")
            .set("Authorization", `Bearer invalidtoken`);
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return an error for server error", async () => {
        await db.sequelize.close();
        const response = await request(app)
            .get("/api/deliveries-receptions/in-process")
            .set("Authorization", `Bearer ${zoneManagerToken}`);
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

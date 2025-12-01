import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { Sequelize } from "sequelize";
import { insertE2EGetDeliveryReceptionByIdTestData } from "../../../test_data/e2e/deliveries_receptions_test_data";

describe("GET /api/deliveries-receptions/:deliveryReceptionId", () => {
    let app: Express;
    let workerToken: string;
    let zoneManagerAndWitnessUser1Token: string;
    let deliveryReceptionId: number;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
        const {
            workerMakerUser,
            deliveryReception,
            zoneManagerAndWitnessUser1,
        } = await insertE2EGetDeliveryReceptionByIdTestData();
        deliveryReceptionId = deliveryReception.id;
        const loginResponseWorker = await request(app)
            .post("/api/sessions")
            .send({
                employeeNumber: workerMakerUser.employeeNumber,
                password: "rodrigo10",
            });
        const workerUserBody = loginResponseWorker.body;
        workerToken = workerUserBody.token;

        const loginResponseZoneManager = await request(app)
            .post("/api/sessions")
            .send({
                employeeNumber: zoneManagerAndWitnessUser1.employeeNumber,
                password: "rodrigo10",
            });
        const zoneManagerUserBody = loginResponseZoneManager.body;
        zoneManagerAndWitnessUser1Token = zoneManagerUserBody.token;
    });

    it("Should get delivery reception by id successfully for the worker who made it", async () => {
        const response = await request(app)
            .get(`/api/deliveries-receptions/${deliveryReceptionId}`)
            .set("Authorization", `Bearer ${workerToken}`);
        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(response.body.id).toBe(deliveryReceptionId);
    });

    it("Should get delivery reception by id successfully for the zone manager and witness", async () => {
        const response = await request(app)
            .get(`/api/deliveries-receptions/${deliveryReceptionId}`)
            .set("Authorization", `Bearer ${zoneManagerAndWitnessUser1Token}`);
        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(response.body.id).toBe(deliveryReceptionId);
    });

    it("Should return an error for non-existing delivery reception id to worker", async () => {
        const response = await request(app)
            .get(`/api/deliveries-receptions/9999`)
            .set("Authorization", `Bearer ${workerToken}`);
        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("Should return an error for non-existing delivery reception id to zone manager and witness", async () => {
        const response = await request(app)
            .get(`/api/deliveries-receptions/9999`)
            .set("Authorization", `Bearer ${zoneManagerAndWitnessUser1Token}`);
        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("Should return an error for missing token", async () => {
        const response = await request(app).get(
            `/api/deliveries-receptions/${deliveryReceptionId}`
        );
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return an error for invalid token", async () => {
        const response = await request(app)
            .get(`/api/deliveries-receptions/${deliveryReceptionId}`)
            .set("Authorization", `Bearer invalidtoken`);
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return an error for server error", async () => {
        await db.sequelize.close();
        const response = await request(app)
            .get(`/api/deliveries-receptions/${deliveryReceptionId}`)
            .set("Authorization", `Bearer ${workerToken}`);
        expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });

    it("Should return an error for server error", async () => {
        await db.sequelize.close();
        const response = await request(app)
            .get(`/api/deliveries-receptions/${deliveryReceptionId}`)
            .set("Authorization", `Bearer ${zoneManagerAndWitnessUser1Token}`);
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

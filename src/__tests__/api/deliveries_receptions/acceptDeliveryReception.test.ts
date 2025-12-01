import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { Sequelize } from "sequelize";
import { insertE2EAcceptDeliveryReceptionTestData } from "../../../test_data/e2e/deliveries_receptions_test_data";

describe("PATCH /api/deliveries-receptions/:deliveryReceptionId/accept", () => {
    let app: Express;
    let workerToken: string;
    let zoneManagerToken: string;
    let deliveryReceptionId: number;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
        const {
            deliveryReception,
            workerReceiverUser,
            zoneManagerAndWitnessUser1,
        } = await insertE2EAcceptDeliveryReceptionTestData();
        deliveryReceptionId = deliveryReception.id;
        const workerLoginResponse = await request(app)
            .post("/api/sessions")
            .send({
                employeeNumber: workerReceiverUser.employeeNumber,
                password: "rodrigo10",
            });
        const workerUserBody = workerLoginResponse.body;
        workerToken = workerUserBody.token;
        const zoneManagerLoginResponse = await request(app)
            .post("/api/sessions")
            .send({
                employeeNumber: zoneManagerAndWitnessUser1.employeeNumber,
                password: "rodrigo10",
            });
        const zoneManagerUserBody = zoneManagerLoginResponse.body;
        zoneManagerToken = zoneManagerUserBody.token;
    });

    it("Should accept a delivery reception successfully for a zone manager", async () => {
        const response = await request(app)
            .patch(`/api/deliveries-receptions/${deliveryReceptionId}/accept`)
            .set("Authorization", `Bearer ${zoneManagerToken}`)
            .send();
        expect(response.status).toBe(HttpStatusCodes.OK);
    });

    it("Should fail to accept a delivery reception for a worker", async () => {
        const response = await request(app)
            .patch(`/api/deliveries-receptions/${deliveryReceptionId}/accept`)
            .set("Authorization", `Bearer ${workerToken}`)
            .send();
        expect(response.status).toBe(HttpStatusCodes.OK);
    });

    it("Should fail to accept a non-existent delivery reception for a zone manager", async () => {
        const nonExistentId = 9999;
        const response = await request(app)
            .patch(`/api/deliveries-receptions/${nonExistentId}/accept`)
            .set("Authorization", `Bearer ${zoneManagerToken}`)
            .send();
        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("Should fail to accept a non-existent delivery reception for a worker", async () => {
        const nonExistentId = 9999;
        const response = await request(app)
            .patch(`/api/deliveries-receptions/${nonExistentId}/accept`)
            .set("Authorization", `Bearer ${workerToken}`)
            .send();
        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("Should fail to accept a delivery reception with an invalid token", async () => {
        const response = await request(app)
            .patch(`/api/deliveries-receptions/${deliveryReceptionId}/accept`)
            .set("Authorization", `Bearer invalidtoken`)
            .send();
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should fail to accept a delivery reception without a token", async () => {
        const response = await request(app)
            .patch(`/api/deliveries-receptions/${deliveryReceptionId}/accept`)
            .send();
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return an error for server error", async () => {
        await db.sequelize.close();
        const response = await request(app)
            .patch(`/api/deliveries-receptions/${deliveryReceptionId}/accept`)
            .set("Authorization", `Bearer ${zoneManagerToken}`)
            .send();
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

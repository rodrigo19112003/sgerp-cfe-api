import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { Sequelize } from "sequelize";
import { insertE2EDeleteDeliveryReceptionTestData } from "../../../test_data/e2e/deliveries_receptions_test_data";

describe("DELETE /api/deliveries-receptions/:deliveryReceptionId", () => {
    let app: Express;
    let workerToken: string;
    let deliveryReceptionIdToDelete: number;
    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
        const { workerMakerUser, deliveryReception } =
            await insertE2EDeleteDeliveryReceptionTestData();
        deliveryReceptionIdToDelete = deliveryReception.id;
        const loginResponse = await request(app).post("/api/sessions").send({
            employeeNumber: workerMakerUser.employeeNumber,
            password: "rodrigo10",
        });
        const workerUserBody = loginResponse.body;
        workerToken = workerUserBody.token;
    });

    it("Should delete a delivery reception successfully for a worker", async () => {
        const response = await request(app)
            .delete(`/api/deliveries-receptions/${deliveryReceptionIdToDelete}`)
            .set("Authorization", `Bearer ${workerToken}`);
        expect(response.status).toBe(HttpStatusCodes.NO_CONTENT);
    });

    it("Should return error when trying to delete a non-existent delivery reception", async () => {
        const response = await request(app)
            .delete(`/api/deliveries-receptions/9999`)
            .set("Authorization", `Bearer ${workerToken}`);
        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("Should return error for missing token", async () => {
        const response = await request(app).delete(
            `/api/deliveries-receptions/${deliveryReceptionIdToDelete}`
        );
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });
    it("Should return error for invalid token", async () => {
        const response = await request(app)
            .delete(`/api/deliveries-receptions/${deliveryReceptionIdToDelete}`)
            .set("Authorization", `Bearer invalidtoken`);

        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });
    it("Should return error when there is a server error", async () => {
        await db.sequelize.close();
        const response = await request(app)
            .delete(`/api/deliveries-receptions/${deliveryReceptionIdToDelete}`)
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

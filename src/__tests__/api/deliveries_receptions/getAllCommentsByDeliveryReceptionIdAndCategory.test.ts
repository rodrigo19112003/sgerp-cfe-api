import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { Sequelize } from "sequelize";
import { insertE2EGetAllCommentsByDeliveryReceptionIdAndCategoryTestData } from "../../../test_data/e2e/deliveries_receptions_test_data";
import EvidenceCategories from "../../../types/enums/evidence_categories";

describe("GET api/deliveries-receptions/:deliveryReceptionId/comments/:category", () => {
    let app: Express;
    let workerMakerUserToken: string;
    let deliveryReceptionId: number;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
        const { workerMakerUser, deliveryReception } =
            await insertE2EGetAllCommentsByDeliveryReceptionIdAndCategoryTestData();
        const loginResponse = await request(app).post("/api/sessions").send({
            employeeNumber: workerMakerUser.employeeNumber,
            password: "rodrigo10",
        });
        workerMakerUserToken = loginResponse.body.token;
        deliveryReceptionId = deliveryReception.id;
    });

    it("Should get all comments by delivery reception ID and category successfully", async () => {
        const response = await request(app)
            .get(
                `/api/deliveries-receptions/${deliveryReceptionId}/comments?categoryName=${EvidenceCategories.DATA}`
            )
            .set("Authorization", `Bearer ${workerMakerUserToken}`)
            .send();
        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("Should return error array for non-existent delivery reception ID", async () => {
        const response = await request(app)
            .get(
                `/api/deliveries-receptions/9999/comments?categoryName=${EvidenceCategories.DATA}`
            )
            .set("Authorization", `Bearer ${workerMakerUserToken}`)
            .send();
        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("Should return error for missing category query parameter", async () => {
        const response = await request(app)
            .get(`/api/deliveries-receptions/${deliveryReceptionId}/comments`)
            .set("Authorization", `Bearer ${workerMakerUserToken}`)
            .send();
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("Should return error for missing token", async () => {
        const response = await request(app)
            .get(
                `/api/deliveries-receptions/${deliveryReceptionId}/comments?categoryName=${EvidenceCategories.DATA}`
            )
            .send();
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return error for invalid token", async () => {
        const response = await request(app)
            .get(
                `/api/deliveries-receptions/${deliveryReceptionId}/comments?categoryName=${EvidenceCategories.DATA}`
            )
            .set("Authorization", `Bearer invalidtoken`)
            .send();
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return an error for server error", async () => {
        await db.sequelize.close();
        const response = await request(app)
            .get(
                `/api/deliveries-receptions/${deliveryReceptionId}/comments?categoryName=${EvidenceCategories.DATA}`
            )
            .set("Authorization", `Bearer ${workerMakerUserToken}`)
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

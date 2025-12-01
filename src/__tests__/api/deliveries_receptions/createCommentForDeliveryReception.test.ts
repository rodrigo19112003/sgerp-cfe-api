import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { Sequelize } from "sequelize";
import { insertE2ECreateCommentForDeliveryReceptionTestData } from "../../../test_data/e2e/deliveries_receptions_test_data";
import EvidenceCategories from "../../../types/enums/evidence_categories";

describe("PATCH /deliveries-receptions/:deliveryReceptionId/comments", () => {
    let app: Express;
    let zoneManagerToken: string;
    let deliveryReceptionId: number;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
        const { zoneManagerAndWitnessUser1, deliveryReception } =
            await insertE2ECreateCommentForDeliveryReceptionTestData();
        const zoneManagerLoginResponse = await request(app)
            .post("/api/sessions")
            .send({
                employeeNumber: zoneManagerAndWitnessUser1.employeeNumber,
                password: "rodrigo10",
            });
        const zoneManagerUserBody = zoneManagerLoginResponse.body;
        zoneManagerToken = zoneManagerUserBody.token;
        deliveryReceptionId = deliveryReception.id;
    });

    it("Should create a comment for a delivery reception successfully", async () => {
        const response = await request(app)
            .post(`/api/deliveries-receptions/${deliveryReceptionId}/comments`)
            .set("Authorization", `Bearer ${zoneManagerToken}`)
            .send({
                text: "This is a test comment for the delivery reception.",
                categoryName: EvidenceCategories.DATA,
            });
        expect(response.status).toBe(HttpStatusCodes.CREATED);
    });

    it("Should return 404 if the delivery reception does not exist", async () => {
        const response = await request(app)
            .post(`/api/deliveries-receptions/9999/comments`)
            .set("Authorization", `Bearer ${zoneManagerToken}`)
            .send({
                text: "This is a test comment for the delivery reception.",
                categoryName: EvidenceCategories.DATA,
            });
        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("Should return 401 if no token is provided", async () => {
        const response = await request(app)
            .post(`/api/deliveries-receptions/${deliveryReceptionId}/comments`)
            .send({
                text: "This is a test comment for the delivery reception.",
                categoryName: EvidenceCategories.DATA,
            });
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return 401 if an invalid token is provided", async () => {
        const response = await request(app)
            .post(`/api/deliveries-receptions/${deliveryReceptionId}/comments`)
            .set("Authorization", `Bearer invalidtoken`)
            .send({
                text: "This is a test comment for the delivery reception.",
                categoryName: EvidenceCategories.DATA,
            });
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return 400 if the comment text is missing", async () => {
        const response = await request(app)
            .post(`/api/deliveries-receptions/${deliveryReceptionId}/comments`)
            .set("Authorization", `Bearer ${zoneManagerToken}`)
            .send({});
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("Should return 500 if a server error occurs", async () => {
        await db.sequelize.close();
        const response = await request(app)
            .post(`/api/deliveries-receptions/${deliveryReceptionId}/comments`)
            .set("Authorization", `Bearer ${zoneManagerToken}`)
            .send({
                text: "This is a test comment for the delivery reception.",
                categoryName: EvidenceCategories.DATA,
            });
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

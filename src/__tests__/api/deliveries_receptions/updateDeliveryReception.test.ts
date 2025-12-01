import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { Sequelize } from "sequelize";
import { insertE2EUpdateDeliveryReceptionTestData } from "../../../test_data/e2e/deliveries_receptions_test_data";
import EvidenceCategories from "../../../types/enums/evidence_categories";
import User from "../../../models/User";

describe("PUT /api/deliveries-receptions/:deliveryReceptionId", () => {
    let app: Express;
    let workerToken: string;
    let workerReceiver: User;
    let deliveryReceptionId: number;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
        const { workerMakerUser, workerReceiverUser, deliveryReception } =
            await insertE2EUpdateDeliveryReceptionTestData();
        deliveryReceptionId = deliveryReception.id;
        const loginResponseWorker = await request(app)
            .post("/api/sessions")
            .send({
                employeeNumber: workerMakerUser.employeeNumber,
                password: "rodrigo10",
            });
        const workerUserBody = loginResponseWorker.body;
        workerToken = workerUserBody.token;
        workerReceiver = workerReceiverUser;
    });

    it("Should update delivery reception successfully", async () => {
        const updatedData = {
            generalData: "General data 3",
            procedureReport: "Procedure report 3",
            otherFacts: "Other facts 3",
            financialResources: "Financial resources 3",
            humanResources: "Human resources 3",
            materialResources: "Material resources 3",
            areaBudgetStatus: "Area budget status 3",
            programmaticStatus: "Programmatic status 3",
            procedureReportFile: {
                name: "procedure.pdf",
                content: "base64-procedure",
                category: EvidenceCategories.REPORT,
            },
            financialResourcesFile: {
                name: "financial.pdf",
                content: "base64-financial",
                category: EvidenceCategories.FINANCE,
            },
            humanResourcesFile: {
                name: "human.pdf",
                content: "base64-human",
                category: EvidenceCategories.HUMAN,
            },
            materialResourcesFile: {
                name: "material.pdf",
                content: "base64-material",
                category: EvidenceCategories.MATERIAL,
            },
            areaBudgetStatusFile: {
                name: "budget.pdf",
                content: "base64-budget",
                category: EvidenceCategories.BUDGET,
            },
            programmaticStatusFile: {
                name: "programmatic.pdf",
                content: "base64-programmatic",
                category: EvidenceCategories.PROGRAMMATIC,
            },
        };

        const response = await request(app)
            .put(`/api/deliveries-receptions/${deliveryReceptionId}`)
            .set("Authorization", `Bearer ${workerToken}`)
            .send(updatedData);
        expect(response.status).toBe(HttpStatusCodes.OK);
    });

    it("Should return an error for incomplete data", async () => {
        const incompleteData = {
            generalData: "General data incomplete",
        };
        const response = await request(app)
            .put(`/api/deliveries-receptions/${deliveryReceptionId}`)
            .set("Authorization", `Bearer ${workerToken}`)
            .send(incompleteData);
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("Should return an error for non-existing delivery reception id", async () => {
        const updatedData = {
            generalData: "General data 3",
            procedureReport: "Procedure report 3",
            otherFacts: "Other facts 3",
            financialResources: "Financial resources 3",
            humanResources: "Human resources 3",
            materialResources: "Material resources 3",
            areaBudgetStatus: "Area budget status 3",
            programmaticStatus: "Programmatic status 3",
            procedureReportFile: {
                name: "procedure.pdf",
                content: "base64-procedure",
                category: EvidenceCategories.REPORT,
            },
            financialResourcesFile: {
                name: "financial.pdf",
                content: "base64-financial",
                category: EvidenceCategories.FINANCE,
            },
            humanResourcesFile: {
                name: "human.pdf",
                content: "base64-human",
                category: EvidenceCategories.HUMAN,
            },
            materialResourcesFile: {
                name: "material.pdf",
                content: "base64-material",
                category: EvidenceCategories.MATERIAL,
            },
            areaBudgetStatusFile: {
                name: "budget.pdf",
                content: "base64-budget",
                category: EvidenceCategories.BUDGET,
            },
            programmaticStatusFile: {
                name: "programmatic.pdf",
                content: "base64-programmatic",
                category: EvidenceCategories.PROGRAMMATIC,
            },
        };

        const response = await request(app)
            .put(`/api/deliveries-receptions/9999`)
            .set("Authorization", `Bearer ${workerToken}`)
            .send(updatedData);
        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("Should return an error for missing token", async () => {
        const updatedData = {
            generalData: "General data 3",
        };

        const response = await request(app)
            .put(`/api/deliveries-receptions/${deliveryReceptionId}`)
            .send(updatedData);
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return an error for invalid token", async () => {
        const updatedData = {
            generalData: "General data 3",
        };
        const response = await request(app)
            .put(`/api/deliveries-receptions/${deliveryReceptionId}`)
            .set("Authorization", `Bearer invalidtoken`)
            .send(updatedData);
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return a server error", async () => {
        await db.sequelize.close();
        const updatedData = {
            generalData: "General data 3",
            procedureReport: "Procedure report 3",
            otherFacts: "Other facts 3",
            financialResources: "Financial resources 3",
            humanResources: "Human resources 3",
            materialResources: "Material resources 3",
            areaBudgetStatus: "Area budget status 3",
            programmaticStatus: "Programmatic status 3",
            procedureReportFile: {
                name: "procedure.pdf",
                content: "base64-procedure",
                category: EvidenceCategories.REPORT,
            },
            financialResourcesFile: {
                name: "financial.pdf",
                content: "base64-financial",
                category: EvidenceCategories.FINANCE,
            },
            humanResourcesFile: {
                name: "human.pdf",
                content: "base64-human",
                category: EvidenceCategories.HUMAN,
            },
            materialResourcesFile: {
                name: "material.pdf",
                content: "base64-material",
                category: EvidenceCategories.MATERIAL,
            },
            areaBudgetStatusFile: {
                name: "budget.pdf",
                content: "base64-budget",
                category: EvidenceCategories.BUDGET,
            },
            programmaticStatusFile: {
                name: "programmatic.pdf",
                content: "base64-programmatic",
                category: EvidenceCategories.PROGRAMMATIC,
            },
        };
        const response = await request(app)
            .put(`/api/deliveries-receptions/${deliveryReceptionId}`)
            .set("Authorization", `Bearer ${workerToken}`)
            .send(updatedData);
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

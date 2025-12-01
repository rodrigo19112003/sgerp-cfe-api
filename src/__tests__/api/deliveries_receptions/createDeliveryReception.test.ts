import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { Sequelize } from "sequelize";
import { insertE2ECreateDeliveryReceptionTestData } from "../../../test_data/e2e/deliveries_receptions_test_data";
import EvidenceCategories from "../../../types/enums/evidence_categories";
import User from "../../../models/User";

describe("POST /api/deliveries-receptions", () => {
    let app: Express;
    let workerToken: string;
    let workerReceiver: User;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
        const { workerMakerUser, workerReceiverUser } =
            await insertE2ECreateDeliveryReceptionTestData();
        const loginResponse = await request(app).post("/api/sessions").send({
            employeeNumber: workerMakerUser.employeeNumber,
            password: "rodrigo10",
        });
        const workerUserBody = loginResponse.body;
        workerToken = workerUserBody.token;
        workerReceiver = workerReceiverUser;
    });

    it("Should create a delivery reception successfully for a worker", async () => {
        const newDeliveryReceptionData = {
            generalData: "General data 1",
            procedureReport: "Procedure report 1",
            otherFacts: "Other facts 1",
            financialResources: "Financial resources 1",
            humanResources: "Human resources 1",
            materialResources: "Material resources 1",
            areaBudgetStatus: "Area budget status 1",
            programmaticStatus: "Programmatic status 1",
            employeeNumberReceiver: workerReceiver.employeeNumber,
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
            .post("/api/deliveries-receptions")
            .set("Authorization", `Bearer ${workerToken}`)
            .send(newDeliveryReceptionData);
        expect(response.status).toBe(HttpStatusCodes.CREATED);
    });

    it("Should fail to create a delivery reception with missing required fields", async () => {
        const incompleteDeliveryReceptionData = {
            generalData: "General data 2",
        };
        const response = await request(app)
            .post("/api/deliveries-receptions")
            .set("Authorization", `Bearer ${workerToken}`)
            .send(incompleteDeliveryReceptionData);
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("Should fail to create a delivery reception with invalid token", async () => {
        const newDeliveryReceptionData = {
            generalData: "General data 3",
        };
        const response = await request(app)
            .post("/api/deliveries-receptions")
            .set("Authorization", `Bearer invalidtoken123`)
            .send(newDeliveryReceptionData);
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should fail to create a delivery reception when receiver does not exist", async () => {
        const newDeliveryReceptionData = {
            generalData: "General data 4",
            procedureReport: "Procedure report 4",
            otherFacts: "Other facts 4",
            financialResources: "Financial resources 4",
            humanResources: "Human resources 4",
            materialResources: "Material resources 4",
            areaBudgetStatus: "Area budget status 4",
            programmaticStatus: "Programmatic status 4",
            employeeNumberReceiver: "123AB",
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
            .post("/api/deliveries-receptions")
            .set("Authorization", `Bearer ${workerToken}`)
            .send(newDeliveryReceptionData);
        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("Should fail to create a delivery reception without a token", async () => {
        const newDeliveryReceptionData = {
            generalData: "General data 5",
        };
        const response = await request(app)
            .post("/api/deliveries-receptions")
            .send(newDeliveryReceptionData);
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return an error for server error", async () => {
        await db.sequelize.close();
        const newDeliveryReceptionData = {
            generalData: "General data 6",
            procedureReport: "Procedure report 6",
            otherFacts: "Other facts 6",
            financialResources: "Financial resources 6",
            humanResources: "Human resources 6",
            materialResources: "Material resources 6",
            areaBudgetStatus: "Area budget status 6",
            programmaticStatus: "Programmatic status 6",
            employeeNumberReceiver: workerReceiver.employeeNumber,
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
            .post("/api/deliveries-receptions")
            .set("Authorization", `Bearer ${workerToken}`)
            .send(newDeliveryReceptionData);
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

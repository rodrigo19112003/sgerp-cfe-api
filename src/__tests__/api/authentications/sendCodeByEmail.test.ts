import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2ESendCodeByEmailTestData } from "../../../test_data/e2e/authentications_test_data";
import User from "../../../models/User";
import { Sequelize } from "sequelize";

describe("POST /api/authentications/password-reset/request", () => {
    let app: Express;
    let workerUser: User;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
        workerUser = await insertE2ESendCodeByEmailTestData();
    });

    it("Should send a password reset code to a valid email", async () => {
        const requestBody = {
            email: workerUser.email,
        };
        const response = await request(app)
            .post("/api/authentications/password-reset/request")
            .send(requestBody);
        expect(response.status).toBe(HttpStatusCodes.CREATED);
    });

    it("Should fail when email does not exist", async () => {
        const requestBody = {
            email: "nonexistentemail@cfe.mx",
        };
        const response = await request(app)
            .post("/api/authentications/password-reset/request")
            .send(requestBody);
        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("Should fail when email is invalid", async () => {
        const requestBody = {
            email: "invalid-email-format",
        };
        const response = await request(app)
            .post("/api/authentications/password-reset/request")
            .send(requestBody);
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("Should return an error for server error", async () => {
        await db.sequelize.close();
        const requestBody = {
            email: workerUser.email,
        };
        const response = await request(app)
            .post("/api/authentications/password-reset/request")
            .send(requestBody);
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

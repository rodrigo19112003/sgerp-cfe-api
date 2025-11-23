import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { insertE2EUpdatePasswordTestData } from "../../../test_data/e2e/authentications_test_data";
import User from "../../../models/User";
import { Sequelize } from "sequelize";

describe("POST /api/authentications/password-reset/change", () => {
    let app: Express;
    let user: User;
    let validCode: string;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
        const { workerUser, validationCode } =
            await insertE2EUpdatePasswordTestData();
        user = workerUser;
        validCode = validationCode;
    });

    it("Should update the password with a valid code", async () => {
        const requestBody = {
            email: user.email,
            code: validCode,
            password: "Rodrigo1911?",
        };
        const response = await request(app)
            .post("/api/authentications/password-reset/change")
            .send(requestBody);
        expect(response.status).toBe(HttpStatusCodes.CREATED);
    });

    it("Should fail when code is invalid", async () => {
        const requestBody = {
            email: user.email,
            code: "FH34DD",
            password: "Rodrigo1911?",
        };
        const response = await request(app)
            .post("/api/authentications/password-reset/change")
            .send(requestBody);
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should fail when email does not exist", async () => {
        const requestBody = {
            email: "nonexistent@cfe.mx",
            code: validCode,
            password: "Rodrigo1911?",
        };
        const response = await request(app)
            .post("/api/authentications/password-reset/change")
            .send(requestBody);
        expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    });

    it("Should fail when new password does not meet criteria", async () => {
        const requestBody = {
            email: user.email,
            code: validCode,
            password: "short",
        };
        const response = await request(app)
            .post("/api/authentications/password-reset/change")
            .send(requestBody);
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("Should return an error for server error", async () => {
        await db.sequelize.close();
        const requestBody = {
            email: user.email,
            code: validCode,
            password: "Rodrigo1911?",
        };
        const response = await request(app)
            .post("/api/authentications/password-reset/change")
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

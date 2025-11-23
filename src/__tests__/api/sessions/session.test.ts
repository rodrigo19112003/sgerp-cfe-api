import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import ErrorMessages from "../../../types/enums/error_messages";
import { Sequelize } from "sequelize";
import { insertE2ELogingTestData } from "../../../test_data/e2e/sessions_test_data";

describe("/api/sessions", () => {
    let app: Express;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
        await insertE2ELogingTestData();
    });

    it("Should return an token and user data registered in the system", async () => {
        const body = {
            employeeNumber: "111AA",
            password: "rodrigo10",
        };

        const response = await request(app).post("/api/sessions").send(body);

        const user = response.body;

        expect(response.status).toBe(HttpStatusCodes.CREATED);
        expect(user.token).toEqual(expect.any(String));
        expect(user.id).toEqual(expect.any(Number));
        expect(user.fullName).toBe("Robert Brown");
        expect(user.email).toBe("robert.brown@cfe.mx");
    });

    it("Should return an error message for invalid credentials", async () => {
        const body = {
            employeeNumber: "MND00",
            password: "wrongpassword",
        };

        const response = await request(app).post("/api/sessions").send(body);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.INVALID_CREDENTIALS);
    });

    it("Should return an error message for missing email or password", async () => {
        const body = {
            employeeNumber: "",
            password: "",
        };
        const response = await request(app).post("/api/sessions").send(body);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
    });

    it("Should return an error message for server error", async () => {
        await db.sequelize.close();
        db.sequelize = new Sequelize("database", "username", "password", {
            host: "invalid-host",
            port: 9999,
            dialect: "mysql",
        });
        const body = {
            employeeNumber: "111AA",
            password: "rodrigo10",
        };
        const response = await request(app).post("/api/sessions").send(body);

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

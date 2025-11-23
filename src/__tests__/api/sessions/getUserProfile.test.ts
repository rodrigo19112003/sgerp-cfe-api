import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { Sequelize } from "sequelize";
import { insertE2EGetUserProfileTestData } from "../../../test_data/e2e/sessions_test_data";

describe("/api/sessions/profile", () => {
    let app: Express;
    let token: string;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
        await insertE2EGetUserProfileTestData();

        const userBody = {
            employeeNumber: "111AA",
            password: "rodrigo10",
        };
        const loginResponse = await request(app)
            .post("/api/sessions")
            .send(userBody);

        const user = loginResponse.body;
        token = user.token;
    });

    it("Should return the user profile for a valid token", async () => {
        const response = await request(app)
            .get("/api/sessions/profile")
            .set("Authorization", `Bearer ${token}`);
        const user = response.body;
        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(user.id).toEqual(expect.any(Number));
        expect(user.fullName).toEqual(expect.any(String));
        expect(user.email).toEqual(expect.any(String));
        expect(user.roles).toEqual(expect.any(Array));
    });

    it("Should return an error message for an invalid token", async () => {
        const response = await request(app)
            .get("/api/sessions/profile")
            .set("Authorization", `Bearer invalidtoken`);
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return an error message for missing token", async () => {
        const response = await request(app).get("/api/sessions/profile");
        expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    });

    it("Should return an error message for server error", async () => {
        await db.sequelize.close();
        db.sequelize = new Sequelize("database", "username", "password", {
            host: "invalidhost",
            port: 1234,
            dialect: "mysql",
        });

        const response = await request(app)
            .get("/api/sessions/profile")
            .set("Authorization", `Bearer ${token}`);
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

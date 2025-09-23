import express from "express";
import cors from "cors";
import handleApiErrorMiddleware from "../middlewares/error_handler";

export default function createApp() {
    const app = express();

    app.use(
        cors({
            origin: process.env.CLIENT_APPLICATION_HOST,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            optionsSuccessStatus: 200,
        })
    );

    app.use(express.json());

    app.use(handleApiErrorMiddleware);

    return app;
}

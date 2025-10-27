import express from "express";
import cors from "cors";
import sessionRouter from "../routes/sessions_router";
import authenticationRouter from "../routes/authentications_router";
import usersRouter from "../routes/users_router";
import deliveriesReceptionsRouter from "../routes/deliveries_receptions_router";
import handleApiErrorMiddleware from "../middlewares/error_handler";

export default function createApp() {
    const app = express();

    app.use(express.json({ limit: "100mb" }));
    app.use(express.urlencoded({ limit: "100mb", extended: true }));

    app.use(
        cors({
            origin: process.env.CLIENT_APPLICATION_HOST,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            optionsSuccessStatus: 200,
        })
    );

    app.use(express.json());

    app.use("/api/sessions", sessionRouter);
    app.use("/api/authentications", authenticationRouter);
    app.use("/api/users", usersRouter);
    app.use("/api/deliveries-receptions", deliveriesReceptionsRouter);

    app.use(handleApiErrorMiddleware);

    return app;
}

import { Router } from "express";
import limitPublicEndpointUse from "../middlewares/rate_limiter";
import { checkSchema } from "express-validator";
import loginSchema from "../validation_schemas/session";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { loginController } from "../controllers/sessions_controller";

const router = Router();

router.post(
    "/",
    limitPublicEndpointUse(),
    checkSchema(loginSchema),
    validateRequestSchemaMiddleware,
    loginController
);

export default router;

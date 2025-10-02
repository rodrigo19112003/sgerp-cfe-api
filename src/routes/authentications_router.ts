import { Router } from "express";
import limitPublicEndpointUse from "../middlewares/rate_limiter";
import { checkSchema } from "express-validator";
import sendCodeToChangePasswordSchema from "../validation_schemas/authentication";

import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { sendCodeByEmailController } from "../controllers/authentications_controller";

const router = Router();

router.post(
    "/",
    limitPublicEndpointUse(),
    checkSchema(sendCodeToChangePasswordSchema),
    validateRequestSchemaMiddleware,
    sendCodeByEmailController
);

export default router;

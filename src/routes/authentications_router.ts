import { Router } from "express";
import limitPublicEndpointUse from "../middlewares/rate_limiter";
import { checkSchema } from "express-validator";
import {
    sendEmailToChangePasswordSchema,
    sendCodeToChangePasswordSchema,
} from "../validation_schemas/authentication";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import {
    sendCodeByEmailController,
    verifyValidationCodeController,
} from "../controllers/authentications_controller";

const router = Router();

router.post(
    "/forgot-password",
    limitPublicEndpointUse(),
    checkSchema(sendEmailToChangePasswordSchema),
    validateRequestSchemaMiddleware,
    sendCodeByEmailController
);

router.post(
    "/verify-code",
    limitPublicEndpointUse(),
    checkSchema(sendCodeToChangePasswordSchema),
    validateRequestSchemaMiddleware,
    verifyValidationCodeController
);

export default router;

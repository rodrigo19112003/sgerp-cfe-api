import { Router } from "express";
import limitPublicEndpointUse from "../middlewares/rate_limiter";
import { checkSchema } from "express-validator";
import {
    sendEmailToChangePasswordSchema,
    sendCodeToChangePasswordSchema,
    changePasswordSchema,
} from "../validation_schemas/authentication";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import {
    sendCodeByEmailController,
    updatePasswordController,
    verifyValidationCodeController,
} from "../controllers/authentications_controller";

const router = Router();

router.post(
    "/password-reset/request",
    limitPublicEndpointUse(),
    checkSchema(sendEmailToChangePasswordSchema),
    validateRequestSchemaMiddleware,
    sendCodeByEmailController
);

router.post(
    "/password-reset/verify",
    limitPublicEndpointUse(),
    checkSchema(sendCodeToChangePasswordSchema),
    validateRequestSchemaMiddleware,
    verifyValidationCodeController
);

router.post(
    "/password-reset/change",
    limitPublicEndpointUse(),
    checkSchema(changePasswordSchema),
    validateRequestSchemaMiddleware,
    updatePasswordController
);

export default router;

import { Router } from "express";
import { allowRoles, checkTokenValidity } from "../middlewares/access_control";
import UserRoles from "../types/enums/user_roles";
import { checkSchema } from "express-validator";
import { getAllDeliveriesReceptionsValidationSchema } from "../validation_schemas/delivery_reception";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { injectDefaultGetUsersListQueryMiddleware } from "../middlewares/value_injectors";
import { getAllDeliveriesReceptionsController } from "../controllers/deliveries_receptions_controller";

const router = Router();

router.get(
    "/made",
    checkTokenValidity,
    allowRoles([UserRoles.WORKER]),
    checkSchema(getAllDeliveriesReceptionsValidationSchema),
    validateRequestSchemaMiddleware,
    injectDefaultGetUsersListQueryMiddleware,
    getAllDeliveriesReceptionsController
);

export default router;

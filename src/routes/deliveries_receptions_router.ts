import { Router } from "express";
import { allowRoles, checkTokenValidity } from "../middlewares/access_control";
import UserRoles from "../types/enums/user_roles";
import { checkSchema } from "express-validator";
import {
    deleteDeliveryReceptionValidationSchema,
    getAllDeliveriesReceptionsValidationSchema,
} from "../validation_schemas/delivery_reception";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { injectDefaultGetUsersListQueryMiddleware } from "../middlewares/value_injectors";
import {
    deleteDeliveryReceptionController,
    getAllDeliveriesReceptionsController,
} from "../controllers/deliveries_receptions_controller";

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

router.delete(
    "/:deliveryReceptionId",
    checkTokenValidity,
    allowRoles([UserRoles.WORKER]),
    checkSchema(deleteDeliveryReceptionValidationSchema),
    validateRequestSchemaMiddleware,
    deleteDeliveryReceptionController
);

export default router;

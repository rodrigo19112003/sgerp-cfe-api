import { Router } from "express";
import { allowRoles, checkTokenValidity } from "../middlewares/access_control";
import UserRoles from "../types/enums/user_roles";
import { checkSchema } from "express-validator";
import {
    createDeliveryReceptionValidationSchema,
    deleteDeliveryReceptionValidationSchema,
    getAllDeliveriesReceptionsValidationSchema,
} from "../validation_schemas/delivery_reception";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { injectDefaultGetListQueryMiddleware } from "../middlewares/value_injectors";
import {
    createDeliveryReceptionController,
    deleteDeliveryReceptionController,
    getAllDeliveriesReceptionsInProcessController,
    getAllDeliveriesReceptionsMadeController,
    getAllDeliveriesReceptionsPendingController,
    getAllDeliveriesReceptionsReceivedController,
    getAllDeliveriesReceptionsReleasedController,
} from "../controllers/deliveries_receptions_controller";

const router = Router();

router.get(
    "/made",
    checkTokenValidity,
    allowRoles([UserRoles.WORKER]),
    checkSchema(getAllDeliveriesReceptionsValidationSchema),
    validateRequestSchemaMiddleware,
    injectDefaultGetListQueryMiddleware,
    getAllDeliveriesReceptionsMadeController
);

router.delete(
    "/:deliveryReceptionId",
    checkTokenValidity,
    allowRoles([UserRoles.WORKER]),
    checkSchema(deleteDeliveryReceptionValidationSchema),
    validateRequestSchemaMiddleware,
    deleteDeliveryReceptionController
);

router.get(
    "/received",
    checkTokenValidity,
    allowRoles([UserRoles.WORKER]),
    checkSchema(getAllDeliveriesReceptionsValidationSchema),
    injectDefaultGetListQueryMiddleware,
    getAllDeliveriesReceptionsReceivedController
);

router.get(
    "/pending",
    checkTokenValidity,
    allowRoles([UserRoles.ZONE_MANAGER]),
    checkSchema(getAllDeliveriesReceptionsValidationSchema),
    injectDefaultGetListQueryMiddleware,
    getAllDeliveriesReceptionsPendingController
);

router.get(
    "/in-process",
    checkTokenValidity,
    allowRoles([UserRoles.ZONE_MANAGER]),
    checkSchema(getAllDeliveriesReceptionsValidationSchema),
    injectDefaultGetListQueryMiddleware,
    getAllDeliveriesReceptionsInProcessController
);

router.get(
    "/released",
    checkTokenValidity,
    allowRoles([UserRoles.ZONE_MANAGER]),
    checkSchema(getAllDeliveriesReceptionsValidationSchema),
    injectDefaultGetListQueryMiddleware,
    getAllDeliveriesReceptionsReleasedController
);

router.post(
    "/",
    checkTokenValidity,
    allowRoles([UserRoles.WORKER]),
    checkSchema(createDeliveryReceptionValidationSchema),
    validateRequestSchemaMiddleware,
    createDeliveryReceptionController
);

export default router;

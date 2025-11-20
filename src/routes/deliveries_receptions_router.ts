import { Router } from "express";
import { allowRoles, checkTokenValidity } from "../middlewares/access_control";
import UserRoles from "../types/enums/user_roles";
import { checkSchema } from "express-validator";
import {
    acceptDeliveryReceptionValidationSchema,
    createCommentValidationSchema,
    createDeliveryReceptionValidationSchema,
    deleteDeliveryReceptionValidationSchema,
    getAllDeliveriesReceptionsValidationSchema,
    getCommentsByDeliveryReceptionIdValidationSchema,
    getDeliveryReceptionByIdValidationSchema,
    updateDeliveryReceptionValidationSchema,
} from "../validation_schemas/delivery_reception";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { injectDefaultGetListQueryMiddleware } from "../middlewares/value_injectors";
import {
    acceptDeliveryReceptionController,
    createCommentController,
    createDeliveryReceptionController,
    deleteDeliveryReceptionController,
    getAllDeliveriesReceptionsInProcessController,
    getAllDeliveriesReceptionsMadeController,
    getAllDeliveriesReceptionsPendingController,
    getAllDeliveriesReceptionsReceivedController,
    getAllDeliveriesReceptionsReleasedController,
    getDeliveryReceptonByIdController,
    updateteDeliveryReceptionController,
    getAllCommentsByDeliveryReceptionIdAndCategoryController,
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

router.get(
    "/:deliveryReceptionId",
    checkTokenValidity,
    allowRoles([UserRoles.WORKER, UserRoles.ZONE_MANAGER]),
    checkSchema(getDeliveryReceptionByIdValidationSchema),
    validateRequestSchemaMiddleware,
    getDeliveryReceptonByIdController
);

router.put(
    "/:deliveryReceptionId",
    checkTokenValidity,
    allowRoles([UserRoles.WORKER]),
    checkSchema(updateDeliveryReceptionValidationSchema),
    validateRequestSchemaMiddleware,
    updateteDeliveryReceptionController
);

router.patch(
    "/:deliveryReceptionId/accept",
    checkTokenValidity,
    allowRoles([UserRoles.WORKER, UserRoles.WITNESS]),
    checkSchema(acceptDeliveryReceptionValidationSchema),
    validateRequestSchemaMiddleware,
    acceptDeliveryReceptionController
);

router.post(
    "/:deliveryReceptionId/comments",
    checkTokenValidity,
    allowRoles([UserRoles.ZONE_MANAGER]),
    checkSchema(createCommentValidationSchema),
    validateRequestSchemaMiddleware,
    createCommentController
);

router.get(
    "/:deliveryReceptionId/comments/:category",
    checkTokenValidity,
    allowRoles([UserRoles.WORKER]),
    checkSchema(getCommentsByDeliveryReceptionIdValidationSchema),
    validateRequestSchemaMiddleware,
    getAllCommentsByDeliveryReceptionIdAndCategoryController
);

export default router;

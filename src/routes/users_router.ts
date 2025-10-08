import { Router } from "express";
import { allowRoles, checkTokenValidity } from "../middlewares/access_control";
import UserRoles from "../types/enums/user_roles";
import { checkSchema } from "express-validator";
import {
    getAllUsersValidationSchema,
    deleteUserValidationSchema,
    createUserValidationSchema,
} from "../validation_schemas/user";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { injectDefaultGetUsersListQueryMiddleware } from "../middlewares/value_injectors";
import {
    deleteUserController,
    getAllUsersController,
} from "../controllers/users_controller";

const router = Router();

router.get(
    "/",
    checkTokenValidity,
    allowRoles([UserRoles.ADMINISTRATOR]),
    checkSchema(getAllUsersValidationSchema),
    validateRequestSchemaMiddleware,
    injectDefaultGetUsersListQueryMiddleware,
    getAllUsersController
);

router.delete(
    "/:userId",
    checkTokenValidity,
    allowRoles([UserRoles.ADMINISTRATOR]),
    checkSchema(deleteUserValidationSchema),
    validateRequestSchemaMiddleware,
    deleteUserController
);

router.post(
    "/",
    checkTokenValidity,
    allowRoles([UserRoles.ADMINISTRATOR]),
    checkSchema(createUserValidationSchema),
    validateRequestSchemaMiddleware
);

export default router;

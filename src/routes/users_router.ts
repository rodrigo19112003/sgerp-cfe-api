import { Router } from "express";
import { allowRoles, checkTokenValidity } from "../middlewares/access_control";
import UserRoles from "../types/enums/user_roles";
import { checkSchema } from "express-validator";
import {
    getAllUsersValidationSchema,
    deleteUserValidationSchema,
    createUserValidationSchema,
    getUserByEmployeeNumberValidationSchema,
    updateUserValidationSchema,
} from "../validation_schemas/user";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { injectDefaultGetListQueryMiddleware } from "../middlewares/value_injectors";
import {
    createUserController,
    deleteUserController,
    getAllUsersController,
    getUserByEmployeeNumberController,
    updateUserController,
} from "../controllers/users_controller";

const router = Router();

router.get(
    "/",
    checkTokenValidity,
    allowRoles([UserRoles.ADMINISTRATOR]),
    checkSchema(getAllUsersValidationSchema),
    validateRequestSchemaMiddleware,
    injectDefaultGetListQueryMiddleware,
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
    validateRequestSchemaMiddleware,
    createUserController
);

router.get(
    "/:employeeNumber",
    checkTokenValidity,
    allowRoles([UserRoles.ADMINISTRATOR]),
    checkSchema(getUserByEmployeeNumberValidationSchema),
    validateRequestSchemaMiddleware,
    getUserByEmployeeNumberController
);

router.put(
    "/:userId",
    checkTokenValidity,
    allowRoles([UserRoles.ADMINISTRATOR]),
    checkSchema(updateUserValidationSchema),
    validateRequestSchemaMiddleware,
    updateUserController
);

export default router;

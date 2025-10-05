import { Router } from "express";
import { allowRoles, checkTokenValidity } from "../middlewares/access_control";
import UserRoles from "../types/enums/user_roles";
import { checkSchema } from "express-validator";
import { getAllUsersValidationSchema } from "../validation_schemas/user";
import validateRequestSchemaMiddleware from "../middlewares/schema_validator";
import { injectDefaultGetUsersListQueryMiddleware } from "../middlewares/value_injectors";
import { getAllUsersController } from "../controllers/users_controller";

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

export default router;

import { InferAttributes } from "sequelize";
import User from "../../models/User";
import UserRoles from "../enums/user_roles";

interface IErrorMessageWithCode {
    details: string;
    errorCode?: string;
}

interface IUserWithRoles extends Omit<InferAttributes<User>, "passwordHash"> {
    passwordHash?: string;
    roles: UserRoles[];
    token?: string;
}

export { IErrorMessageWithCode, IUserWithRoles };

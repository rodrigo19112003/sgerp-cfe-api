import {
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
    Association,
} from "sequelize";
import User from "./User";
import Role from "./Role";
import { IDB } from "../types/interfaces/db";

export default class UserRole extends Model<
    InferAttributes<UserRole>,
    InferCreationAttributes<UserRole>
> {
    declare userId: ForeignKey<User["id"]>;
    declare roleId: ForeignKey<Role["id"]>;

    declare user?: NonAttribute<User>;
    declare role?: NonAttribute<Role>;

    declare static associations: {
        user: Association<UserRole, User>;
        role: Association<UserRole, Role>;
    };

    static associate(models: IDB) {
        UserRole.belongsTo(models.User, {
            foreignKey: "idUsuario",
            as: "user",
        });
        UserRole.belongsTo(models.Role, {
            foreignKey: "idRol",
            as: "role",
        });
    }
}

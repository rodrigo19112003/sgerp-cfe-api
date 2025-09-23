import {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyHasAssociationMixin,
    BelongsToManyHasAssociationsMixin,
    BelongsToManyRemoveAssociationMixin,
    BelongsToManyRemoveAssociationsMixin,
    BelongsToManySetAssociationsMixin,
    Association,
} from "sequelize";
import User from "./User";
import { IDB } from "../types/interfaces/db";

export default class Role extends Model<
    InferAttributes<Role>,
    InferCreationAttributes<Role>
> {
    declare id: CreationOptional<number>;
    declare name: string;

    declare users?: NonAttribute<User[]>;

    declare getUsers: BelongsToManyGetAssociationsMixin<User>;
    declare addUser: BelongsToManyAddAssociationMixin<User, number>;
    declare addUsers: BelongsToManyAddAssociationsMixin<User, number>;
    declare setUsers: BelongsToManySetAssociationsMixin<User, number>;
    declare removeUser: BelongsToManyRemoveAssociationMixin<User, number>;
    declare removeUsers: BelongsToManyRemoveAssociationsMixin<User, number>;
    declare hasUser: BelongsToManyHasAssociationMixin<User, number>;
    declare hasUsers: BelongsToManyHasAssociationsMixin<User, number>;

    declare static associations: {
        users: Association<Role, User>;
    };

    static associate(models: IDB) {
        Role.belongsToMany(models.User, {
            through: models.UserRole,
            foreignKey: "idRol",
            otherKey: "idUsuario",
            as: "users",
        });
    }
}

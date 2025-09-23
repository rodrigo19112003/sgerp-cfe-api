import {
    Association,
    CreationOptional,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    HasManySetAssociationsMixin,
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
} from "sequelize";
import { IDB } from "../types/interfaces/db";
import Role from "./Role";
import DeliveryReception from "./DeliveryReception";
import Comment from "./Comment";
import DeliveryReceptionReceived from "./DeliveryReceptionReceived";

export default class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare id: CreationOptional<number>;
    declare employeeNumber: string;
    declare fullName: string;
    declare email: string;
    declare passwordHash: string;

    declare roles?: NonAttribute<Role[]>;
    declare deliveryReceptions?: NonAttribute<DeliveryReception[]>;
    declare comments?: NonAttribute<Comment[]>;
    declare receivedReceptions?: NonAttribute<DeliveryReceptionReceived[]>;

    declare getRoles: BelongsToManyGetAssociationsMixin<Role>;
    declare addRole: BelongsToManyAddAssociationMixin<Role, number>;
    declare addRoles: BelongsToManyAddAssociationsMixin<Role, number>;
    declare setRoles: BelongsToManySetAssociationsMixin<Role, number>;
    declare removeRole: BelongsToManyRemoveAssociationMixin<Role, number>;
    declare removeRoles: BelongsToManyRemoveAssociationsMixin<Role, number>;
    declare hasRole: BelongsToManyHasAssociationMixin<Role, number>;
    declare hasRoles: BelongsToManyHasAssociationsMixin<Role, number>;

    declare getDeliveryReceptions: HasManyGetAssociationsMixin<DeliveryReception>;
    declare addDeliveryReception: HasManyAddAssociationMixin<
        DeliveryReception,
        number
    >;
    declare addDeliveryReceptions: HasManyAddAssociationsMixin<
        DeliveryReception,
        number
    >;
    declare setDeliveryReceptions: HasManySetAssociationsMixin<
        DeliveryReception,
        number
    >;
    declare removeDeliveryReception: HasManyRemoveAssociationMixin<
        DeliveryReception,
        number
    >;
    declare removeDeliveryReceptions: HasManyRemoveAssociationsMixin<
        DeliveryReception,
        number
    >;
    declare hasDeliveryReception: HasManyHasAssociationMixin<
        DeliveryReception,
        number
    >;
    declare hasDeliveryReceptions: HasManyHasAssociationsMixin<
        DeliveryReception,
        number
    >;
    declare countDeliveryReceptions: HasManyCountAssociationsMixin;
    declare createDeliveryReception: HasManyCreateAssociationMixin<
        DeliveryReception,
        "userId"
    >;

    declare getComments: HasManyGetAssociationsMixin<Comment>;
    declare addComment: HasManyAddAssociationMixin<Comment, number>;
    declare addComments: HasManyAddAssociationsMixin<Comment, number>;
    declare setComments: HasManySetAssociationsMixin<Comment, number>;
    declare removeComment: HasManyRemoveAssociationMixin<Comment, number>;
    declare removeComments: HasManyRemoveAssociationsMixin<Comment, number>;
    declare hasComment: HasManyHasAssociationMixin<Comment, number>;
    declare hasComments: HasManyHasAssociationsMixin<Comment, number>;
    declare countComments: HasManyCountAssociationsMixin;
    declare createComment: HasManyCreateAssociationMixin<Comment, "userId">;

    declare getReceivedReceptions: HasManyGetAssociationsMixin<DeliveryReceptionReceived>;
    declare addReceivedReception: HasManyAddAssociationMixin<
        DeliveryReceptionReceived,
        number
    >;
    declare addReceivedReceptions: HasManyAddAssociationsMixin<
        DeliveryReceptionReceived,
        number
    >;
    declare setReceivedReceptions: HasManySetAssociationsMixin<
        DeliveryReceptionReceived,
        number
    >;
    declare removeReceivedReception: HasManyRemoveAssociationMixin<
        DeliveryReceptionReceived,
        number
    >;
    declare removeReceivedReceptions: HasManyRemoveAssociationsMixin<
        DeliveryReceptionReceived,
        number
    >;
    declare hasReceivedReception: HasManyHasAssociationMixin<
        DeliveryReceptionReceived,
        number
    >;
    declare hasReceivedReceptions: HasManyHasAssociationsMixin<
        DeliveryReceptionReceived,
        number
    >;
    declare countReceivedReceptions: HasManyCountAssociationsMixin;
    declare createReceivedReception: HasManyCreateAssociationMixin<
        DeliveryReceptionReceived,
        "userId"
    >;

    declare static associations: {
        roles: Association<User, Role>;
        deliveryReceptions: Association<User, DeliveryReception>;
        comments: Association<User, Comment>;
        receivedReceptions: Association<User, DeliveryReceptionReceived>;
    };

    static associate(models: IDB) {
        User.belongsToMany(models.Role, {
            through: models.UserRole,
            foreignKey: "idUsuario",
            otherKey: "idRol",
            as: "roles",
        });

        User.hasMany(models.DeliveryReception, {
            foreignKey: "idUsuario",
            as: "deliveryReceptions",
        });

        User.hasMany(models.Comment, {
            foreignKey: "idUsuario",
            as: "comments",
        });

        User.hasMany(models.DeliveryReceptionReceived, {
            foreignKey: "idUsuario",
            as: "receivedReceptions",
        });
    }
}

import {
    CreationOptional,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "sequelize";
import User from "./User";
import DeliveryReception from "./DeliveryReception";
import Category from "./Category";
import { IDB } from "../types/interfaces/db";

export default class Comment extends Model<
    InferAttributes<Comment>,
    InferCreationAttributes<Comment>
> {
    declare id: CreationOptional<number>;
    declare text: string;

    declare userId: ForeignKey<User["id"]>;
    declare categoryId: ForeignKey<Category["id"]>;
    declare deliveryReceptionId: ForeignKey<DeliveryReception["id"]>;

    declare user?: NonAttribute<User>;
    declare category?: NonAttribute<Category>;
    declare deliveryReception?: NonAttribute<DeliveryReception>;

    static associate(models: IDB) {
        Comment.belongsTo(models.User, {
            foreignKey: "idUsuario",
            as: "user",
        });
        Comment.belongsTo(models.Category, {
            foreignKey: "idCategoria",
            as: "category",
        });
        Comment.belongsTo(models.DeliveryReception, {
            foreignKey: "idEntregaRecepcionPuesto",
            as: "deliveryReception",
        });
    }
}

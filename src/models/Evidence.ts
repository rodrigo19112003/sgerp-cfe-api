import {
    CreationOptional,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
    Association,
} from "sequelize";
import User from "./User";
import DeliveryReception from "./DeliveryReception";
import Category from "./Category";
import { IDB } from "../types/interfaces/db";

export default class Evidence extends Model<
    InferAttributes<Evidence>,
    InferCreationAttributes<Evidence>
> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare content: Buffer;

    declare deliveryReceptionId: ForeignKey<DeliveryReception["id"]>;
    declare categoryId: ForeignKey<Category["id"]>;
    declare userId: ForeignKey<User["id"]>;

    declare deliveryReception?: NonAttribute<DeliveryReception>;
    declare category?: NonAttribute<Category>;
    declare user?: NonAttribute<User>;

    declare static associations: {
        deliveryReception: Association<Evidence, DeliveryReception>;
        category: Association<Evidence, Category>;
        user: Association<Evidence, User>;
    };

    static associate(models: IDB) {
        Evidence.belongsTo(models.User, {
            foreignKey: "idUsuario",
            as: "user",
        });

        Evidence.belongsTo(models.Category, {
            foreignKey: "idCategoria",
            as: "category",
        });

        Evidence.belongsTo(models.DeliveryReception, {
            foreignKey: "idEntregaRecepcionPuesto",
            as: "deliveryReception",
        });
    }
}

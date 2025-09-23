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
import { IDB } from "../types/interfaces/db";

export default class DeliveryReceptionReceived extends Model<
    InferAttributes<DeliveryReceptionReceived>,
    InferCreationAttributes<DeliveryReceptionReceived>
> {
    declare id: CreationOptional<number>;
    declare accepted: boolean | null;

    declare userId: ForeignKey<User["id"]>;
    declare deliveryReceptionId: ForeignKey<DeliveryReception["id"]>;

    declare user?: NonAttribute<User>;
    declare deliveryReception?: NonAttribute<DeliveryReception>;

    declare static associations: {
        user: Association<DeliveryReceptionReceived, User>;
        deliveryReception: Association<
            DeliveryReceptionReceived,
            DeliveryReception
        >;
    };

    static associate(models: IDB) {
        DeliveryReceptionReceived.belongsTo(models.User, {
            foreignKey: "idUsuario",
            as: "user",
        });

        DeliveryReceptionReceived.belongsTo(models.DeliveryReception, {
            foreignKey: "idEntregaRecepcionPuesto",
            as: "deliveryReception",
        });
    }
}

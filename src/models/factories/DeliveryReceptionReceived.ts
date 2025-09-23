import { DataTypes, Sequelize } from "sequelize";
import DeliveryReceptionReceived from "../DeliveryReceptionReceived";

export default (sequelize: Sequelize) => {
    DeliveryReceptionReceived.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                field: "idEntregaRecepcionPuestoRecibida",
            },
            accepted: {
                type: DataTypes.BOOLEAN,
                field: "Aceptacion",
                allowNull: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                field: "idUsuario",
                allowNull: false,
            },
            deliveryReceptionId: {
                type: DataTypes.INTEGER,
                field: "idEntregaRecepcionPuesto",
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "EntregasRecepcionesPuestosRecibidas",
            timestamps: false,
            defaultScope: {
                attributes: {
                    exclude: ["idUsuario", "idEntregaRecepcionPuesto"],
                },
            },
        }
    );

    return DeliveryReceptionReceived;
};

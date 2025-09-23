import { DataTypes, Sequelize } from "sequelize";
import Evidence from "../Evidence";

export default (sequelize: Sequelize) => {
    Evidence.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                field: "idEvidencia",
            },
            name: {
                type: DataTypes.STRING(100),
                field: "nombre",
                allowNull: false,
            },
            file: {
                type: DataTypes.BLOB("medium"),
                field: "evidencia",
                allowNull: false,
            },
            deliveryReceptionId: {
                type: DataTypes.INTEGER,
                field: "idEntregaRecepcionPuesto",
                allowNull: false,
            },
            categoryId: {
                type: DataTypes.INTEGER,
                field: "idCategoria",
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "Evidencias",
            timestamps: false,
            defaultScope: {
                attributes: {
                    exclude: ["IdCategoria", "idEntregaRecepcionPuesto"],
                },
            },
        }
    );

    return Evidence;
};

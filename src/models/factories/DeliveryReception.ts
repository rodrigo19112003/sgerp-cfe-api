import DeliveryReception from "../DeliveryReception";
import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
    DeliveryReception.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                field: "idEntregaRecepcionPuesto",
            },
            generalData: {
                type: DataTypes.TEXT,
                field: "datosGenerales",
                allowNull: false,
            },
            procedureReport: {
                type: DataTypes.TEXT,
                field: "informeAsuntosTramite",
                allowNull: false,
            },
            otherFacts: {
                type: DataTypes.TEXT,
                field: "otrosHechos",
                allowNull: false,
            },
            financialResources: {
                type: DataTypes.TEXT,
                field: "recursosFinancieros",
                allowNull: false,
            },
            humanResources: {
                type: DataTypes.TEXT,
                field: "recursosHumanos",
                allowNull: false,
            },
            materialResources: {
                type: DataTypes.TEXT,
                field: "recursosMateriales",
                allowNull: false,
            },
            areaBudgetStatus: {
                type: DataTypes.TEXT,
                field: "situacionPresupuestoArea",
                allowNull: false,
            },
            programmaticStatus: {
                type: DataTypes.TEXT,
                field: "situacionProgramatica",
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                field: "idUsuario",
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "EntregasRecepcionesPuestos",
            timestamps: false,
            defaultScope: {
                attributes: { exclude: ["idUsuario"] },
            },
        }
    );

    return DeliveryReception;
};

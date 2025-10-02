import { DataTypes, Sequelize } from "sequelize";
import EmailValidationCode from "../EmailValidationCode";

export default (sequelize: Sequelize) => {
    EmailValidationCode.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                field: "idCodigoValidacionCorreo",
            },
            code: {
                type: DataTypes.CHAR(60),
                allowNull: true,
                field: "codigo",
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: "idUsuario",
            },
        },
        {
            sequelize,
            tableName: "CodigosValidacionesCorreos",
            timestamps: false,
            defaultScope: {
                attributes: { exclude: ["idUsuario"] },
            },
        }
    );

    return EmailValidationCode;
};

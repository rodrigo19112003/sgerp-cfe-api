import User from "../User";
import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                field: "idUsuario",
            },
            employeeNumber: {
                type: DataTypes.CHAR(5),
                field: "registroPersonal",
                allowNull: false,
                unique: true,
            },
            passwordHash: {
                type: DataTypes.CHAR(60),
                field: "contrasena",
                allowNull: false,
            },
            fullName: {
                type: DataTypes.STRING(100),
                field: "nombreCompleto",
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(100),
                field: "correoElectronico",
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            },
        },
        {
            sequelize,
            tableName: "Usuarios",
            timestamps: false,
        }
    );

    return User;
};

import { DataTypes, Sequelize } from "sequelize";
import UserRole from "../UserRole";

export default (sequelize: Sequelize) => {
    UserRole.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: "idUsuario",
                primaryKey: true,
            },
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: "idRol",
                primaryKey: true,
            },
        },
        {
            sequelize,
            tableName: "UsuariosRoles",
            timestamps: false,
            defaultScope: {
                attributes: { exclude: ["idUsuario", "idRol"] },
            },
        }
    );

    return UserRole;
};

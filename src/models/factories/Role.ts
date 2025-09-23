import { DataTypes, Sequelize } from "sequelize";
import Role from "../Role";

export default (sequelize: Sequelize) => {
    Role.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                field: "idRol",
            },
            name: {
                type: DataTypes.STRING(30),
                allowNull: false,
                unique: true,
                field: "nombre",
            },
        },
        {
            sequelize,
            tableName: "Roles",
            timestamps: false,
        }
    );

    return Role;
};

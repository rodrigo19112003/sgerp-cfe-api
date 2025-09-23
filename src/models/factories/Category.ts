import { DataTypes, Sequelize } from "sequelize";
import Category from "../Category";

export default (sequelize: Sequelize) => {
    Category.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                field: "idCategoria",
            },
            name: {
                type: DataTypes.STRING(60),
                field: "nombre",
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "Categorias",
            timestamps: false,
        }
    );

    return Category;
};

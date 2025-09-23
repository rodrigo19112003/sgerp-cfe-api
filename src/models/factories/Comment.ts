import { DataTypes, Sequelize } from "sequelize";
import Comment from "../Comment";

export default (sequelize: Sequelize) => {
    Comment.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                field: "idComentario",
            },
            text: {
                type: DataTypes.TEXT,
                field: "textoComentario",
                allowNull: false,
            },
            categoryId: {
                type: DataTypes.INTEGER,
                field: "idCategoria",
                allowNull: false,
            },
            deliveryReceptionId: {
                type: DataTypes.INTEGER,
                field: "idEntregaRecepcionPuesto",
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
            tableName: "Comentarios",
            timestamps: false,
            defaultScope: {
                attributes: {
                    exclude: [
                        "idCategoria",
                        "idEntregaRecepcionPuesto",
                        "idUsuario",
                    ],
                },
            },
        }
    );

    return Comment;
};

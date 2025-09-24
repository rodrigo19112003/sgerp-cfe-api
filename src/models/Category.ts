import {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
    Association,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManySetAssociationsMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyHasAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
} from "sequelize";
import Comment from "./Comment";
import Evidence from "./Evidence";
import { IDB } from "../types/interfaces/db";

export default class Category extends Model<
    InferAttributes<Category>,
    InferCreationAttributes<Category>
> {
    declare id: CreationOptional<number>;
    declare name: string;

    declare comments?: NonAttribute<Comment[]>;
    declare evidences?: NonAttribute<Evidence[]>;

    declare getComments: HasManyGetAssociationsMixin<Comment>;
    declare addComment: HasManyAddAssociationMixin<Comment, number>;
    declare addComments: HasManyAddAssociationsMixin<Comment, number>;
    declare setComments: HasManySetAssociationsMixin<Comment, number>;
    declare removeComment: HasManyRemoveAssociationMixin<Comment, number>;
    declare removeComments: HasManyRemoveAssociationsMixin<Comment, number>;
    declare hasComment: HasManyHasAssociationMixin<Comment, number>;
    declare hasComments: HasManyHasAssociationsMixin<Comment, number>;
    declare countComments: HasManyCountAssociationsMixin;
    declare createComment: HasManyCreateAssociationMixin<Comment, "categoryId">;

    declare getEvidences: HasManyGetAssociationsMixin<Evidence>;
    declare addEvidence: HasManyAddAssociationMixin<Evidence, number>;
    declare addEvidences: HasManyAddAssociationsMixin<Evidence, number>;
    declare setEvidences: HasManySetAssociationsMixin<Evidence, number>;
    declare removeEvidence: HasManyRemoveAssociationMixin<Evidence, number>;
    declare removeEvidences: HasManyRemoveAssociationsMixin<Evidence, number>;
    declare hasEvidence: HasManyHasAssociationMixin<Evidence, number>;
    declare hasEvidences: HasManyHasAssociationsMixin<Evidence, number>;
    declare countEvidences: HasManyCountAssociationsMixin;
    declare createEvidence: HasManyCreateAssociationMixin<
        Evidence,
        "categoryId"
    >;

    declare static associations: {
        comments: Association<Category, Comment>;
        evidences: Association<Category, Evidence>;
    };

    static associate(models: IDB) {
        Category.hasMany(models.Comment, {
            foreignKey: "idCategoria",
            as: "comments",
        });
        Category.hasMany(models.Evidence, {
            foreignKey: "idCategoria",
            as: "evidences",
        });
    }
}

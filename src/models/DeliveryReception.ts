import {
    CreationOptional,
    ForeignKey,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin,
    HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    HasManySetAssociationsMixin,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
    Association,
} from "sequelize";
import User from "./User";
import Comment from "./Comment";
import Evidence from "./Evidence";
import DeliveryReceptionReceived from "./DeliveryReceptionReceived";
import { IDB } from "../types/interfaces/db";

export default class DeliveryReception extends Model<
    InferAttributes<DeliveryReception>,
    InferCreationAttributes<DeliveryReception>
> {
    declare id: CreationOptional<number>;
    declare generalData: string;
    declare procedureReport: string;
    declare otherFacts: string;
    declare financialResources: string;
    declare humanResources: string;
    declare materialResources: string;
    declare areaBudgetStatus: string;
    declare programmaticStatus: string;

    declare userId: ForeignKey<User["id"]>;
    declare user?: NonAttribute<User>;

    declare comments?: NonAttribute<Comment[]>;
    declare evidences?: NonAttribute<Evidence[]>;
    declare received?: NonAttribute<DeliveryReceptionReceived[]>;

    declare getComments: HasManyGetAssociationsMixin<Comment>;
    declare addComment: HasManyAddAssociationMixin<Comment, number>;
    declare addComments: HasManyAddAssociationsMixin<Comment, number>;
    declare setComments: HasManySetAssociationsMixin<Comment, number>;
    declare removeComment: HasManyRemoveAssociationMixin<Comment, number>;
    declare removeComments: HasManyRemoveAssociationsMixin<Comment, number>;
    declare hasComment: HasManyHasAssociationMixin<Comment, number>;
    declare hasComments: HasManyHasAssociationsMixin<Comment, number>;
    declare countComments: HasManyCountAssociationsMixin;
    declare createComment: HasManyCreateAssociationMixin<
        Comment,
        "deliveryReceptionId"
    >;

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
        "deliveryReceptionId"
    >;

    declare getReceived: HasManyGetAssociationsMixin<DeliveryReceptionReceived>;
    declare addReceived: HasManyAddAssociationMixin<
        DeliveryReceptionReceived,
        number
    >;
    declare addReceiveds: HasManyAddAssociationsMixin<
        DeliveryReceptionReceived,
        number
    >;
    declare setReceived: HasManySetAssociationsMixin<
        DeliveryReceptionReceived,
        number
    >;
    declare removeReceived: HasManyRemoveAssociationMixin<
        DeliveryReceptionReceived,
        number
    >;
    declare removeReceiveds: HasManyRemoveAssociationsMixin<
        DeliveryReceptionReceived,
        number
    >;
    declare hasReceived: HasManyHasAssociationMixin<
        DeliveryReceptionReceived,
        number
    >;
    declare hasReceiveds: HasManyHasAssociationsMixin<
        DeliveryReceptionReceived,
        number
    >;
    declare countReceived: HasManyCountAssociationsMixin;
    declare createReceived: HasManyCreateAssociationMixin<
        DeliveryReceptionReceived,
        "deliveryReceptionId"
    >;

    declare static associations: {
        comments: Association<DeliveryReception, Comment>;
        evidences: Association<DeliveryReception, Evidence>;
        received: Association<DeliveryReception, DeliveryReceptionReceived>;
        user: Association<DeliveryReception, User>;
    };

    static associate(models: IDB) {
        DeliveryReception.belongsTo(models.User, {
            foreignKey: "idUsuario",
            as: "user",
        });

        DeliveryReception.hasMany(models.Comment, {
            foreignKey: "idEntregaRecepcionPuesto",
            as: "comments",
        });

        DeliveryReception.hasMany(models.Evidence, {
            foreignKey: "idEntregaRecepcionPuesto",
            as: "evidences",
        });

        DeliveryReception.hasMany(models.DeliveryReceptionReceived, {
            foreignKey: "idEntregaRecepcionPuesto",
            as: "received",
        });
    }
}

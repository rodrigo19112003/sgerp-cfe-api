import {
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
    Model,
    ForeignKey,
    NonAttribute,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    BelongsToCreateAssociationMixin,
    Association,
} from "sequelize";
import User from "./User";
import { IDB } from "../types/interfaces/db";

export default class EmailValidationCode extends Model<
    InferAttributes<EmailValidationCode>,
    InferCreationAttributes<EmailValidationCode>
> {
    declare id: CreationOptional<number>;
    declare code: string;

    declare userId: ForeignKey<User["id"]>;

    declare user?: NonAttribute<User>;
    declare getUser: BelongsToGetAssociationMixin<User>;
    declare setUser: BelongsToSetAssociationMixin<User, number>;
    declare createUser: BelongsToCreateAssociationMixin<User>;

    declare static associations: {
        user: Association<EmailValidationCode, User>;
    };

    static associate(models: IDB) {
        EmailValidationCode.belongsTo(models.User, {
            foreignKey: "idUsuario",
            as: "user",
        });
    }
}

import { Options, Sequelize } from "sequelize";
import User from "../../models/User";
import DeliveryReception from "../../models/DeliveryReception";
import Category from "../../models/Category";
import Role from "../../models/Role";
import UserRole from "../../models/UserRole";
import Evidence from "../../models/Evidence";
import Comment from "../../models/Comment";
import DeliveryReceptionReceived from "../../models/DeliveryReceptionReceived";
import EmailValidationCode from "../../models/EmailValidationCode";

interface IDBModel {
    associate: (db: IDB) => void;
}

interface IDBEnviroment {
    [key: string]: Options;
}

interface IDB {
    User: typeof User & IDBModel;
    DeliveryReception: typeof DeliveryReception & IDBModel;
    Category: typeof Category & IDBModel;
    Role: typeof Role & IDBModel;
    UserRole: typeof UserRole & IDBModel;
    Evidence: typeof Evidence & IDBModel;
    Comment: typeof Comment & IDBModel;
    DeliveryReceptionReceived: typeof DeliveryReceptionReceived & IDBModel;
    EmailValidationCode: typeof EmailValidationCode & IDBModel;
    sequelize: Sequelize;
}

export { IDBEnviroment, IDB, IDBModel };

import { InferAttributes } from "sequelize";
import User from "../../models/User";
import UserRoles from "../enums/user_roles";
import DeliveryReceptionStatusCodes from "../enums/delivery_reception_status_codes";
import DeliveryReceptionReceived from "../../models/DeliveryReceptionReceived";
import DeliveryReception from "../../models/DeliveryReception";
import { IFile } from "./request_bodies";
import Comment from "../../models/Comment";

interface IErrorMessageWithCode {
    details: string;
    errorCode?: string;
}

interface IUserWithRoles extends Omit<InferAttributes<User>, "passwordHash"> {
    passwordHash?: string;
    roles: UserRoles[];
    token?: string;
}

interface IDeliveryReceptionWithOpcionalWorkers
    extends Omit<InferAttributes<DeliveryReceptionReceived>, "accepted"> {
    deliveryReceptionId: number;
    employeeNumberReceiver?: string;
    fullNameReceiver?: string;
    employeeNumberMaker?: string;
    fullNameMaker?: string;
    status: DeliveryReceptionStatusCodes;
}

interface IDeliveryReceptionWithStatusAndWorkers
    extends InferAttributes<DeliveryReception> {
    procedureReportFile?: IFile;
    financialResourcesFile?: IFile;
    humanResourcesFile?: IFile;
    materialResourcesFile?: IFile;
    areaBudgetStatusFile?: IFile;
    programmaticStatusFile?: IFile;
    employeeNumberReceiver?: string;
    fullNameReceiver?: string;
    employeeNumberMaker?: string;
    fullNameMaker?: string;
    status: DeliveryReceptionStatusCodes;
}

interface ICommentWithCategoryNameAndZoneManagerName
    extends InferAttributes<Comment> {
    categoryName: string;
    zoneManagerName: string;
}

export {
    IErrorMessageWithCode,
    IUserWithRoles,
    IDeliveryReceptionWithOpcionalWorkers,
    IDeliveryReceptionWithStatusAndWorkers,
    ICommentWithCategoryNameAndZoneManagerName,
};

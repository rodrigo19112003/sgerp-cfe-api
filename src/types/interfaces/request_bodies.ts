import EvidenceCategories from "../enums/evidence_categories";
import UserRoles from "../enums/user_roles";

interface ILoginBody {
    employeeNumber?: string;
    password?: string;
}

interface ISendingCodeToChangePasswordBody {
    email?: string;
}

interface IValidationCodeBody {
    email?: string;
    code?: string;
}

interface IChangingPasswordBody {
    email?: string;
    code?: string;
    password?: string;
}

interface ICreateOrUpdateUserBody {
    employeeNumber?: string;
    fullName?: string;
    email?: string;
    userRoles?: UserRoles[];
}

interface IFile {
    category: EvidenceCategories;
    name: string;
    content: string | Buffer;
}

interface ICreateOrUpdateDeliveryReceptionBody {
    deliveryReceptionId?: number;
    generalData?: string;
    otherFacts?: string;
    procedureReport?: string;
    financialResources?: string;
    humanResources?: string;
    materialResources?: string;
    areaBudgetStatus?: string;
    programmaticStatus?: string;
    procedureReportFile?: IFile;
    financialResourcesFile?: IFile;
    humanResourcesFile?: IFile;
    materialResourcesFile?: IFile;
    areaBudgetStatusFile?: IFile;
    programmaticStatusFile?: IFile;
    employeeNumberReceiver?: string;
}

interface ICreateCommentBody {
    text?: string;
    categoryName: EvidenceCategories;
}

export {
    ILoginBody,
    ISendingCodeToChangePasswordBody,
    IValidationCodeBody,
    IChangingPasswordBody,
    ICreateOrUpdateUserBody,
    ICreateOrUpdateDeliveryReceptionBody,
    IFile,
    ICreateCommentBody,
};

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

export {
    ILoginBody,
    ISendingCodeToChangePasswordBody,
    IValidationCodeBody,
    IChangingPasswordBody,
    ICreateOrUpdateUserBody,
};

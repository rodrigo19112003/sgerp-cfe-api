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

export { ILoginBody, ISendingCodeToChangePasswordBody, IValidationCodeBody };

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

export {
    ILoginBody,
    ISendingCodeToChangePasswordBody,
    IValidationCodeBody,
    IChangingPasswordBody,
};

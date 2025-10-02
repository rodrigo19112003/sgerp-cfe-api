interface ILoginBody {
    employeeNumber?: string;
    password?: string;
}

interface ISendingCodeToChangePasswordBody {
    email?: string;
}

export { ILoginBody, ISendingCodeToChangePasswordBody };

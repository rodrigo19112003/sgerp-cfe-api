import EvidenceCategories from "../enums/evidence_categories";

interface IUserByIdParams {
    userId?: number;
}

interface IUserByEmployeeNumberParams {
    employeeNumber?: string;
}

interface IDeliveryReceptionByIdParams {
    deliveryReceptionId?: number;
}

interface ICommentsByDeliveryReceptionIdAndCategoryParams {
    deliveryReceptionId?: number;
    category?: EvidenceCategories;
}

export {
    IUserByIdParams,
    IUserByEmployeeNumberParams,
    IDeliveryReceptionByIdParams,
    ICommentsByDeliveryReceptionIdAndCategoryParams,
};

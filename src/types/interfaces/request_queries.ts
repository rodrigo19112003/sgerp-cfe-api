import EvidenceCategories from "../enums/evidence_categories";

interface IPaginationQuery {
    limit?: number;
    offset?: number;
    query?: string;
}

interface ICommentByCategoryQuery {
    categoryName?: EvidenceCategories;
}

export { IPaginationQuery, ICommentByCategoryQuery };

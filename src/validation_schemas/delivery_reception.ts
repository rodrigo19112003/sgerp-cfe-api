import { Schema } from "express-validator";
import EvidenceCategories from "../types/enums/evidence_categories";

const getAllDeliveriesReceptionsValidationSchema: Schema = {
    offset: {
        in: ["query"],
        optional: { options: { nullable: true } },
        isInt: {
            options: { min: 1 },
            errorMessage: "Query value offset must be a positive integer",
        },
        toInt: true,
    },
    limit: {
        in: ["query"],
        optional: { options: { nullable: true } },
        isInt: {
            options: { min: 1 },
            errorMessage: "Query value limit must be a positive integer",
        },
        toInt: true,
    },
    query: {
        in: ["query"],
        trim: true,
        optional: { options: { nullable: true } },
    },
};

const deleteDeliveryReceptionValidationSchema: Schema = {
    userId: {
        in: ["params"],
        isInt: {
            options: { min: 1 },
            errorMessage:
                "Parameter deliveryReceptionId must be a positive integer",
        },
        toInt: true,
    },
};

const createDeliveryReceptionValidationSchema: Schema = {
    generalData: {
        in: ["body"],
        isString: {
            errorMessage: "generalData must be a string",
        },
        notEmpty: {
            errorMessage: "generalData is required",
        },
        trim: true,
    },
    procedureReport: {
        in: ["body"],
        isString: {
            errorMessage: "procedureReport must be a string",
        },
        notEmpty: {
            errorMessage: "procedureReport is required",
        },
        trim: true,
    },
    otherFacts: {
        in: ["body"],
        isString: {
            errorMessage: "otherFacts must be a string",
        },
        notEmpty: {
            errorMessage: "otherFacts is required",
        },
        trim: true,
    },
    financialResources: {
        in: ["body"],
        isString: {
            errorMessage: "financialResources must be a string",
        },
        notEmpty: {
            errorMessage: "financialResources is required",
        },
        trim: true,
    },
    humanResources: {
        in: ["body"],
        isString: {
            errorMessage: "humanResources must be a string",
        },
        notEmpty: {
            errorMessage: "humanResources is required",
        },
        trim: true,
    },
    materialResources: {
        in: ["body"],
        isString: {
            errorMessage: "materialResources must be a string",
        },
        notEmpty: {
            errorMessage: "materialResources is required",
        },
        trim: true,
    },
    areaBudgetStatus: {
        in: ["body"],
        isString: {
            errorMessage: "areaBudgetStatus must be a string",
        },
        notEmpty: {
            errorMessage: "areaBudgetStatus is required",
        },
        trim: true,
    },
    programmaticStatus: {
        in: ["body"],
        isString: {
            errorMessage: "programmaticStatus must be a string",
        },
        notEmpty: {
            errorMessage: "programmaticStatus is required",
        },
        trim: true,
    },
    procedureReportFile: {
        in: ["body"],
        isObject: {
            errorMessage: "procedureReportFile must be an object",
        },
        custom: {
            options: (file: any) =>
                file &&
                typeof file.name === "string" &&
                file.category === EvidenceCategories.REPORT &&
                typeof file.content === "string" &&
                file.content.length > 0,
            errorMessage:
                "procedureReportFile must contain valid name, category, and content",
        },
    },
    financialResourcesFile: {
        in: ["body"],
        isObject: {
            errorMessage: "financialResourcesFile must be an object",
        },
        custom: {
            options: (file: any) =>
                file &&
                typeof file.name === "string" &&
                file.category === EvidenceCategories.FINANCE &&
                typeof file.content === "string" &&
                file.content.length > 0,
            errorMessage:
                "financialResourcesFile must contain valid name, category, and content",
        },
    },
    humanResourcesFile: {
        in: ["body"],
        isObject: {
            errorMessage: "humanResourcesFile must be an object",
        },
        custom: {
            options: (file: any) =>
                file &&
                typeof file.name === "string" &&
                file.category === EvidenceCategories.HUMAN &&
                typeof file.content === "string" &&
                file.content.length > 0,
            errorMessage:
                "humanResourcesFile must contain valid name, category, and content",
        },
    },
    materialResourcesFile: {
        in: ["body"],
        isObject: {
            errorMessage: "materialResourcesFile must be an object",
        },
        custom: {
            options: (file: any) =>
                file &&
                typeof file.name === "string" &&
                file.category === EvidenceCategories.MATERIAL &&
                typeof file.content === "string" &&
                file.content.length > 0,
            errorMessage:
                "materialResourcesFile must contain valid name, category, and content",
        },
    },
    areaBudgetStatusFile: {
        in: ["body"],
        isObject: {
            errorMessage: "areaBudgetStatusFile must be an object",
        },
        custom: {
            options: (file: any) =>
                file &&
                typeof file.name === "string" &&
                file.category === EvidenceCategories.BUDGET &&
                typeof file.content === "string" &&
                file.content.length > 0,
            errorMessage:
                "areaBudgetStatusFile must contain valid name, category, and content",
        },
    },
    programmaticStatusFile: {
        in: ["body"],
        isObject: {
            errorMessage: "programmaticStatusFile must be an object",
        },
        custom: {
            options: (file: any) =>
                file &&
                typeof file.name === "string" &&
                file.category === EvidenceCategories.PROGRAMMATIC &&
                typeof file.content === "string" &&
                file.content.length > 0,
            errorMessage:
                "programmaticStatusFile must contain valid name, category, and content",
        },
    },
};

const updateDeliveryReceptionValidationSchema: Schema = {
    deliveryReceptionId: {
        in: ["params"],
        isInt: {
            options: { min: 1 },
            errorMessage:
                "Parameter deliveryReceptionId must be a positive integer",
        },
        toInt: true,
    },
    generalData: {
        in: ["body"],
        isString: {
            errorMessage: "generalData must be a string",
        },
        notEmpty: {
            errorMessage: "generalData is required",
        },
        trim: true,
    },
    procedureReport: {
        in: ["body"],
        isString: {
            errorMessage: "procedureReport must be a string",
        },
        notEmpty: {
            errorMessage: "procedureReport is required",
        },
        trim: true,
    },
    otherFacts: {
        in: ["body"],
        isString: {
            errorMessage: "otherFacts must be a string",
        },
        notEmpty: {
            errorMessage: "otherFacts is required",
        },
        trim: true,
    },
    financialResources: {
        in: ["body"],
        isString: {
            errorMessage: "financialResources must be a string",
        },
        notEmpty: {
            errorMessage: "financialResources is required",
        },
        trim: true,
    },
    humanResources: {
        in: ["body"],
        isString: {
            errorMessage: "humanResources must be a string",
        },
        notEmpty: {
            errorMessage: "humanResources is required",
        },
        trim: true,
    },
    materialResources: {
        in: ["body"],
        isString: {
            errorMessage: "materialResources must be a string",
        },
        notEmpty: {
            errorMessage: "materialResources is required",
        },
        trim: true,
    },
    areaBudgetStatus: {
        in: ["body"],
        isString: {
            errorMessage: "areaBudgetStatus must be a string",
        },
        notEmpty: {
            errorMessage: "areaBudgetStatus is required",
        },
        trim: true,
    },
    programmaticStatus: {
        in: ["body"],
        isString: {
            errorMessage: "programmaticStatus must be a string",
        },
        notEmpty: {
            errorMessage: "programmaticStatus is required",
        },
        trim: true,
    },
    procedureReportFile: {
        in: ["body"],
        isObject: {
            errorMessage: "procedureReportFile must be an object",
        },
        custom: {
            options: (file: any) =>
                file &&
                typeof file.name === "string" &&
                file.category === EvidenceCategories.REPORT &&
                typeof file.content === "string" &&
                file.content.length > 0,
            errorMessage:
                "procedureReportFile must contain valid name, category, and content",
        },
    },
    financialResourcesFile: {
        in: ["body"],
        isObject: {
            errorMessage: "financialResourcesFile must be an object",
        },
        custom: {
            options: (file: any) =>
                file &&
                typeof file.name === "string" &&
                file.category === EvidenceCategories.FINANCE &&
                typeof file.content === "string" &&
                file.content.length > 0,
            errorMessage:
                "financialResourcesFile must contain valid name, category, and content",
        },
    },
    humanResourcesFile: {
        in: ["body"],
        isObject: {
            errorMessage: "humanResourcesFile must be an object",
        },
        custom: {
            options: (file: any) =>
                file &&
                typeof file.name === "string" &&
                file.category === EvidenceCategories.HUMAN &&
                typeof file.content === "string" &&
                file.content.length > 0,
            errorMessage:
                "humanResourcesFile must contain valid name, category, and content",
        },
    },
    materialResourcesFile: {
        in: ["body"],
        isObject: {
            errorMessage: "materialResourcesFile must be an object",
        },
        custom: {
            options: (file: any) =>
                file &&
                typeof file.name === "string" &&
                file.category === EvidenceCategories.MATERIAL &&
                typeof file.content === "string" &&
                file.content.length > 0,
            errorMessage:
                "materialResourcesFile must contain valid name, category, and content",
        },
    },
    areaBudgetStatusFile: {
        in: ["body"],
        isObject: {
            errorMessage: "areaBudgetStatusFile must be an object",
        },
        custom: {
            options: (file: any) =>
                file &&
                typeof file.name === "string" &&
                file.category === EvidenceCategories.BUDGET &&
                typeof file.content === "string" &&
                file.content.length > 0,
            errorMessage:
                "areaBudgetStatusFile must contain valid name, category, and content",
        },
    },
    programmaticStatusFile: {
        in: ["body"],
        isObject: {
            errorMessage: "programmaticStatusFile must be an object",
        },
        custom: {
            options: (file: any) =>
                file &&
                typeof file.name === "string" &&
                file.category === EvidenceCategories.PROGRAMMATIC &&
                typeof file.content === "string" &&
                file.content.length > 0,
            errorMessage:
                "programmaticStatusFile must contain valid name, category, and content",
        },
    },
    employeeNumberReceiver: {
        in: ["body"],
        isString: { errorMessage: "employeeNumberReceiver must be a string" },
        isLength: {
            options: { min: 5, max: 5 },
            errorMessage:
                "employeeNumberReceiver must be exactly 5 characters long",
        },
        notEmpty: { errorMessage: "employeeNumberReceiver is required" },
        trim: true,
    },
};

export {
    getAllDeliveriesReceptionsValidationSchema,
    deleteDeliveryReceptionValidationSchema,
    createDeliveryReceptionValidationSchema,
    updateDeliveryReceptionValidationSchema,
};

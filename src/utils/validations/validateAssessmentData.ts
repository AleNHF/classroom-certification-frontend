import { AssessmentData } from "../../types";

export const validateAssessmentData = (assessment: AssessmentData) => {
    const errorMessages: { [key: string]: string } = {};

    if (!assessment.description) {
        errorMessages.description = 'La descripción es obligatoria.';
    }

    if (!assessment.areaId) {
        errorMessages.areaId = 'El área es obligatoria.';
    }

    if (!assessment.requerimentName) {
        errorMessages.requerimentName = 'El nombre del requisito es obligatoria.';
    }

    return errorMessages;
};
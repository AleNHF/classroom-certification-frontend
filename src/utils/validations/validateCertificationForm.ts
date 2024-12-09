import { CertificationFormData } from "../../types";

export const validateCertificationForm = (certification: CertificationFormData) => {
    const errorMessages: { [key: string]: string } = {};

    if (!certification.evaluatorUsername) {
        errorMessages.evaluatorUsername = 'El nombre del evaluador es obligatorio.';
    }

    if (!certification.faculty) {
        errorMessages.faculty = 'La facultad es obligatoria.';
    }

    if (!certification.modality) {
        errorMessages.modality = 'La modalidad es obligatoria.';
    }

    if (!certification.plan) {
        errorMessages.plan = 'El plan es obligatorio.';
    }

    if (!certification.teacher) {
        errorMessages.teacher = 'El nombre del docente es obligatorio.';
    }

    if (!certification.teacherCode) {
        errorMessages.teacherCode = 'El código del docente es obligatorio.';
    }

    return errorMessages;
};
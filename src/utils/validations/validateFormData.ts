import { FormDataProps } from "../../types";

export const validateFormData = (form: FormDataProps) => {
    const errorMessages: { [key: string]: string } = {};

    if (!form.name) {
        errorMessages.name = 'El nombre del formulario es obligatorio.';
    }

    if (!form.author) {
        errorMessages.author = 'El autor de contenido es obligatorio.';
    }

    /* if (!form.server) {
        errorMessages.server = 'El servidor es obligatorio.';
    } */

    if (!form.career) {
        errorMessages.career = 'La carrera es obligatorio.';
    }

    if (!form.director) {
        errorMessages.director = 'El director es obligatorio.';
    }

    if (!form.responsible) {
        errorMessages.responsible = 'El responsable DEDTEF es obligatorio.';
    }

    return errorMessages;
};
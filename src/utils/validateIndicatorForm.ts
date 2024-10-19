export interface IndicatorForm {
    name: string;
    resourceId: string;
}

export const validateIndicatorForm = (indicator: IndicatorForm) => {
    const errorMessages: { [key: string]: string } = {};

    if (!indicator.name) {
        errorMessages.name = 'El nombre del indicador es obligatorio.';
    }

    if (!indicator.resourceId) {
        errorMessages.resourceId = 'El recurso es obligatorio.';
    }

    return errorMessages;
};

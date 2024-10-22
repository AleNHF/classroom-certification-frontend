export interface PercentageForm {
    percentage: string;
    cycleId: string;
    areaId: string;
}

export const validatePercentageForm = (percentage: PercentageForm) => {
    const errorMessages: { [key: string]: string } = {};

    if (!percentage.percentage) {
        errorMessages.percentage = 'El porcentaje es obligatorio.';
    }

    if (!percentage.cycleId) {
        errorMessages.cycleId = 'El ciclo es obligatorio.';
    }

    if (!percentage.areaId) {
        errorMessages.areaId = 'El área es obligatorio.';
    }

    return errorMessages;
};
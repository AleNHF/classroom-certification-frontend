interface PersonalForm {
    id: string;
    name: string;
    position: string;
    //signature: File | null;
}

interface ValidationResult {
    isValid: boolean;
    errors: { [key: string]: string };
}

export const validatePersonalForm = (form: PersonalForm): ValidationResult => {
    const errors: { [key: string]: string } = {};
    const { name, position } = form;

    if (!name) {
        errors.name = 'El nombre es obligatorio.';
    }

    if (!position) {
        errors.position = 'El cargo es obligatorio.';
    }

    /* if (!signature) {
        errors.signature = 'La firma es obligatoria.';
    }
 */
    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export interface UserForm {
    name: string;
    username: string;
    roleId: string;
}

export const validateUserForm = (user: UserForm) => {
    const errorMessages: { [key: string]: string } = {};

    if (!user.name) {
        errorMessages.name = 'El nombre es obligatorio.';
    }

    if (!user.roleId) {
        errorMessages.roleId = 'El rol es obligatorio.';
    }

    return errorMessages;
};
export const validateLogin = (username: string, password: string) => {
    if (username === '' || password === '') {
        return 'El usuario y la contraseña son obligatorios';
    }
    // Otras validaciones podrían añadirse aquí
    return null;
};

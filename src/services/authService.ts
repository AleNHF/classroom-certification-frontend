export const login = async (username: string, password: string) => {
    try {
        // Aquí agregarías la lógica para autenticar, tal vez una llamada a un API.
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Error en la autenticación');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

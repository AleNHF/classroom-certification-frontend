import { useState } from 'react';
import { login } from '../services/authService';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = async (username: string, password: string) => {
        try {
            await login(username, password);
            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
        }
    };

    return {
        isAuthenticated,
        handleLogin,
    };
};

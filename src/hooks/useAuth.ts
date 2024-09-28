import { useState } from 'react';
import ApiService from '../services/apiService'

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Cargar el estado inicial desde localStorage
        return localStorage.getItem('token') !== null;
    });

    const handleLogin = async (username: string, password: string) => {
        try {
            const response = await ApiService.login(username, password);
            const { user } = response.data;

            localStorage.setItem('token', user.access_token)
            localStorage.setItem('username', user.username)
            localStorage.setItem('moodle_token', user.moodleToken)
            localStorage.setItem('name', user.name)

            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
            throw error;
        }
    };

    return {
        isAuthenticated,
        handleLogin,
    };
};

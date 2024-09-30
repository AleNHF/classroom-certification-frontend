import { useState } from 'react';
import AuthService from '../services/authService'

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('token') !== null;
    });

    const handleLogin = async (username: string, password: string) => {
        try {
            const response = await AuthService.login(username, password);
            const { user } = response.data;

            localStorage.setItem('token', user.access_token)
            localStorage.setItem('username', user.username)
            localStorage.setItem('moodle_token', user.moodleToken)
            localStorage.setItem('name', user.name)

            setIsAuthenticated(true);
            console.log('User authenticated', user.username)
        } catch (error) {
            setIsAuthenticated(false);
            console.log('Authenticated failed', error)
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('moodle_token');
        localStorage.removeItem('name');
        setIsAuthenticated(false);
    };

    console.log('setIsAuthenticated', isAuthenticated)

    return {
        isAuthenticated,
        handleLogin,
        logout
    };
};

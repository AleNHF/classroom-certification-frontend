import { useState } from 'react';
import AuthService from '../services/authService'

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    
    const handleLogin = async (username: string, password: string) => {
        try {
            const response = await AuthService.login(username, password);
            const { user } = response.data;

            localStorage.setItem('token', user.accessToken)
            localStorage.setItem('username', user.username)
            //localStorage.setItem('moodle_token', user.moodleToken)
            localStorage.setItem('name', user.name)
            localStorage.setItem('role', user.rol.name)

            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
            console.error('Authenticated failed', error)
            throw error;
        }
    };

    const logout = () => {
        ['token', 'username', 'moodle_token', 'name', 'role'].forEach((key) => localStorage.removeItem(key));
        setIsAuthenticated(false);
    };

    const getUserRole = () => {
        return localStorage.getItem('role') || '';
    }

    return {
        isAuthenticated,
        setIsAuthenticated,
        handleLogin,
        logout,
        getUserRole
    };
};

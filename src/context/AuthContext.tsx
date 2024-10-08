import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { isTokenExpired } from '../utils/tokenUtils';
import { useAuth } from '../hooks/useAuth';

interface AuthContextType {
    isAuthenticated: boolean;
    handleLogin: (username: string, password: string) => Promise<void>;
    logout: () => void;
    getUserRole: () => string; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { isAuthenticated, setIsAuthenticated, handleLogin, logout, getUserRole } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            if (isTokenExpired(token)) {
                setIsAuthenticated(false);
            } else {
                setIsAuthenticated(true);
            }
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, handleLogin, logout, getUserRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

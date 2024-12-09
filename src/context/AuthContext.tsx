import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { isTokenExpired } from '../utils/tokenUtils';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';

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

const PUBLIC_ROUTE_KEYWORDS = ['aula-virtual', 'certificado'];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { isAuthenticated, setIsAuthenticated, handleLogin, logout, getUserRole } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const isPublicRoute = PUBLIC_ROUTE_KEYWORDS.every(keyword => location.pathname.includes(keyword));

        console.log(location.pathname)
        console.log(isPublicRoute)

        if (!isPublicRoute) {
            console.log('entra a no es publica')
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
        }
    }, [location, setIsAuthenticated]);

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

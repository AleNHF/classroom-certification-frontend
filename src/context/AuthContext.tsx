// AuthContext.tsx
import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthContextType {
    isAuthenticated: boolean;
    handleLogin: (username: string, password: string) => Promise<void>;
    logout: () => void;
    getUserRole: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, handleLogin, logout, getUserRole } = useAuth();

    return (
        <AuthContext.Provider value={{ isAuthenticated, handleLogin, logout, getUserRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// AuthContext.tsx
import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthContextType {
    isAuthenticated: boolean;
    handleLogin: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, handleLogin, logout } = useAuth();
    console.log('AuthContext isAuthenticated', isAuthenticated)

    return (
        <AuthContext.Provider value={{ isAuthenticated, handleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    console.log('context', context)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// AppRoutes.tsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import WorkTeamsPage from '../pages/workTeams/WorkTeamsPage';
import { useAuthContext } from '../context/AuthContext';
import PersonalPage from '../pages/workTeams/PersonalPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuthContext();
    console.log('isAuthenticated', isAuthenticated)
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    return <>{isAuthenticated && children}</>;
};

const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuthContext();
    console.log('AppRoutes isAuthenticated', isAuthenticated)
    return (
            <Routes>
                {/* Si el usuario está autenticado, redirigir a HomePage, de lo contrario, mostrar el Login */}
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />

                {/* Las rutas protegidas que solo pueden ser accedidas si el usuario está autenticado */}
                <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route
                    path="work-teams"
                    element={
                        <ProtectedRoute>
                            <WorkTeamsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="work-teams/personal"
                    element={
                        <ProtectedRoute>
                            <PersonalPage />
                        </ProtectedRoute>
                    }
                />
                {/* Ruta para manejar redirección a una página no encontrada */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
    );
};

export default AppRoutes;

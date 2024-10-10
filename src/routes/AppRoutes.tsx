import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import WorkTeamsPage from '../pages/workTeams/WorkTeamsPage';
import { useAuthContext } from '../context/AuthContext';
import PersonalPage from '../pages/workTeams/PersonalPage';
import RoleProtectedRoute from './RoleProtectedRoute';
import UserPage from '../pages/workTeams/UserPage';
import TeamPage from '../pages/workTeams/TeamPage';
import IndicatorConfigurationPage from '../pages/indicatorsConfiguration/IndicatorConfigurationPage';
import CyclePage from '../pages/indicatorsConfiguration/CyclePage';
import ResourcePage from '../pages/indicatorsConfiguration/ResourcePage';

const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuthContext();

    return (
        <Routes>
            {/* Ruta de login */}
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />

            {/* Rutas protegidas con roles específicos */}
            <Route
                path="/"
                element={<RoleProtectedRoute allowedRoles={['Administrador', 'Evaluador']} element={<HomePage />} />}
            />
            <Route
                path="work-teams"
                element={<RoleProtectedRoute allowedRoles={['Administrador', 'Evaluador']} element={<WorkTeamsPage />} />}
            />
            <Route
                path="work-teams/personal"
                element={<RoleProtectedRoute allowedRoles={['Administrador', 'Evaluador']} element={<PersonalPage />} />}
            />
            <Route
                path="work-teams/users"
                element={<RoleProtectedRoute allowedRoles={['Administrador']} element={<UserPage />} />}
            />
            <Route
                path="work-teams/teams"
                element={<RoleProtectedRoute allowedRoles={['Administrador', 'Evaluador']} element={<TeamPage />} />}
            />
            <Route
                path="indicators-configuration"
                element={<RoleProtectedRoute allowedRoles={['Administrador']} element={<IndicatorConfigurationPage />} />}
            />
            <Route
                path="indicators-configuration/cycles"
                element={<RoleProtectedRoute allowedRoles={['Administrador']} element={<CyclePage />} />}
            />
            <Route
                path="indicators-configuration/resources/:cycleId"
                element={<RoleProtectedRoute allowedRoles={['Administrador']} element={<ResourcePage />} />}
            />

            {/* Página no encontrada */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;

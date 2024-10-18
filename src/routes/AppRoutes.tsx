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
import NoAccessPage from '../pages/utils/NoAccessPage';
import ContentPage from '../pages/indicatorsConfiguration/ContentPage';
import AreaPage from '../pages/indicatorsConfiguration/AreaPage';
import IndicatorPage from '../pages/indicatorsConfiguration/IndicatorPage';
import PercentagePage from '../pages/indicatorsConfiguration/PercentagePage';

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
            <Route
                path="indicators-configuration/contents/:resourceId"
                element={<RoleProtectedRoute allowedRoles={['Administrador']} element={<ContentPage />} />}
            />
            <Route
                path="indicators-configuration/areas"
                element={<RoleProtectedRoute allowedRoles={['Administrador']} element={<AreaPage />} />}
            />
            <Route
                path="indicators-configuration/indicators"
                element={<RoleProtectedRoute allowedRoles={['Administrador']} element={<IndicatorPage />} />}
            />
            <Route
                path="indicators-configuration/percentages"
                element={<RoleProtectedRoute allowedRoles={['Administrador']} element={<PercentagePage />} />}
            />

             {/* Ruta para la página de no acceso */}
            <Route path="/no-access" element={<NoAccessPage />} />

            {/* Página no encontrada */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;

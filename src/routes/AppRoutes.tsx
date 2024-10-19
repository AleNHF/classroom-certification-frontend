import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { LoginPage, HomePage, WorkTeamsPage, PersonalPage, UserPage, TeamPage, IndicatorConfigurationPage, CyclePage, ResourcePage, ContentPage, AreaPage, IndicatorPage, PercentagePage } from '../pages';
import { NoAccessPage } from '../pages/utils';
import RoleProtectedRoute from './RoleProtectedRoute';

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
                path="indicators-configuration/indicators/:areaId"
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

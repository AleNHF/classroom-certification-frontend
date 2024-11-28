import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { LoginPage, HomePage, WorkTeamsPage, PersonalPage, UserPage, TeamPage, IndicatorConfigurationPage, CyclePage, ResourcePage, ContentPage, AreaPage, IndicatorPage, PercentagePage } from '../pages';
import { NoAccessPage } from '../pages/utils';
import RoleProtectedRoute from './RoleProtectedRoute';
import ClassroomPage from '../pages/classrooms/ClassroomPage';
import SearchClassroomPage from '../pages/classrooms/SearchClassroomPage';
import EvaluationDashboard from '../pages/evaluations/EvaluationDashboard';
import FormPage from '../pages/evaluations/forms/FormPage';
import AssessmentPage from '../pages/evaluations/assessments/AssessmentPage';
import CertificationView from '../pages/evaluations/ProcessEvaluationView';
import EvaluationList from '../pages/evaluations/evaluation/EvaluationList';
import EvaluationView from '../pages/evaluations/evaluation/EvaluatedIndicatorsPage';
import EvaluationResults from '../pages/evaluations/evaluation/EvaluationResults';
import SummaryPage from '../pages/evaluations/summary/SummaryPage';

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
            <Route
                path="classrooms"
                element={<RoleProtectedRoute allowedRoles={['Administrador', 'Evaluador']} element={<ClassroomPage />} />}
            />
            <Route
                path="classrooms/search"
                element={<RoleProtectedRoute allowedRoles={['Administrador', 'Evaluador']} element={<SearchClassroomPage />} />}
            />
            <Route
                path="classrooms/evaluation-dashboard"
                element={<RoleProtectedRoute allowedRoles={['Administrador', 'Evaluador']} element={<EvaluationDashboard />} />}
            />
            <Route
                path="classrooms/evaluation-formulario/:classroomId"
                element={<RoleProtectedRoute allowedRoles={['Administrador', 'Evaluador']} element={<FormPage />} />}
            />
            <Route
                path="classrooms/evaluation-assessment/:formId"
                element={<RoleProtectedRoute allowedRoles={['Administrador', 'Evaluador']} element={<AssessmentPage />} />}
            />
            <Route
                path="classrooms/evaluation-progress"
                element={<RoleProtectedRoute allowedRoles={['Administrador', 'Evaluador']} element={<CertificationView />} />}
            />
            <Route
                path="classrooms/evaluations"
                element={<RoleProtectedRoute allowedRoles={['Administrador', 'Evaluador']} element={<EvaluationList />} />}
            />
            <Route
                path="classrooms/evaluations/:evaluationId"
                element={<RoleProtectedRoute allowedRoles={['Administrador', 'Evaluador']} element={<EvaluationView />} />}
            />
            <Route
                path="classrooms/evaluation-results"
                element={<RoleProtectedRoute allowedRoles={['Administrador', 'Evaluador']} element={<EvaluationResults />} />}
            />
            <Route
                path="classrooms/evaluation-summary"
                element={<RoleProtectedRoute allowedRoles={['Administrador', 'Evaluador']} element={<SummaryPage />} />}
            />

             {/* Ruta para la página de no acceso */}
            <Route path="/no-access" element={<NoAccessPage />} />

            {/* Página no encontrada */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;

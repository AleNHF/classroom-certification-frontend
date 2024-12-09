import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { LoginPage, HomePage, WorkTeamsPage, PersonalPage, UserPage, TeamPage, IndicatorConfigurationPage, CyclePage, ResourcePage, ContentPage, AreaPage, IndicatorPage, PercentagePage, CertificationForm, CertificationPage, AssessmentPage, AttachmentContentView, AttachmentPage, AuthoritiesPage, CertificationView, ClassroomPage, EvaluationDashboard, EvaluationList, EvaluationResults, EvaluationView, FormPage, SearchClassroomPage, SummaryPage } from '../pages';
import { NoAccessPage } from '../pages/utils';
import RoleProtectedRoute from './RoleProtectedRoute';
import CertificationViewContent from '../pages/certifications/CertificationViewContent';

const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuthContext();

    return (
        <Routes>
            {/* Public route for certificate view */}
            <Route
                path="/aula-virtual/:classroomCode/certificado/:classroomId"
                element={<CertificationViewContent />}
            />

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
            <Route
                path="work-teams/authorities"
                element={<RoleProtectedRoute allowedRoles={['Administrador']} element={<AuthoritiesPage />} />}
            />
            <Route
                path="classrooms/certificates/:classroomId"
                element={<RoleProtectedRoute allowedRoles={['Administrador', 'Evaluador']} element={<CertificationForm />} />}
            />
            <Route
                path="classrooms/certificate-view/:certificationId"
                element={<RoleProtectedRoute allowedRoles={['Administrador', 'Evaluador']} element={<CertificationPage />} />}
            />
            <Route
                path="classrooms/evaluation-attachments"
                element={<RoleProtectedRoute allowedRoles={['Administrador', 'Evaluador']} element={<AttachmentPage />} />}
            />
            <Route
                path="classrooms/evaluation-attachments/:attachmentId"
                element={<RoleProtectedRoute allowedRoles={['Administrador', 'Evaluador']} element={<AttachmentContentView />} />}
            />

            {/* Ruta para la página de no acceso */}
            <Route path="/no-access" element={<NoAccessPage />} />

            {/* Página no encontrada */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;

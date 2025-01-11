import AuthService from '../services/authService';
import { UserProps, Team, CertificationFormData } from '../types';
import { AssessmentData } from '../types/assessmentData';
import { FormDataProps } from '../types/formData';
import { ClassroomStatus } from '../utils/enums/classroomStatus';

class ApiService {
    private baseUrl: string;

    constructor() {
        //this.baseUrl = 'http://localhost:3000/api';
        this.baseUrl = 'https://classroom-certification-api-production.up.railway.app/api';
    }

    private async request(
        endpoint: string,
        method: string,
        body?: any,
        contentType: string = 'application/json',
        requiresAuth: boolean = true 
    ) {
        const url = `${this.baseUrl}${endpoint}`;
        const token = AuthService.getToken();
        console.log('token', token)
        const headers: HeadersInit = {
            'Content-Type': contentType,
        };

        // Agregar token de autenticación si está presente
        if (requiresAuth && token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options: RequestInit = {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        };

        console.log(options)
        // Manejo de contenido `FormData` para el personal
        if (body instanceof FormData) {
            delete headers['Content-Type']; // Dejar que el navegador maneje los headers
            options.body = body;
        }

        try {
            const response = await fetch(url, options);
            console.log(response)

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error: ${response.status} - ${errorData.message || 'No details available'}`);
            }

            return await response.json();
        } catch (error) {
            console.error('ApiService error:', error);
            throw error;
        }
    }

    // Métodos genéricos para CRUD
    private get(endpoint: string, requiresAuth: boolean = true) {
        return this.request(endpoint, 'GET', undefined, 'application/json', requiresAuth);
    }

    private post(endpoint: string, data?: any) {
        return this.request(endpoint, 'POST', data);
    }

    private patch(endpoint: string, data: any) {
        return this.request(endpoint, 'PATCH', data);
    }

    private delete(endpoint: string) {
        return this.request(endpoint, 'DELETE');
    }

    /*
     * Métodos específicos para usuarios
     */
    public getUsers() {
        return this.get('/user');
    }

    public addUser(userData: UserProps) {
        return this.post('/user', userData);
    }

    public updateUser(id: string, updatedData: UserProps) {
        return this.patch(`/user/${id}`, updatedData);
    }

    public deleteUser(id: string) {
        return this.delete(`/user/${id}`);
    }

    /*
     * Métodos específicos para personal
     */
    public getPersonal() {
        return this.get('/personal');
    }

    public addPersonal(personalData: {name: string, position: string}) {
        return this.post('/personal', personalData);
    }

    public updatePersonal(id: string, updatedData: {name: string, position: string}) {
        return this.patch(`/personal/${id}`, updatedData);
    }

    public deletePersonal(id: string) {
        return this.delete(`/personal/${id}`);
    }

    /*
     * Métodos específicos para equipos
     */
    public getTeams() {
        return this.get('/team');
    }

    public addTeam(teamData: Team) {
        return this.post('/team', teamData);
    }

    public updateTeam(id: string, updatedData: Team) {
        return this.patch(`/team/${id}`, updatedData);
    }

    public deleteTeam(id: string) {
        return this.delete(`/team/${id}`);
    }

    /*
     * Métodos específicos para ciclos
     */
    public getCycles() {
        return this.get('/cycle');
    }

    public addCycle(cycleData: {name: string}) {
        return this.post('/cycle', cycleData);
    }

    public updateCycle(id: string, updatedData: {name: string}) {
        return this.patch(`/cycle/${id}`, updatedData);
    }

    public deleteCycle(id: string) {
        return this.delete(`/cycle/${id}`);
    }

    public getCycle(id: string) {
        return this.get(`/cycle/${id}`);
    }

    /*
     * Métodos específicos para recursos
     */
    public getResources(cycleId: string) {
        return this.get(`/resource/cycle/${cycleId}`);
    }

    public addResource(resourceData: {name: string, cycleId: number}) {
        return this.post('/resource', resourceData);
    }

    public updateResource(id: string, updatedData: {name: string}) {
        return this.patch(`/resource/${id}`, updatedData);
    }

    public deleteResource(id: string) {
        return this.delete(`/resource/${id}`);
    }

    /*
     * Métodos específicos para contenidos
     */
    public getContents(resourceId: string) {
        return this.get(`/content/resource/${resourceId}`);
    }

    public addContent(contentData: {name: string, resourceId: number}) {
        return this.post('/content', contentData);
    }

    public updateContent(id: string, updatedData: {name: string}) {
        return this.patch(`/content/${id}`, updatedData);
    }

    public deleteContent(id: string) {
        return this.delete(`/content/${id}`);
    }

    /*
     * Métodos específicos para áreas
     */
    public getAreas() {
        return this.get(`/area`);
    }

    public addArea(areaData: {name: string}) {
        return this.post('/area', areaData);
    }

    public updateArea(id: string, updatedData: {name: string}) {
        return this.patch(`/area/${id}`, updatedData);
    }

    public deleteArea(id: string) {
        return this.delete(`/area/${id}`);
    }

    public getArea(id: string) {
        return this.get(`/area/${id}`);
    }

    /*
     * Métodos específicos para indicadores
     */
    public getIndicators(areaId: string) {
        return this.get(`/indicator/area/${areaId}`);
    }

    public addIndicator(indicatorData: {name: string, areaId: number, resourceId: number, contentId?: number}) {
        return this.post('/indicator', indicatorData);
    }

    public updateIndicator(id: string, updatedData: {name: string, areaId: number, resourceId: number, contentId?: number}) {
        return this.patch(`/indicator/${id}`, updatedData);
    }

    public deleteIndicator(id: string) {
        return this.delete(`/indicator/${id}`);
    }

    /*
     * Métodos específicos para asignar porcentajes a áreas y ciclos
     */
    public getPercentages() {
        return this.get(`/percentage`);
    }

    public addPercentage(percentageData: {percentage: number, areaId: number, cycleId: number}) {
        return this.post('/percentage', percentageData);
    }

    public updatePercentage(id: string, updatedData: {percentage: number, areaId: number, cycleId: number}) {
        return this.patch(`/percentage/${id}`, updatedData);
    }

    public deletePercentage(id: string) {
        return this.delete(`/percentage/${id}`);
    }

    /*
     * Métodos específicos para administrar aulas
     */
    public getClassrooms() {
        return this.get(`/classroom`);
    }

    public addClassroom(classroomData: {name: string, code: string, status: ClassroomStatus}) {
        return this.post('/classroom', classroomData);
    }

    public updateClassroom(id: string, updatedData: {name: string, code: string, status: string}) {
        return this.patch(`/classroom/${id}`, updatedData);
    }

    public deleteClassroom(id: string) {
        return this.delete(`/classroom/${id}`);
    }

    public getEvaluationsByClassroom(classroomId: number) {
        return this.get(`/evaluation/classroom/${classroomId}`);
    }

    public addEvaluation(evaluationData: {classroomId: number, cycleId: number, areaId: number}) {
        return this.post('/evaluation', evaluationData);
    }

    public updateEvaluation(id: string, updatedData: {classroomId?: number, cycleId?: number, areaId?: number, result?: number}) {
        return this.patch(`/evaluation/${id}`, updatedData);
    }

    public deleteEvaluation(id: string) {
        return this.delete(`/evaluation/${id}`);
    }

    public getEvaluationById(id: string) {
        return this.get(`/evaluation/${id}`);
    }

    public analizeIndicatorsCompliance(moodleCourseId: number, token: string, cycleId: number, areaId: number, evaluationId: number) {
        return this.post(`/evaluation/analyze-compliance?moodleCourseId=${moodleCourseId}&token=${token}&cycleId=${cycleId}&areaId=${areaId}&evaluationId=${evaluationId}`);
    }

    public updateEvaluatedIndicator(id: string, updatedData: { result: number, observation?: string }) {
        return this.patch(`/evaluated-indicator/${id}`, updatedData);
    }

    public getWeightedAverageAreaByCycle(classroomId: number) {
        return this.get(`/evaluation/${classroomId}/weighted-averages`);
    }

    /*
     * Otros métodos específicos
     */
    public getUsersInMoodle() {
        const moodleToken = AuthService.getTokenMoodle();
        return this.get(`/user/moodle/all?token=${moodleToken}`);
    }

    public getClassroomsInMoodle(searchData: {field: string, value: string}, moodleToken: string) {
        //const moodleToken = AuthService.getTokenMoodle();
        const dataWithToken = { ...searchData, token: moodleToken };
        return this.post('/classroom/moodle-search', dataWithToken);
    }

    /*
     * Métodos específicos para administrar formularios
     */
    public getForms() {
        return this.get(`/form`);
    }

    public getFormsByClassroom(classroomId: string) {
        return this.get(`/form/classroom/${classroomId}`);
    }

    public getFormById(formId: string) {
        return this.get(`/form/${formId}`);
    }

    public addForm(formData: FormDataProps) {
        return this.post('/form', formData);
    }

    public updateForm(id: string, updatedData: FormDataProps) {
        return this.patch(`/form/${id}`, updatedData);
    }

    public deleteForm(id: string) {
        return this.delete(`/form/${id}`);
    }

    public addObservation(id: number, addObservation: { observation: string }) {
        return this.patch(`/form/${id}/observation`, addObservation);
    }

    /*
     * Métodos específicos para administrar valoración de aula virtual
     */
    public getAssessment() {
        return this.get(`/assessment`);
    }

    public getAssessmentByForm(formId: string) {
        return this.get(`/assessment/form/${formId}`);
    }

    public getAssessmentById(assessmentId: string) {
        return this.get(`/assessment/${assessmentId}`);
    }

    public addAssessment(assessmentData: FormData | AssessmentData) {
        const isFormData = assessmentData instanceof FormData; 
        return this.request('/assessment', 'POST', assessmentData, isFormData ? undefined : 'application/json');
    }

    public addAssessmentByForm(assessmentData: { formId: string }) {
        return this.post('/assessment/form', assessmentData);
    }

    public updateAssessment(id: string, updatedData: FormData | AssessmentData) {
        const isFormData = updatedData instanceof FormData;
        return this.request(`/assessment/${id}`, 'PATCH', updatedData, isFormData ? undefined : 'application/json');
    }

    public deleteAssessment(id: string) {
        return this.delete(`/assessment/${id}`);
    }

    /**
     * Métodos especificos para la creación del cuadro resumen
     */
    public addSummary(formId: number) {
        return this.post(`/summary/calculate/form/${formId}`);
    }

    public getSummaries(formId: number) {
        return this.get(`/summary/form/${formId}`);
    }

    /*
     * Métodos específicos para autoridades
     */
    public getAuthorities() {
        return this.get('/authority');
    }

    public addAuthority(authorityData: FormData) {
        return this.post('/authority', authorityData);
    }

    public updateAuthority(id: string, updatedData: FormData) {
        return this.patch(`/authority/${id}`, updatedData);
    }

    public getAuthorityById(id: string) {
        return this.get(`/authority/${id}`);
    }

    public deleteAuthority(id: string) {
        return this.delete(`/authority/${id}`);
    }

    /*
     * Métodos específicos para certificaciones
     */
    public getCertificationsByClassroom(classroomId: string) {
        return this.get(`/certification/classroom/${classroomId}`);
    }

    public addCertification(certificationData: FormData) {
        return this.post('/certification', certificationData);
    }

    public updateCertification(id: string, updatedData: CertificationFormData) {
        return this.patch(`/certification/${id}`, updatedData);
    }

    public getCertificationById(id: string) {
        return this.get(`/certification/${id}`);
    }

    public deleteCertification(id: string) {
        return this.delete(`/certification/${id}`);
    }

    public getPublicCertificationByClassroom(classroomId: string) {
        return this.get(`/certification/public/classroom/${classroomId}`, false);
    }

    /**
     * Métodos específicos para gestionar servidor
     */ 
    public getPlatforms() {
        return this.get('/platform');
    }

    public selectPlatform(id: string) {
        return this.post(`/platform/${id}/set-environment`);
    }

    /**
     * Métodos específicos para gestionar anexos de matriz
     */ 
    public getAttachmentsByClassroom(classroomId: string) {
        return this.get(`/attach/classroom/${classroomId}`);
    }

    public getAttachmentById(id: string) {
        return this.get(`/attach/${id}`);
    }

    public deleteAttachment(id: string) {
        return this.delete(`/attach/${id}`);
    }

    public updateAttachment(id: string, updateData: { classroomId: number, courseId: number, token: string}) {
        return this.patch(`/attach/${id}`, updateData);
    }

    public addAttachment(createData: { classroomId: number, courseId: number, token: string}) {
        return this.post('/attach', createData);
    }
}

export default new ApiService();

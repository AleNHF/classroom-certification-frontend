import AuthService from '../services/authService';
import { AssessmentData, FormDataProps, Team, UserProps } from '../types';
import { ClassroomStatus } from '../utils/enums/classroomStatus';

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
    }

    private async request(
        endpoint: string,
        method: string,
        body?: any,
        contentType: string = 'application/json'
    ) {
        const url = `${this.baseUrl}${endpoint}`;
        const token = AuthService.getToken();
        const headers: HeadersInit = {
            'Content-Type': contentType,
        };

        // Agregar token de autenticación si está presente
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options: RequestInit = {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        };

        // Manejo de contenido `FormData` para el personal
        if (body instanceof FormData) {
            delete headers['Content-Type']; // Dejar que el navegador maneje los headers
            options.body = body;
        }

        try {
            const response = await fetch(url, options);

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
    private get(endpoint: string) {
        return this.request(endpoint, 'GET');
    }

    private post(endpoint: string, data: any) {
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

    public addPersonal(personalData: FormData) {
        return this.post('/personal', personalData);
    }

    public updatePersonal(id: string, updatedData: FormData) {
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

    /*
     * Otros métodos específicos
     */
    public getUsersInMoodle() {
        const moodleToken = AuthService.getTokenMoodle();
        return this.get(`/user/moodle/all?token=${moodleToken}`);
    }

    public getClassroomsInMoodle(searchData: {field: string, value: string}) {
        const moodleToken = AuthService.getTokenMoodle();
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

    public addAssessment(assessmentData: AssessmentData) {
        return this.post('/assessment', assessmentData);
    }

    public addAssessmentByForm(assessmentData: { formId: string }) {
        return this.post('/assessment/form', assessmentData);
    }

    public updateAssessment(id: string, updatedData: AssessmentData) {
        return this.patch(`/assessment/${id}`, updatedData);
    }

    public deleteAssessment(id: string) {
        return this.delete(`/assessment/${id}`);
    }
}

export default new ApiService();

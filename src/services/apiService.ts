import AuthService from '../services/authService';
import { Team } from '../types/teamTypes';
import { UserProps } from '../types/userTypes';

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
     * Otros métodos específicos
     */
    public getUsersInMoodle() {
        const moodleToken = AuthService.getTokenMoodle();
        return this.get(`/user/moodle/all?token=${moodleToken}`);
    }
}

export default new ApiService();

import AuthService from '../services/authService';
import { UserProps } from '../types/userTypes';

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
    }

    private async request(endpoint: string, options: RequestInit) {
        const url = `${this.baseUrl}${endpoint}`;
        const token = AuthService.getToken();

        // Agregar token de autenticación si está presente
        if (token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
            };
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

    private getHeaders(contentType: string = 'application/json') {
        return {
            'Content-Type': contentType,
        };
    }

    /*
     * Obtener listado de usuarios
     */
    public async getUsers() {
        return this.request('/user', {
            method: 'GET',
            headers: this.getHeaders(),
        });
    }

    /*
     * Registrar usuario
     */
    public async addUser(userData: UserProps) {
        return this.request('/user', {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(userData),
        });
    }

    /*
     * Editar usuario
     */
    public async updateUser(id: string, updatedData: UserProps) {
        return this.request(`/user/${id}`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify(updatedData),
        });
    }

    /*
     * Eliminar usuario
     */
    public async deleteUser(id: string) {
        return this.request(`/user/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
    }

    /*
     * Obtener listado de usuarios de Moodle
     */
    public async getUsersInMoodle() {
        const moodleToken = AuthService.getTokenMoodle();
        return this.request(`/user/moodle/all?token=${moodleToken}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
    }

    /*
     * Obtener listado de personal
     */
    public async getPersonal() {
        return this.request('/personal', {
            method: 'GET',
            headers: this.getHeaders(),
        });
    }

    /*
     * Registrar personal
     */
    public async addPersonal(personalData: FormData) {
        return this.request('/personal', {
            method: 'POST',
            //headers: this.getHeaders(),
            body: personalData,
        });
    }

    /*
     * Editar personal
     */
    public async updatePersonal(id: string, updatedData: FormData) {
        return this.request(`/personal/${id}`, {
            method: 'PATCH',
            //headers: this.getHeaders(),
            body: updatedData,
        });
    }

    /*
     * Eliminar personal
     */
    public async deletePersonal(id: string) {
        return this.request(`/personal/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
    }
}

export default new ApiService();

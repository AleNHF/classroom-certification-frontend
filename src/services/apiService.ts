import AuthService from '../services/authService';

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
    }

    private async request(endpoint: string, options: RequestInit) {
        const url = `${this.baseUrl}${endpoint}`;
        const token = AuthService.getToken();

        if (token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
            };
        }

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('ApiService error:', error);
            throw error;
        }
    }

    // Obtener lista de personal
    public async getPersonnel() {
        return this.request('/personnel', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // Agregar nuevo personal
    public async addPersonnel(personnelData: FormData) {
        return this.request('/personnel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(personnelData),
        });
    }

    // Editar personal
    public async updatePersonnel(id: string, updatedData: { name?: string; position?: string }) {
        return this.request(`/personnel/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
    }

    // Eliminar personal
    public async deletePersonnel(id: string) {
        return this.request(`/personnel/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export default new ApiService();
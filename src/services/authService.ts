class AuthService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
    }

    private async request(endpoint: string, options: RequestInit) {
        const url = `${this.baseUrl}${endpoint}`;

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API error:', error);
            throw error;
        }
    }

    // Login
    public async login(username: string, password: string) {
        return this.request('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
    }

    public logout() {
        ['token', 'username', 'moodle_token', 'name', 'role'].forEach((key) => localStorage.removeItem(key));
    }

    public getToken() {
        return localStorage.getItem('token');
    }

    public getRole() {
        return localStorage.getItem('role');
    }

    public getTokenMoodle() {
        return localStorage.getItem('moodle_token');
    }

    /*
     * Obtener listado de roles
     */
    public async getRoles() {
        return this.request('/role', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export default new AuthService(); 

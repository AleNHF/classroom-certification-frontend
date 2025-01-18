import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo_certification.png';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { validateLogin } from '../../utils/validations/validateLogin';

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { handleLogin, isAuthenticated } = useAuthContext();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const error = validateLogin(username, password);
        if (error) {
            setErrorMessage(error);
            return;
        }

        setLoading(true);
        try {
            await handleLogin(username, password);
        } catch (error) {
            setErrorMessage('Error en la autenticación, por favor intente de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated, navigate]);

    return (
        <form className="bg-white p-6 md:p-8 shadow-md rounded-lg w-full" onSubmit={handleSubmit}>
            <img
                src={logo}
                alt="Certification Illustration"
                className="w-full h-24 md:h-32 object-contain mb-4"
            />
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

            {/* Usuario */}
            <div className="mb-4">
                <label
                    htmlFor="username"
                    className="block text-gray-700 text-sm font-medium mb-2"
                >
                    Usuario
                </label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary-red rounded-md focus:outline-none focus:ring-2 focus:ring-border-red-color"
                    placeholder="Ingrese su usuario"
                />
            </div>

            {/* Contraseña */}
            <div className="mb-6">
                <label
                    htmlFor="password"
                    className="block text-gray-700 text-sm font-medium mb-2"
                >
                    Contraseña
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary-red rounded-md focus:outline-none focus:ring-2 focus:ring-border-red-color"
                    placeholder="Ingrese su contraseña"
                />
            </div>

            {/* Botón */}
            <button
                type="submit"
                className="w-full bg-primary-red-color text-white font-medium py-2 px-4 rounded-md hover:bg-red-500"
                disabled={loading}>
                {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
        </form>
    );
};

export default LoginForm;


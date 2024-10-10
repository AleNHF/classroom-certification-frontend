import React from 'react';
import error from '../../assets/undraw_fixing_bugs_w7gi.svg';

interface ErrorPageProps {
    message?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message = "Por favor, intenta de nuevo más tarde." }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <img
                src={error}
                alt="Error"
                className="w-64 h-64 md:w-96 md:h-96 object-contain mb-4"
            />
            <h1 className="text-xl text-red-600">¡Vaya! Algo salió mal.</h1>
            <p className="text-lg text-gray-700">{message}</p> {/* Mensaje pasado como prop */}
        </div>
    );
};

export default ErrorPage;

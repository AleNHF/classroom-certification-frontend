import React from 'react';
import noaccess from '../../assets/403 Error Forbidden-rafiki.svg';

const NoAccessPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <img
                src={noaccess}
                alt="No Access"
                className="w-64 h-64 md:w-96 md:h-96 object-contain mb-4"
            />
            <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">
                No tienes permiso para acceder a esta página.
            </h1>
            <p className="text-center text-gray-600">
                Si crees que esto es un error, contacta al administrador del sistema.
            </p>
        </div>
    );
};

export default NoAccessPage;

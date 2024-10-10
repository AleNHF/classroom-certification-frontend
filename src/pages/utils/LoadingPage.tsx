import React from 'react';
import loading from '../../assets/undraw_in_thought_re_qyxl.svg';

const LoadingPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <img
                src={loading}
                alt="Loading"
                className="w-64 h-64 md:w-96 md:h-96 object-contain mb-4"
            />
            <p className="text-center text-gray-600">
                Cargando, por favor espera...
            </p>
        </div>
    );
};

export default LoadingPage;

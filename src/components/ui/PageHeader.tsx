import React from 'react';
import { useNavigate } from 'react-router-dom'; // Si estás usando react-router-dom para la navegación.

interface PageHeaderProps {
    title: string;
    onBack?: () => void;  // Una función opcional para manejar el evento de volver atrás
}

const PageHeaderComponent: React.FC<PageHeaderProps> = ({ title, onBack }) => {
    const navigate = useNavigate(); // Para navegar a la página anterior

    const handleBackClick = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1); // Retrocede una página en el historial
        }
    };

    return (
        <div className="flex items-center justify-between w-full my-10">
            <div className="flex items-center">
                <button onClick={handleBackClick} className="mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>

                </button>
                <h1 className="text-2xl font-medium">{title}</h1>
            </div>
        </div>
    );
};

export default PageHeaderComponent;

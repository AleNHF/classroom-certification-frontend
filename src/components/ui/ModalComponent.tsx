import React, { ReactNode } from 'react';

interface ModalComponentProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    onSubmit?: () => void;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
    isOpen,
    onClose,
    title,
    children,
    onSubmit,
    primaryButtonText = "ACEPTAR",
    secondaryButtonText = "CANCELAR",
    size = 'medium',
    loading = false
}) => {
    if (!isOpen) return null;

    // Clases de tamaño dinámico
    const sizeClass = {
        small: 'w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4',
        medium: 'w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/2 xl:w-1/3',
        large: 'w-11/12 sm:w-4/5 md:w-3/4 lg:w-3/4 xl:w-2/3'
    }[size];

    const buttonLayoutClass = size === 'large' ? 'flex-row space-x-4 justify-end' : 'flex-col space-y-2';

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className={`bg-white p-6 rounded-lg shadow-lg max-h-full overflow-y-auto ${sizeClass}`}>
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <div className="h-px bg-gray-200 w-full mb-4"></div>
                <div>{children}</div> {/* Contenido dinámico aquí */}
                <div className={`flex mt-10 ${buttonLayoutClass}`}>
                    {onSubmit && (
                        <button
                            type="button"
                            className={`bg-primary-red-color text-white w-auto px-4 py-2 rounded-md hover:bg-red-400 
                                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} // Estilos deshabilitados
                            onClick={onSubmit}
                            disabled={loading}
                        >
                            {loading ? 'CARGANDO...' : primaryButtonText}
                        </button>
                    )}
                    <button
                        type="button"
                        className="bg-optional-button-color text-white w-auto px-4 py-2 rounded-md hover:bg-gray-700"
                        onClick={onClose}
                    >
                        {secondaryButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalComponent;

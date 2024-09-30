import React, { ReactNode } from 'react';

interface ModalComponentProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    onSubmit?: () => void; 
    primaryButtonText?: string; 
    secondaryButtonText?: string; 
}

const ModalComponent: React.FC<ModalComponentProps> = ({
    isOpen,
    onClose,
    title,
    children,
    onSubmit,
    primaryButtonText = "Aceptar",
    secondaryButtonText = "Cancelar"
}) => {
    if (!isOpen) return null; // No renderizar si el modal no está abierto

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <div>{children}</div> {/* Contenido dinámico aquí */}
                <div className="flex justify-end mt-10">
                    <button
                        type="button"
                        className="bg-optional-button-color text-white px-4 py-2 rounded-md mr-2"
                        onClick={onClose}
                    >
                        {secondaryButtonText}
                    </button>
                    {onSubmit && (
                        <button
                            type="button"
                            className="bg-primary-red-color text-white px-4 py-2 rounded-md"
                            onClick={onSubmit}
                        >
                            {primaryButtonText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalComponent;

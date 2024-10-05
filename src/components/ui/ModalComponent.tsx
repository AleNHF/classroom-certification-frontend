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
    primaryButtonText = "ACEPTAR",
    secondaryButtonText = "CANCELAR"
}) => {
    if (!isOpen) return null; 

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/2 xl:w-1/3 max-h-full overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <div>{children}</div> {/* Contenido dinámico aquí */}
                <div className="flex flex-col mt-10 space-y-2"> 
                    {onSubmit && (
                        <button
                            type="button"
                            className="bg-red-500 text-white w-full px-4 py-2 rounded-md"
                            onClick={onSubmit}
                        >
                            {primaryButtonText}
                        </button>
                    )}
                    <button
                        type="button"
                        className="bg-optional-button-color text-white w-full px-4 py-2 rounded-md"
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

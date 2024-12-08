import React, { useEffect } from 'react';
import notifyImage from '../../assets/undraw_notify_re_65on.svg';

interface WarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    size?: 'small' | 'medium' | 'large';
    autoCloseDelay?: number; // Tiempo en milisegundos para el cierre automático
}

const WarningModal: React.FC<WarningModalProps> = ({
    isOpen,
    onClose,
    size = 'medium',
    autoCloseDelay = 3000,
}) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDelay);
            return () => clearTimeout(timer); // Limpia el temporizador si se desmonta
        }
    }, [isOpen, onClose, autoCloseDelay]);

    if (!isOpen) return null;

    // Clases de tamaño dinámico
    const sizeClass = {
        small: 'w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4',
        medium: 'w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/2 xl:w-1/3',
        large: 'w-11/12 sm:w-4/5 md:w-3/4 lg:w-3/4 xl:w-2/3',
    }[size];

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            aria-live="assertive"
        >
            <div
                className={`bg-white p-6 rounded-lg shadow-lg max-h-full overflow-y-auto transition-transform transform scale-100 ${sizeClass}`}
            >
                <div className="flex flex-col items-center">
                    <img
                        src={notifyImage}
                        alt="Advertencia"
                        className="w-64 h-64 mb-6 object-contain" // Tamaño ajustado
                    />
                    <p className="text-center text-lg font-semibold text-gray-800">
                        Por favor, selecciona un servidor para continuar con la operación.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WarningModal;
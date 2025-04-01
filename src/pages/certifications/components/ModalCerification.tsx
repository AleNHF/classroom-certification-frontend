import emptyImage from '../../../assets/undraw_void_-3-ggu.svg';

interface Props {
    message: string;
    onClose: () => void;
    size?: 'small' | 'medium' | 'large';
}

const ModalCertification: React.FC<Props> = ({ message, onClose, size = 'medium', }) => {
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
                        src={emptyImage}
                        alt="Advertencia"
                        className="w-64 h-64 mb-6 object-contain" // Tamaño ajustado
                    />
                    <p className="text-center">
                        {message}
                    </p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 mt-4 bg-primary-red-color text-white rounded-md shadow hover:bg-red-400"
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalCertification;
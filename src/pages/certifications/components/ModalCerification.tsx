interface Props {
    message: string;
    onClose: () => void;
}

const ModalCertification: React.FC<Props> = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">{message}</h2>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-primary-red-color text-white rounded-md shadow hover:bg-red-400"
                >
                    Aceptar
                </button>
            </div>
        </div>
    );
};

export default ModalCertification;
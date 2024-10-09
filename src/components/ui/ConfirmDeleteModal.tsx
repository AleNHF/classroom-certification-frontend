
import notifyImage from '../../assets/undraw_notify_re_65on.svg';
import ModalComponent from './ModalComponent';

export interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void; 
    onSubmit: () => void; 
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    return (
        <ModalComponent
            isOpen={isOpen}
            onClose={onClose}
            title="Confirmar eliminación"
            primaryButtonText="ELIMINAR"
            onSubmit={onSubmit}
        >
            <div className="flex flex-col items-center">
                <img
                    src={notifyImage}
                    alt="Advertencia"
                    className="w-48 h-48 mb-4"
                />
                <p>¿Estás seguro de que deseas eliminar este usuario?</p>
            </div>
        </ModalComponent>
    );
};

export default ConfirmDeleteModal;


import { ModalComponent } from '..';
import notifyImage from '../../assets/undraw_notify_re_65on.svg';

export interface ConfirmDeleteModalProps {
    message: string;
    isOpen: boolean;
    onClose: () => void; 
    onSubmit: () => void; 
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    message,
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
                <p className="text-center">{message}</p>
            </div>
        </ModalComponent>
    );
};

export default ConfirmDeleteModal;

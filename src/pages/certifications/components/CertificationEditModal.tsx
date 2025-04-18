import React from 'react';
import { ModalComponent } from "../../../components";
import GeneralDataSection from "./GeneralData";
import EvaluationDataSection from "./EvaluationData";
import { CertificationFormData } from '../../../types';

interface CertificationEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    editData: CertificationFormData;
    setEditData: React.Dispatch<React.SetStateAction<CertificationFormData | null>>;
    classroom: any;
    evaluators: any[];
    onSave: () => void;
    formErrors: Record<string, string>;
}

const CertificationEditModal: React.FC<CertificationEditModalProps> = ({
    isOpen,
    onClose,
    editData,
    setEditData,
    classroom,
    evaluators,
    onSave,
    formErrors
}) => {
    return (
        <ModalComponent
            isOpen={isOpen}
            onClose={onClose}
            title={classroom.name}
            primaryButtonText="ACTUALIZAR"
            onSubmit={onSave}
            size='large'
        >
            <form className="space-y-6 w-full">
                <GeneralDataSection
                    formData={editData as CertificationFormData}  
                    setFormData={setEditData as React.Dispatch<React.SetStateAction<CertificationFormData>>}  
                    formErrors={formErrors}
                />

                {/* Datos generales de la evaluación */}
                <EvaluationDataSection
                    formData={editData as CertificationFormData}
                    setFormData={setEditData as React.Dispatch<React.SetStateAction<CertificationFormData>>}
                    evaluators={evaluators}
                    formErrors={formErrors}
                />
            </form>
        </ModalComponent>
    );
};

export default CertificationEditModal;
import React from 'react';
import { Assessment } from '../../../types';
import { ModalComponent } from '../../../components';

interface ViewAssessmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    assessment: Assessment | null;
}

const ViewAssessmentModal: React.FC<ViewAssessmentModalProps> = ({ isOpen, onClose, assessment }) => (
    <ModalComponent isOpen={isOpen} onClose={onClose} title="Detalles de la Valoración" size = 'large'>
        {assessment && (
            <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Información General</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Área</label>
                            <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                {assessment.area?.name}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                {assessment.description}
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Detalles Adicionales</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Requisitos</label>
                            <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                {assessment.requeriments?.[0]?.name || 'Sin requisitos'}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Conclusiones/Recomendaciones</label>
                            <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                {assessment.conclusions}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {assessment.assessment && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Valoración</h3>
                    <div className="bg-blue-50 p-4 rounded-md">
                        <p className="text-lg font-medium text-blue-900">
                            Resultado: {assessment.assessment}
                        </p>
                    </div>
                </div>
            )}
        </div>
        )}
    </ModalComponent>
);

export default ViewAssessmentModal;

import React from 'react';
import { Assessment } from '../../../types';
import { ModalComponent } from '../../../components';

interface ViewAssessmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    assessment: Assessment | null;
}

const ViewAssessmentModal: React.FC<ViewAssessmentModalProps> = ({ isOpen, onClose, assessment }) => (
    <ModalComponent isOpen={isOpen} onClose={onClose} title="Detalles de la Valoración" size='large'>
        {assessment && (
            <div className="space-y-6">
                <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Área</label>
                        <p className="text-sm font-semibold text-gray-900">
                            {assessment.area?.name}
                        </p>
                    </div>
                    {assessment.assessment && (
                        <div className="text-right">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Valoración</label>
                            <p className="text-lg font-bold text-blue-700">
                                {assessment.assessment}
                            </p>
                        </div>
                    )}
                </div>

                <div className="bg-white border border-gray-200 rounded-md p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <p className="text-sm text-gray-900 break-words whitespace-pre-wrap">
                        {assessment.description || 'Sin descripción'}
                    </p>
                </div>

                {assessment.conclusions && (
                    <div className="bg-white border border-gray-200 rounded-md p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Conclusiones/Recomendaciones</label>
                        <p className="text-sm text-gray-900 break-words whitespace-pre-wrap">
                            {assessment.conclusions}
                        </p>
                    </div>
                )}

                {assessment.requeriments && assessment.requeriments.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-md">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700">Requisitos</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {assessment.requeriments.map((req, index) => (
                                <div key={req.id || index} className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{req.name}</p>
                                        <a 
                                            href={req.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-600 hover:underline break-all"
                                        >
                                            {req.url}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )}
    </ModalComponent>
);

export default ViewAssessmentModal;

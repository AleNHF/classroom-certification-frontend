import React from 'react';
import { Form } from '../../../types';
import { ModalComponent } from '../../../components';

interface ViewFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    form: Form | null;
}

const ViewFormModal: React.FC<ViewFormModalProps> = ({ isOpen, onClose, form }) => (
    <ModalComponent isOpen={isOpen} onClose={onClose} title="Detalles de la Valoración" size='large'>
        {form && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Información General</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                    {form.name}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Servidor</label>
                                <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                    {form.server}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Autor de Contenido</label>
                                <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                    {form.author}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Detalles Académicos</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Carrera</label>
                                <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                    {form.career}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Director/a</label>
                                <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                    {form.director}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Responsable DEDTE-F</label>
                                <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                    {form.responsible}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {form.finalGrade && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Resultado Final</h3>
                        <div className="bg-blue-50 p-4 rounded-md">
                            <p className="text-lg font-medium text-blue-900">
                                Calificación Final: {form.finalGrade}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        )}
    </ModalComponent>
);

export default ViewFormModal;

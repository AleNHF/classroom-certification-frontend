import React, { useCallback, useState } from 'react';
import { validatePersonalForm } from '../../utils/validations/validatePersonalForm';
import { ActionButtonComponent, PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal, HeaderComponent, AlertComponent, PaginationComponent } from '../../components';
import { ErrorPage } from '../utils';
import { usePersonal } from '../../hooks';

const headers = ["Nombre", "Cargo", "Acciones"];

interface PersonalForm {
    id: string;
    name: string;
    position: string;
    signature: File | null;
}

const INITIAL_PERSONAL_FORM: PersonalForm = {
    id: '',
    name: '',
    position: '',
    signature: null as File | null
};

const PersonalPage: React.FC = () => {
    // Estados de UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    // Estados de Datos
    const [personalForm, setPersonalForm] = useState<PersonalForm>(INITIAL_PERSONAL_FORM);
    const [personalToDelete, setPersonalToDelete] = useState<{ id: string | null, name: string | null }>({ id: null, name: null });

    // Estados de validación y errores
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [paginatedItems, setPaginatedItems] = useState<any[]>([]);

    const {
        personalList,
        error,
        successMessage,
        addPersonal,
        updatePersonal,
        deletePersonal
    } = usePersonal();

    // Manejadores de modal
    const handleAddClick = useCallback(() => {
        setPersonalForm(INITIAL_PERSONAL_FORM);
        setIsModalOpen(true);
        setFormErrors({});
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        resetPersonalForm();
    }, []);

    const resetPersonalForm = () => {
        setPersonalForm(INITIAL_PERSONAL_FORM);
        setFormErrors({});
    };

    // Manejador de submit del formulario
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file && file.type.startsWith('image/')) {
            setPersonalForm(prev => ({ ...prev, signature: file }));
            setFormErrors(prev => ({ ...prev, signature: '' }));
        } else {
            setFormErrors(prev => ({ ...prev, signature: 'Por favor, sube un archivo de imagen válido.' }));
        }
    };

    const handleSubmit = useCallback(async () => {
        const validation = validatePersonalForm(personalForm);
        if (!validation.isValid) {
            setFormErrors(validation.errors);
            return;
        }

        const formData = new FormData();
        formData.append('name', personalForm.name);
        formData.append('position', personalForm.position);
        if (personalForm.signature) {
            formData.append('signature', personalForm.signature);
        }

        try {
            personalForm.id
                ? await updatePersonal(personalForm.id, formData)
                : await addPersonal(formData);
            handleCloseModal();
        } catch (error) {
            console.error('Error al añadir/actualizar personal:', error);
        }
    }, [personalForm, addPersonal, updatePersonal]);

    // Manejadores de eliminación
    const handleDelete = useCallback((id: string, name: string) => {
        setPersonalToDelete({ id, name });
        setIsConfirmDeleteOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (personalToDelete.id) {
            try {
                await deletePersonal(personalToDelete.id);
            } catch (error) {
                console.error('Error al eliminar personal:', error);
            } finally {
                setPersonalToDelete({ id: null, name: null });
                setIsConfirmDeleteOpen(false);
            }
        }
    }, [personalToDelete.id, deletePersonal]);

    // Renderizado de filas de la tabla
    const renderTableRows = useCallback(() => {
        return paginatedItems.map((personal: any) => ({
            Nombre: personal.name,
            Cargo: personal.position,
            Acciones: (
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <ActionButtonComponent
                        label="EDITAR"
                        onClick={() => {
                            setPersonalForm({
                                id: personal.id,
                                name: personal.name,
                                position: personal.position,
                                signature: personal.signature
                            });
                            setIsModalOpen(true);
                        }}
                        bgColor="bg-secondary-button-color hover:bg-blue-800"
                    />
                    <ActionButtonComponent
                        label="ELIMINAR"
                        onClick={() => handleDelete(personal.id, personal.name)}
                        bgColor="bg-primary-red-color hover:bg-red-400"
                    />
                </div>
            )
        }));

    }, [paginatedItems, handleDelete]);

    //if (loading) return <LoadingPage />;
    if (error) return <ErrorPage message={error} />;

    return (
        <div className="flex flex-col items-center justify-start bg-white min-h-screen">
            <HeaderComponent />
            <div className="flex flex-col items-center w-full max-w-6xl px-4">
                <PageHeaderComponent title='GESTIONAR PERSONAL TÉCNICO' />
                {successMessage && (
                    <AlertComponent
                        type="success"
                        message={successMessage}
                        className="mb-4 w-full"
                    />
                )}

                {formErrors.submit && (
                    <AlertComponent
                        type="error"
                        message={formErrors.submit}
                        className="mb-4 w-full"
                    />
                )}
                <AddButtonComponent onClick={() => handleAddClick()} />
                <div className="overflow-x-auto w-full">
                    <TableComponent headers={headers} rows={renderTableRows()} />
                </div>
                <PaginationComponent
                    items={personalList}
                    onPageItemsChange={setPaginatedItems}
                />
            </div>

            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={personalForm.id ? 'Editar Personal' : 'Nuevo Personal Técnico'}
                primaryButtonText={personalForm.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleSubmit}
                size="medium"
            >
                <form className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={personalForm.name}
                            onChange={(e) => setPersonalForm(prev => ({ ...prev, name: e.target.value }))}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                        {formErrors.name && <p className="text-red-600 text-sm">{formErrors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Cargo</label>
                        <select
                            value={personalForm.position}
                            onChange={(e) => setPersonalForm(prev => ({ ...prev, position: e.target.value }))}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        >
                            <option value="">Selecciona un cargo</option>
                            <option value="Editor Audiovisual">Editor Audiovisual</option>
                            <option value="Editor Gráfico">Editor Gráfico</option>
                            <option value="Integrador TIC">Integrador TIC</option>
                            <option value="Diseñador Instruccional">Diseñador Instruccional</option>
                        </select>
                        {formErrors.position && <p className="text-red-600 text-sm">{formErrors.position}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Firma (Subir imagen)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                        {formErrors.signature && <p className="text-red-600 text-sm">{formErrors.signature}</p>}
                    </div>
                </form>
            </ModalComponent>

            <ConfirmDeleteModal
                message={`¿Estás seguro de que deseas eliminar al personal "${personalToDelete.name}"?`}
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onSubmit={handleConfirmDelete}
            />
        </div>
    );
};

export default PersonalPage;
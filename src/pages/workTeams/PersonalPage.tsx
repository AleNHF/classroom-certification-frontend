import React, { useEffect, useState } from 'react';
import { validatePersonalForm } from '../../utils/validations/validatePersonalForm';
import { ActionButtonComponent, PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal, HeaderComponent } from '../../components';
import { LoadingPage, ErrorPage } from '../utils';
import { usePersonal } from '../../hooks';

const headers = ["Nombre", "Cargo", "Acciones"];

const PersonalPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [personalForm, setPersonalForm] = useState({ id: '', name: '', position: '', signature: null as File | null });
    const [personalToDelete, setPersonalToDelete] = useState<{ id: string | null, name: string | null }>({ id: null, name: null });
    const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);

    const { personalList, loading, error, addPersonal, updatePersonal, deletePersonal } = usePersonal();

    const resetPersonalForm = () => {
        setPersonalForm({ id: '', name: '', position: '', signature: null });
        setErrorMessages({});
    };

    const handleOpenModal = (personal?: any) => {
        if (personal) {
            setPersonalForm({
                id: personal.id,
                name: personal.name,
                position: personal.position,
                signature: personal.signature
            });
        } else {
            resetPersonalForm();
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetPersonalForm();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file && file.type.startsWith('image/')) {
            setPersonalForm(prev => ({ ...prev, signature: file }));
            setErrorMessages(prev => ({ ...prev, signature: '' }));
        } else {
            setErrorMessages(prev => ({ ...prev, signature: 'Por favor, sube un archivo de imagen válido.' }));
        }
    };

    const handleAddOrUpdate = async () => {
        const validation = validatePersonalForm(personalForm);
        if (!validation.isValid) {
            setErrorMessages(validation.errors);
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
    };

    const handleDelete = (id: string, name: string) => {
        setPersonalToDelete({ id, name });
        setIsConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
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
    };

    const rows = personalList.map((personal: any) => ({
        Nombre: personal.name,
        Cargo: personal.position,
        Acciones: (
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <ActionButtonComponent 
                    label="EDITAR"
                    onClick={() => handleOpenModal(personal)}
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

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); 

        return () => clearTimeout(timer);
    }, []);

    if (loading || isLoading) return <LoadingPage />;
    if (error) return <ErrorPage message={error} />;

    return (
        <div className="flex flex-col items-center justify-start bg-white min-h-screen">
            <HeaderComponent />
            <div className="flex flex-col items-center w-full max-w-6xl px-4">
                <PageHeaderComponent title='GESTIONAR PERSONAL TÉCNICO' />
                {error && (
                    <div className="bg-red-200 text-red-600 border border-red-400 rounded-md p-3 mb-4 w-full">
                        {error}
                    </div>
                )}
                <AddButtonComponent onClick={() => handleOpenModal()} />
                <div className="overflow-x-auto w-full">
                    <TableComponent headers={headers} rows={rows} />
                </div>
            </div>

            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={personalForm.id ? 'Editar Personal' : 'Nuevo Personal Técnico'}
                primaryButtonText={personalForm.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleAddOrUpdate}
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
                        {errorMessages.name && <p className="text-red-600 text-sm">{errorMessages.name}</p>}
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
                            <option value="Integrador">Integrador</option>
                            <option value="Diseñador">Diseñador</option>
                            <option value="Diseñador instruccional">Diseñador instruccional</option>
                        </select>
                        {errorMessages.position && <p className="text-red-600 text-sm">{errorMessages.position}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Firma (Subir imagen)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                        {errorMessages.signature && <p className="text-red-600 text-sm">{errorMessages.signature}</p>}
                    </div>
                </form>
            </ModalComponent>

            <ConfirmDeleteModal
                message={`¿Estás seguro de que deseas eliminar al personal "${personalToDelete.name}"?`}
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onSubmit={confirmDelete}
            />
        </div>
    );
};

export default PersonalPage;
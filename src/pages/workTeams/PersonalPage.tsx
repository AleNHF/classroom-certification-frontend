import React, { useState } from 'react';
import HeaderComponent from '../../components/layout/HeaderComponent';
import TableComponent from '../../components/ui/TableComponent';
import AddButtonComponent from '../../components/ui/AddButtonComponent';
import ModalComponent from '../../components/ui/ModalComponent';
import usePersonal from '../../hooks/workTeams/usePersonal';
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal';
import PageHeaderComponent from '../../components/ui/PageHeader';
import { validatePersonalForm } from '../../utils/validatePersonalForm';
import ActionButtonComponent from '../../components/ui/ActionButtonComponent';
import LoadingPage from '../utils/LoadingPage';
import ErrorPage from '../utils/ErrorPage';

const headers = ["Nombre", "Cargo", "Acciones"];

const PersonalPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [personalForm, setPersonalForm] = useState({ id: '', name: '', position: '', signature: null as File | null });
    const [personalToDelete, setPersonalToDelete] = useState<string | null>(null);
    const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

    const {
        personalList,
        loading,
        error,
        addPersonal,
        updatePersonal,
        deletePersonal
    } = usePersonal();

    const resetPersonalForm = () => {
        setPersonalForm({ id: '', name: '', position: '', signature: null });
        setErrorMessages({});
    };

    const handleAddClick = () => {
        resetPersonalForm();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetPersonalForm();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file && file.type.startsWith('image/')) {
            setPersonalForm({ ...personalForm, signature: file });
            setErrorMessages((prev) => ({ ...prev, signature: '' })); // Clear previous error
        } else {
            alert("Por favor, sube un archivo de imagen válido.");
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
        formData.append('signature', personalForm.signature as File); // Asserting because we know it's valid

        try {
            personalForm.id
                ? await updatePersonal(personalForm.id, formData)
                : await addPersonal(formData);

            handleCloseModal();
        } catch (error) {
            console.error('Error al añadir/actualizar personal:', error);
        }
    };

    const handleDelete = (id: string) => {
        setPersonalToDelete(id);
        setIsConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (personalToDelete) {
            try {
                await deletePersonal(personalToDelete);
            } catch (error) {
                console.error('Error al eliminar personal:', error);
            } finally {
                setPersonalToDelete(null);
                setIsConfirmDeleteOpen(false);
            }
        }
    };

    const handleEdit = (personal: any) => {
        setPersonalForm({
            id: personal.id,
            name: personal.name,
            position: personal.position,
            signature: personal.signature
        });
        setIsModalOpen(true);
    };

    const rows = personalList.map((personal: any) => ({
        Nombre: personal.name,
        Cargo: personal.position,
        Acciones: (
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <ActionButtonComponent 
                    label="EDITAR"
                    onClick={() => handleEdit(personal)}
                    bgColor="bg-secondary-button-color"
                />
                <ActionButtonComponent 
                    label="ELIMINAR"
                    onClick={() => handleDelete(personal.id)}
                    bgColor="bg-primary-red-color"
                />
            </div>
        )
    }));

    if (loading) return <LoadingPage />;
    if (error) return <ErrorPage message={error} />;

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title='GESTIONAR PERSONAL TÉCNICO' />
                    {error && (
                        <div className="bg-red-200 text-red-600 border border-red-400 rounded-md p-3 mb-4 w-full">
                            {error}
                        </div>
                    )}
                    <AddButtonComponent onClick={handleAddClick} />
                    <div className="overflow-x-auto w-full">
                        <TableComponent headers={headers} rows={rows} />
                    </div>
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
                            onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                        {errorMessages.name && <p className="text-red-600 text-sm">{errorMessages.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Cargo</label>
                        <select
                            value={personalForm.position}
                            onChange={(e) => setPersonalForm({ ...personalForm, position: e.target.value })}
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
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onSubmit={confirmDelete}
            />
        </>
    );
};

export default PersonalPage;

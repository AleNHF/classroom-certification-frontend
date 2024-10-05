import React, { useState } from 'react';
import HeaderComponent from '../../components/layout/HeaderComponent';
import TableComponent from '../../components/ui/TableComponent';
import AddButtonComponent from '../../components/ui/AddButtonComponent';
import ModalComponent from '../../components/ui/ModalComponent';
import usePersonal from '../../hooks/usePersonal';
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal';

const PersonalPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [newPersonal, setNewPersonal] = useState({ id: '', name: '', position: '', signature: null as File | null, });
    const [personalToDelete, setPersonalToDelete] = useState<string | null>(null);
    const {
        personalList,
        loading,
        error,
        addPersonal,
        updatePersonal,
        deletePersonal
    } = usePersonal();

    const handleAddClick = () => {
        setNewPersonal({ id: '', name: '', position: '', signature: null });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewPersonal({ id: '', name: '', position: '', signature: null });
    };

    // Manejador para el input de archivo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file && file.type.startsWith('image/')) {
            setNewPersonal({ ...newPersonal, signature: file });
        } else {
            alert("Please upload a valid image file.");
        }
    };

    const handleAddOrUpdate = async () => {
        const formData = new FormData();
        formData.append('name', newPersonal.name);
        formData.append('position', newPersonal.position);
        if (newPersonal.signature) {
            formData.append('signature', newPersonal.signature);
        } else {
            console.error('No file selected for signature.');
            return;
        }

        try {
            newPersonal.id ? await updatePersonal(newPersonal.id, formData) : await addPersonal(formData);
            handleCloseModal();
        } catch (error) {
            console.error('Error adding/updating personal:', error);
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
                console.error('Error deleting personal:', error);
            } finally {
                setPersonalToDelete(null);
                setIsConfirmDeleteOpen(false);
            }
        }
    };

    const handleEdit = (personal: any) => {
        setNewPersonal({ id: personal.id, name: personal.name, position: personal.position, signature: personal.signature });
        setIsModalOpen(true);
    }

    const headers = ["Nombre", "Cargo", "Acciones"];
    const rows = personalList.map((personal: any) => ({
        Nombre: personal.name,
        Cargo: personal.position,
        Acciones: (
            <div className="flex space-x-2">
                <button
                    className="bg-secondary-button-color text-white text-sm px-4 py-1 rounded w-24"
                    onClick={() => handleEdit(personal)}
                >
                    EDITAR
                </button>
                <button
                    className="bg-primary-red-color text-white text-sm px-4 py-1 rounded w-24"
                    onClick={() => handleDelete(personal.id)}
                >
                    ELIMINAR
                </button>
            </div>
        )
    }));

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                {/* Header */}
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                {/* Main Content */}
                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <h1 className="text-2xl font-medium my-10 text-left w-full">GESTIONAR PERSONAL TÉCNICO</h1>
                    {error && (
                        <div className="bg-red-200 text-red-600 border border-red-400 rounded-md p-3 mb-4 w-full">
                            {error}
                        </div>
                    )}
                    <AddButtonComponent onClick={handleAddClick} />
                    <TableComponent headers={headers} rows={rows} />
                </div>
            </div>
            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={newPersonal.id ? 'Editar Personal' : 'Nuevo Personal Técnico'}
                primaryButtonText={newPersonal.id ? 'EDITAR' : 'AGREGAR'}
                onSubmit={handleAddOrUpdate}
            >
                <form className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={newPersonal.name}
                            onChange={(e) => setNewPersonal({ ...newPersonal, name: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Cargo</label>
                        <select
                            value={newPersonal.position}
                            onChange={(e) => setNewPersonal({ ...newPersonal, position: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        >
                            <option value="">Selecciona un cargo</option>
                            <option value="Editor Audiovisual">Editor Audiovisual</option>
                            <option value="Integrador">Integrador</option>
                            <option value="Diseñador">Diseñador</option>
                            <option value="Diseñador instruccional">Diseñador instruccional</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Firma (Subir imagen)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                    </div>
                </form>
            </ModalComponent>

            {/* Modal de Confirmación de Eliminación */}
            <ConfirmDeleteModal isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)} onSubmit={confirmDelete} />
        </>
    );
};

export default PersonalPage;
import React, { useEffect, useState } from 'react';
import HeaderComponent from '../../components/layout/HeaderComponent';
import TableComponent from '../../components/ui/TableComponent';
import AddButtonComponent from '../../components/ui/AddButtonComponent';
import ModalComponent from '../../components/ui/ModalComponent';
import apiService from '../../services/apiService';

const PersonalPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [personalList, setPersonalList] = useState([]);
    const [newPersonal, setNewPersonal] = useState({ name: '', position: '', signature: null as File | null, });

    {/* Cargar el personal al cargar la vista */ }
    useEffect(() => {
        fetchPersonal();
    }, []);

    const fetchPersonal = async () => {
        try {
            const personalData = await apiService.getPersonnel();
            setPersonalList(personalData);
        } catch (error) {
            console.error('Error fetching personal:', error);
        }
    }

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Manejador para el input de archivo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null; // Asegúrate de obtener el archivo
        setNewPersonal({ ...newPersonal, signature: file }); // Actualiza el estado
    };

    const handleAddPersonal = async () => {
        const formData = new FormData();
        formData.append('name', newPersonal.name);
        formData.append('position', newPersonal.position);

        if (newPersonal.signature) {
            formData.append('signature', newPersonal.signature);
        } else {
            console.error('No se ha seleccionado ningún archivo para la firma.');
            return; // Salir si no hay archivo
        }

        try {
            await apiService.addPersonnel(formData);
            fetchPersonal();
            handleCloseModal();
        } catch (error) {
            console.error('Error adding personal:', error)
        }
    }

    const handleDeletePersonal = async (id: string) => {
        try {
            await apiService.deletePersonnel(id);
            fetchPersonal();
        } catch (error) {
            console.error('Error deleting personal:', error);
        }
    }

    const headers = ["Nombre", "Cargo", "Acciones"];
    const rows = personalList.map((personal: any) => ({
        Nombre: personal.name,
        Cargo: personal.position,
        Acciones: (
            <div className="flex space-x-2">
                <button className="bg-secondary-button-color text-white text-sm px-4 py-1 rounded w-24">EDITAR</button>
                <button
                    className="bg-primary-red-color text-white text-sm px-4 py-1 rounded w-24"
                    onClick={() => handleDeletePersonal(personal.id)}
                >
                    ELIMINAR
                </button>
            </div>
        )
    }));

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
                    <AddButtonComponent onClick={handleAddClick} />
                    <TableComponent headers={headers} rows={rows} />
                </div>
            </div>
            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Nuevo Personal Técnico"
                primaryButtonText="AGREGAR"
                onSubmit={handleAddPersonal}
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
        </>
    );
};

export default PersonalPage;
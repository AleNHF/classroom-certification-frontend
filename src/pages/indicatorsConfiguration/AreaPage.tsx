import React, { useState } from 'react';
import HeaderComponent from '../../components/layout/HeaderComponent';
import TableComponent from '../../components/ui/TableComponent';
import AddButtonComponent from '../../components/ui/AddButtonComponent';
import ModalComponent from '../../components/ui/ModalComponent';
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal';
import PageHeaderComponent from '../../components/ui/PageHeader';
import { useNavigate } from 'react-router-dom';
import ActionButtonComponent from '../../components/ui/ActionButtonComponent';
import LoadingPage from '../utils/LoadingPage';
import ErrorPage from '../utils/ErrorPage';
import useArea from '../../hooks/indicatorsConfiguration/useArea';

const headers = ["Nombre del área", "Acciones"];

const AreaPage: React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [newArea, setNewArea] = useState({ id: '', name: '' });
    const [areaToDelete, setAreaToDelete] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); 
    
    const {
        areaList,
        loading,
        error,
        addArea,
        updateArea,
        deleteArea
    } = useArea();

    const resetAreaForm = () => {
        setNewArea({ id: '', name: '' });
        setErrorMessage(null);
    };

    const handleAddClick = () => {
        resetAreaForm();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetAreaForm();
    };

    const handleAddOrUpdate = async () => {
        if (!newArea.name.trim()) {
            setErrorMessage('El nombre del área es obligatorio.');
            return;
        }

        const areaData = {
            name: newArea.name,
        };

        try {
            newArea.id 
                ? await updateArea(newArea.id, areaData)
                : await addArea(areaData);
                
            handleCloseModal();
        } catch (error) {
            console.error('Error al añadir/actualizar la área:', error);
        }
    };

    const handleDelete = (id: string) => {
        setAreaToDelete(id);
        setIsConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (areaToDelete) {
            try {
                await deleteArea(areaToDelete);
            } catch (error) {
                console.error('Error al eliminar área:', error);
            } finally {
                setAreaToDelete(null);
                setIsConfirmDeleteOpen(false);
            }
        }
    };

    const handleEdit = (area: any) => {
        setNewArea({ 
            id: area.id, 
            name: area.name
        });
        setIsModalOpen(true);
    };

    const handleIndicatorsClick = () => {
        navigate(`/indicators-configuration/indicators`)
    };

    const rows = areaList.map((area: any) => ({
        Nombre: area.name,
        Acciones: (
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <ActionButtonComponent 
                    label="EDITAR"
                    onClick={() => handleEdit(area)}
                    bgColor="bg-secondary-button-color"
                />
                <ActionButtonComponent 
                    label="ELIMINAR"
                    onClick={() => handleDelete(area.id)}
                    bgColor="bg-primary-red-color"
                />
                <ActionButtonComponent 
                    label="INDICADORES"
                    onClick={() => handleIndicatorsClick()}
                    bgColor="bg-optional-button-color"
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
                    <PageHeaderComponent title='CONFIGURAR ÁREAS' />
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
                title={newArea.id ? 'Editar Área' : 'Nueva Área'}
                primaryButtonText={newArea.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleAddOrUpdate}
                size="medium"
            >
                <form className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={newArea.name}
                            onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                        {errorMessage && (
                            <p className="text-red-600 text-sm mt-1">{errorMessage}</p> // Mostrar el mensaje de error
                        )}
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

export default AreaPage;
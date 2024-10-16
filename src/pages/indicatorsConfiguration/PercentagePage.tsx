import React, { useState } from 'react';
import HeaderComponent from '../../components/layout/HeaderComponent';
import TableComponent from '../../components/ui/TableComponent';
import AddButtonComponent from '../../components/ui/AddButtonComponent';
import ModalComponent from '../../components/ui/ModalComponent';
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal';
import PageHeaderComponent from '../../components/ui/PageHeader';
import ActionButtonComponent from '../../components/ui/ActionButtonComponent';
import LoadingPage from '../utils/LoadingPage';
import ErrorPage from '../utils/ErrorPage';
import useArea from '../../hooks/indicatorsConfiguration/useArea';

const headers = ["Ciclo", "Área", "Porcentaje", "Acciones"];

const PercentagePage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [newPercentage, setNewPercentage] = useState({ id: '', cycle: '', area: '', percentage: '' });
    const [percentageToDelete, setPercentageToDelete] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); 
    
    const {
        areaList,
        loading,
        error,
        addArea,
        updateArea,
        deleteArea
    } = useArea();

    const resetPercentageForm = () => {
        setNewPercentage({ id: '', cycle: '', area: '', percentage: '' });
        setErrorMessage(null);
    };

    const handleAddClick = () => {
        resetPercentageForm();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetPercentageForm();
    };

    const handleAddOrUpdate = async () => {
        if (!newPercentage.cycle.trim()) {
            setErrorMessage('Selecciona antes el ciclo.');
            return;
        }

        const areaData = {
            name: newPercentage.cycle,
        };

        try {
            newPercentage.id 
                ? await updateArea(newPercentage.id, areaData)
                : await addArea(areaData);
                
            handleCloseModal();
        } catch (error) {
            console.error('Error al añadir/actualizar el porcentaje:', error);
        }
    };

    const handleDelete = (id: string) => {
        setPercentageToDelete(id);
        setIsConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (percentageToDelete) {
            try {
                await deleteArea(percentageToDelete);
            } catch (error) {
                console.error('Error al eliminar área:', error);
            } finally {
                setPercentageToDelete(null);
                setIsConfirmDeleteOpen(false);
            }
        }
    };

    const handleEdit = (percentage: any) => {
        setNewPercentage({ 
            id: percentage.id, 
            cycle: percentage.cycle,
            area: percentage.area,
            percentage: percentage.percentage
        });
        setIsModalOpen(true);
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
                title={newPercentage.id ? 'Editar Área' : 'Nueva Área'}
                primaryButtonText={newPercentage.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleAddOrUpdate}
                size="medium"
            >
                <form className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={newPercentage.cycle}
                            onChange={(e) => setNewPercentage({ ...newPercentage, cycle: e.target.value })}
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

export default PercentagePage;
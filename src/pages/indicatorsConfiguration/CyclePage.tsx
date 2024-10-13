import React, { useState } from 'react';
import HeaderComponent from '../../components/layout/HeaderComponent';
import TableComponent from '../../components/ui/TableComponent';
import AddButtonComponent from '../../components/ui/AddButtonComponent';
import ModalComponent from '../../components/ui/ModalComponent';
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal';
import useCycle from '../../hooks/indicatorsConfiguration/useCycle';
import PageHeaderComponent from '../../components/ui/PageHeader';
import { useNavigate } from 'react-router-dom';
import ActionButtonComponent from '../../components/ui/ActionButtonComponent';
import LoadingPage from '../utils/LoadingPage';
import ErrorPage from '../utils/ErrorPage';

const headers = ["Nombre del ciclo", "Acciones"];

const CyclePage: React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [newCycle, setNewCyle] = useState({ id: '', name: '' });
    const [cycleToDelete, setCycleToDelete] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); 
    
    const {
        cycleList,
        loading,
        error,
        addCycle,
        updateCycle,
        deleteCycle
    } = useCycle();

    const resetCycleForm = () => {
        setNewCyle({ id: '', name: '' });
        setErrorMessage(null);
    };

    const handleAddClick = () => {
        resetCycleForm();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetCycleForm();
    };

    const handleAddOrUpdate = async () => {
        if (!newCycle.name.trim()) {
            setErrorMessage('El nombre del ciclo es obligatorio.');
            return;
        }

        const cycleData = {
            name: newCycle.name,
        };

        try {
            newCycle.id 
                ? await updateCycle(newCycle.id, cycleData)
                : await addCycle(cycleData);
                
            handleCloseModal();
        } catch (error) {
            console.error('Error al añadir/actualizar el ciclo:', error);
        }
    };

    const handleDelete = (id: string) => {
        setCycleToDelete(id);
        setIsConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (cycleToDelete) {
            try {
                await deleteCycle(cycleToDelete);
            } catch (error) {
                console.error('Error al eliminar ciclo:', error);
            } finally {
                setCycleToDelete(null);
                setIsConfirmDeleteOpen(false);
            }
        }
    };

    const handleEdit = (cycle: any) => {
        setNewCyle({ 
            id: cycle.id, 
            name: cycle.name
        });
        setIsModalOpen(true);
    };

    const handleResourcesClick = (cycleId: string, cycleName: string) => {
        navigate(`/indicators-configuration/resources/${cycleId}`, { state: { cycleName: cycleName } })
    };

    const rows = cycleList.map((cycle: any) => ({
        Nombre: cycle.name,
        Acciones: (
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <ActionButtonComponent 
                    label="EDITAR"
                    onClick={() => handleEdit(cycle)}
                    bgColor="bg-secondary-button-color"
                />
                <ActionButtonComponent 
                    label="ELIMINAR"
                    onClick={() => handleDelete(cycle.id)}
                    bgColor="bg-primary-red-color"
                />
                <ActionButtonComponent 
                    label="RECURSOS"
                    onClick={() => handleResourcesClick(cycle.id, cycle.name)}
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
                    <PageHeaderComponent title='CONFIGURAR CICLOS' />
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
                title={newCycle.id ? 'Editar Ciclo' : 'Nuevo Ciclo'}
                primaryButtonText={newCycle.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleAddOrUpdate}
                size="medium"
            >
                <form className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={newCycle.name}
                            onChange={(e) => setNewCyle({ ...newCycle, name: e.target.value })}
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

export default CyclePage;
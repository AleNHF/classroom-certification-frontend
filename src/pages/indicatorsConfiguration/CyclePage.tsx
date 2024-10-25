import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionButtonComponent, PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal, HeaderComponent } from '../../components';
import { LoadingPage, ErrorPage } from '../utils';
import { useCycle } from '../../hooks';

const headers = ["Nombre del ciclo", "Acciones"];

const CyclePage: React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [newCycle, setNewCyle] = useState({ id: '', name: '' });
    const [cycleToDelete, setCycleToDelete] = useState<{ id: string | null, name: string | null }>({ id: null, name: null });
    const [errorMessage, setErrorMessage] = useState<string | null>(null); 
    const [isLoading, setIsLoading] = useState(true);
    
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

    const handleDelete = (id: string, name: string) => {
        setCycleToDelete({ id, name });
        setIsConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (cycleToDelete.id) {
            try {
                await deleteCycle(cycleToDelete.id);
            } catch (error) {
                console.error('Error al eliminar ciclo:', error);
            } finally {
                setCycleToDelete({ id: null, name: null});
                setIsConfirmDeleteOpen(false);
            }
        }
    };

    const handleEdit = (cycle: { id: string; name: string }) => {
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
                    bgColor="bg-secondary-button-color hover:bg-blue-800"
                />
                <ActionButtonComponent 
                    label="ELIMINAR"
                    onClick={() => handleDelete(cycle.id, cycle.name)}
                    bgColor="bg-primary-red-color hover:bg-red-400"
                />
                <ActionButtonComponent 
                    label="RECURSOS"
                    onClick={() => handleResourcesClick(cycle.id, cycle.name)}
                    bgColor="bg-optional-button-color hover:bg-slate-400"
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
                message={`¿Estás seguro de que deseas eliminar el ciclo "${cycleToDelete.name}"?`}
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)} 
                onSubmit={confirmDelete} 
            />
        </>
    );
};

export default CyclePage;
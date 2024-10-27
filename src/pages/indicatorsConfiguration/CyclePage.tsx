import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionButtonComponent, PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal, HeaderComponent, AlertComponent, PaginationComponent } from '../../components';
import { ErrorPage } from '../utils';
import { useCycle } from '../../hooks';

const headers = ["Nombre del ciclo", "Acciones"];

const CyclePage: React.FC = () => {
    const navigate = useNavigate();

    // Estados de UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    // Estados de Datos
    const [newCycle, setNewCyle] = useState({ id: '', name: '' });
    const [cycleToDelete, setCycleToDelete] = useState<{ id: string | null, name: string | null }>({ id: null, name: null });

    // Estados de validación y errores
    const [errorMessage, setErrorMessage] = useState<string | null>(null); 

    const [paginatedItems, setPaginatedItems] = useState<any[]>([]);
    
    const {
        cycleList,
        error,
        successMessage,
        addCycle,
        updateCycle,
        deleteCycle
    } = useCycle();

    // Manejadores de modal
    const resetCycleForm = () => {
        setNewCyle({ id: '', name: '' });
        setErrorMessage(null);
    };

    const handleAddClick = useCallback(() => {
        resetCycleForm();
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        resetCycleForm();
    }, []);

    // Manejador de submit del formulario
    const handleSubmit = useCallback(async () => {
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
    }, [newCycle, addCycle, updateCycle]);

    // Manejadores de eliminación
    const handleDelete = useCallback((id: string, name: string) => {
        setCycleToDelete({ id, name });
        setIsConfirmDeleteOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
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
    }, [cycleToDelete.id, deleteCycle]);

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

    // Renderizado de filas de la tabla
    const renderTableRows = useCallback(() => {
        return paginatedItems.map((cycle: any) => ({
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
    }, [paginatedItems, handleDelete, handleEdit]);

    /* useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); 

        return () => clearTimeout(timer);
    }, []);

    if (loading || isLoading) return <LoadingPage />; */
    if (error) return <ErrorPage message={error} />;

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title='CONFIGURAR CICLOS' />
                    {successMessage && (
                        <AlertComponent
                            type="success"
                            message={successMessage}
                            className="mb-4 w-full"
                        />
                    )}

                    {errorMessage && (
                        <AlertComponent
                            type="error"
                            message={errorMessage}
                            className="mb-4 w-full"
                        />
                    )}
                    <AddButtonComponent onClick={handleAddClick} />
                    <div className="overflow-x-auto w-full">
                        <TableComponent headers={headers} rows={renderTableRows()} />
                    </div>
                    <PaginationComponent
                        items={cycleList}
                        onPageItemsChange={setPaginatedItems}
                    />
                </div>
            </div>

            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={newCycle.id ? 'Editar Ciclo' : 'Nuevo Ciclo'}
                primaryButtonText={newCycle.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleSubmit}
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
                            <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
                        )}
                    </div>
                </form>
            </ModalComponent>

            <ConfirmDeleteModal 
                message={`¿Estás seguro de que deseas eliminar el ciclo "${cycleToDelete.name}"?`}
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)} 
                onSubmit={handleConfirmDelete} 
            />
        </>
    );
};

export default CyclePage;
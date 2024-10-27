import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionButtonComponent, AddButtonComponent, AlertComponent, ConfirmDeleteModal, HeaderComponent, ModalComponent, PageHeaderComponent, TableComponent } from '../../components';
import { ErrorPage } from '../utils';
import { useArea } from '../../hooks';

const headers = ["Nombre del área", "Acciones"];

const AreaPage: React.FC = () => {
    const navigate = useNavigate();

    // Estados de UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    // Estados de Datos
    const [newArea, setNewArea] = useState({ id: '', name: '' });
    const [areaToDelete, setAreaToDelete] = useState<{ id: string | null, name: string | null }>({ id: null, name: null });

    // Estados de validación y errores
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        areaList,
        error,
        successMessage,
        addArea,
        updateArea,
        deleteArea
    } = useArea();

    // Manejadores de modal
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

    // Manejadores de submit del formulario
    const handleSubmit = useCallback(async () => {
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
    }, [newArea, addArea, updateArea]);

    // Manejadores de eliminación
    const handleDelete = useCallback((id: string, name: string) => {
        setAreaToDelete({ id, name });
        setIsConfirmDeleteOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (areaToDelete.id) {
            try {
                await deleteArea(areaToDelete.id);
            } catch (error) {
                console.error('Error al eliminar área:', error);
            } finally {
                setAreaToDelete({ id: null, name: null });
                setIsConfirmDeleteOpen(false);
            }
        }
    }, [areaToDelete.id, deleteArea]);

    const handleEdit = (area: any) => {
        setNewArea({
            id: area.id,
            name: area.name
        });
        setIsModalOpen(true);
    };

    const handleIndicatorsClick = (areaId: string, areaName: string) => {
        navigate(`/indicators-configuration/indicators/${areaId}`, {state: { areaName: areaName } });
    };

    // Renderizado de filas de la tabla
    const renderTableRows = useCallback(() => {
        return areaList.map((area: any) => ({
            Nombre: area.name,
            Acciones: (
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <ActionButtonComponent
                        label="EDITAR"
                        onClick={() => handleEdit(area)}
                        bgColor="bg-secondary-button-color hover:bg-blue-800"
                    />
                    <ActionButtonComponent
                        label="ELIMINAR"
                        onClick={() => handleDelete(area.id, area.name)}
                        bgColor="bg-primary-red-color hover:bg-red-400"
                    />
                    <ActionButtonComponent
                        label="INDICADORES"
                        onClick={() => handleIndicatorsClick(area.id, area.name)}
                        bgColor="bg-optional-button-color hover:bg-slate-400 hover:bg-slate-400"
                    />
                </div>
            )
        }));
    }, [areaList, handleDelete, handleEdit]);

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
                    <PageHeaderComponent title='CONFIGURAR ÁREAS' />
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
                </div>
            </div>

            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={newArea.id ? 'Editar Área' : 'Nueva Área'}
                primaryButtonText={newArea.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleSubmit}
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
                            <p className="text-red-600 text-sm mt-1">{errorMessage}</p> 
                        )}
                    </div>
                </form>
            </ModalComponent>

            <ConfirmDeleteModal
                message={`¿Estás seguro de que deseas eliminar el área "${areaToDelete.name}"?`}
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onSubmit={handleConfirmDelete}
            />
        </>
    );
};

export default AreaPage;
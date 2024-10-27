import React, { useCallback, useState } from 'react';
import { validatePercentageForm } from '../../utils/validations/validatePercentageForm';
import { ActionButtonComponent, PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal, HeaderComponent, SelectInput, AlertComponent, PaginationComponent } from '../../components';
import { ErrorPage } from '../utils';
import { useArea, useCycle, usePercentage } from '../../hooks';

const headers = ["Ciclo", "Área", "Porcentaje", "Acciones"];

const PercentagePage: React.FC = () => {
    // Estados de UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    // Estados de Datos
    const [newPercentage, setNewPercentage] = useState({ id: '', cycleId: '', areaId: '', percentage: '' });
    const [percentageToDelete, setPercentageToDelete] = useState<string | null>(null);

    // Estados de validación y erroes
    const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

    const [paginatedItems, setPaginatedItems] = useState<any[]>([]);

    const { cycleList } = useCycle();
    const { areaList } = useArea();
    const {
        percentageList,
        error,
        successMessage,
        addPercentage,
        updatePercentage,
        deletePercentage
    } = usePercentage();

    // Manejadores de modal
    const resetPercentageForm = () => {
        setNewPercentage({ id: '', cycleId: '', areaId: '', percentage: '' });
        setErrorMessages({});
    };

    const handleAddClick = () => {
        resetPercentageForm();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetPercentageForm();
    };

    // Manejador de submit del formulario
    const handleSubmit = useCallback(async () => {
        const newErrorMessages = validatePercentageForm(newPercentage);;
        setErrorMessages(newErrorMessages);

        if (Object.keys(newErrorMessages).length > 0) return;

        const percentageData = {
            cycleId: Number(newPercentage.cycleId),
            areaId: Number(newPercentage.areaId),
            percentage: parseFloat(newPercentage.percentage)
        };

        try {
            newPercentage.id
                ? await updatePercentage(newPercentage.id, percentageData)
                : await addPercentage(percentageData);

            handleCloseModal();
        } catch (error) {
            console.error('Error al añadir/actualizar el porcentaje:', error);
        }
    }, [newPercentage, addPercentage, updatePercentage]);

    // Manejadores de eliminación
    const handleDelete = useCallback((id: string) => {
        setPercentageToDelete(id);
        setIsConfirmDeleteOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (percentageToDelete) {
            try {
                await deletePercentage(percentageToDelete);
            } catch (error) {
                console.error('Error al eliminar porcentaje:', error);
            } finally {
                setPercentageToDelete(null);
                setIsConfirmDeleteOpen(false);
            }
        }
    }, [percentageToDelete, deletePercentage]);

    const handleEdit = (percentage: any) => {
        setNewPercentage({
            id: percentage.id,
            cycleId: percentage.cycle.id,
            areaId: percentage.area.id,
            percentage: percentage.percentage
        });
        setIsModalOpen(true);
    };

    // Renderizado de filas de la tabla
    const renderTableRows = useCallback(() => {
        return paginatedItems.map((percentage: any) => ({
            Ciclo: cycleList.find((cycle: any) => cycle.id === percentage.cycle.id)?.name || 'N/A',
            Área: areaList.find((area: any) => area.id === percentage.area.id)?.name || 'N/A',
            Porcentaje: percentage.percentage + '%',
            Acciones: (
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <ActionButtonComponent
                        label="EDITAR"
                        onClick={() => handleEdit(percentage)}
                        bgColor="bg-secondary-button-color hover:bg-blue-800"
                    />
                    <ActionButtonComponent
                        label="ELIMINAR"
                        onClick={() => handleDelete(percentage.id)}
                        bgColor="bg-primary-red-color hover:bg-red-400"
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
                    <PageHeaderComponent title='CONFIGURAR PORCENTAJE DE CICLOS Y ÁREAS' />
                    {successMessage && (
                        <AlertComponent
                            type="success"
                            message={successMessage}
                            className="mb-4 w-full"
                        />
                    )}

                    {errorMessages.submit && (
                        <AlertComponent
                            type="error"
                            message={errorMessages.submit}
                            className="mb-4 w-full"
                        />
                    )}
                    <AddButtonComponent onClick={handleAddClick} />
                    <div className="overflow-x-auto w-full">
                        <TableComponent headers={headers} rows={renderTableRows()} />
                    </div>
                    <PaginationComponent
                        items={percentageList}
                        onPageItemsChange={setPaginatedItems}
                    />
                </div>
            </div>

            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={newPercentage.id ? 'Editar Porcentaje' : 'Nueva Porcentaje'}
                primaryButtonText={newPercentage.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleSubmit}
                size="medium"
            >
                <form className="space-y-4">
                    <div className="mb-4">
                        <SelectInput
                            label="Ciclo"
                            value={newPercentage.cycleId}
                            options={cycleList}
                            onChange={(e) => setNewPercentage({ ...newPercentage, cycleId: e.target.value })}
                            error={errorMessages.cycleId}
                        />
                    </div>
                    <div className="mb-4">
                        <SelectInput
                            label="Área"
                            value={newPercentage.areaId}
                            options={areaList}
                            onChange={(e) => setNewPercentage({ ...newPercentage, areaId: e.target.value })}
                            error={errorMessages.areaId}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Porcentaje</label>
                        <input
                            type="number"
                            value={newPercentage.percentage}
                            onChange={(e) => setNewPercentage({ ...newPercentage, percentage: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                            min="0"
                            max="100"
                            step="0.1"
                        />
                    </div>
                    {errorMessages.percentage && <p className="text-red-600 text-sm">{errorMessages.percentage}</p>}
                </form>
            </ModalComponent>

            <ConfirmDeleteModal
                message="¿Estás seguro de que deseas eliminar el porcentaje?"
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onSubmit={handleConfirmDelete}
            />
        </>
    );
};

export default PercentagePage;
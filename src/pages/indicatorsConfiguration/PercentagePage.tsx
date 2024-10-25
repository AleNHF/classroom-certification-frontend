import React, { useEffect, useState } from 'react';
import { validatePercentageForm } from '../../utils/validations/validatePercentageForm';
import { ActionButtonComponent, PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal, HeaderComponent, SelectInput } from '../../components';
import { LoadingPage, ErrorPage } from '../utils';
import { useArea, useCycle, usePercentage } from '../../hooks';

const headers = ["Ciclo", "Área", "Porcentaje", "Acciones"];

const PercentagePage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [newPercentage, setNewPercentage] = useState({ id: '', cycleId: '', areaId: '', percentage: '' });
    const [percentageToDelete, setPercentageToDelete] = useState<string | null>(null);
    const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);

    const { cycleList } = useCycle();
    const { areaList } = useArea();

    const {
        percentageList,
        loading,
        error,
        addPercentage,
        updatePercentage,
        deletePercentage
    } = usePercentage();

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

    const handleAddOrUpdate = async () => {
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
    };

    const handleDelete = (id: string) => {
        setPercentageToDelete(id);
        setIsConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
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
    };

    const handleEdit = (percentage: any) => {
        setNewPercentage({
            id: percentage.id,
            cycleId: percentage.cycle.id,
            areaId: percentage.area.id,
            percentage: percentage.percentage
        });
        setIsModalOpen(true);
    };

    const rows = percentageList.map((percentage: any) => ({
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
                    <PageHeaderComponent title='CONFIGURAR PORCENTAJE DE CICLOS Y ÁREAS' />
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
                title={newPercentage.id ? 'Editar Porcentaje' : 'Nueva Porcentaje'}
                primaryButtonText={newPercentage.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleAddOrUpdate}
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
                onSubmit={confirmDelete}
            />
        </>
    );
};

export default PercentagePage;
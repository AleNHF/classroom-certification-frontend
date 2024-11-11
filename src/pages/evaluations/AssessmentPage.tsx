import React, { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal, HeaderComponent, AlertComponent, PaginationComponent, SelectInput, FilterSelect, FilterButtons } from '../../components';
import { ErrorPage } from '../utils';
import { Assessment, AssessmentData } from '../../types';
import IconButtonComponent from '../../components/ui/IconButtonComponent';
import { validateAssessmentData } from '../../utils/validations/validateAssessmentData';
import { useArea, useAssessment } from '../../hooks';
import { FilterSelectArea } from '../../components/ui/FilterSelectArea';
import { AreaNames } from '../../utils/enums/areaNames';
import { FilterButtonsArea } from '../../components/ui/FilterButtonsArea';

const headers = ["Nombre de área", "Requisitos", "Valoración", "Acciones"];

const INITIAL_ASSESSMENT_DATA: AssessmentData = {
    id: '',
    description: '',
    assessment: 0,
    conclusions: '',
    areaId: 0,
    requerimentName: '',
    requerimentUrl: ''
};

const AssessmentPage: React.FC = () => {
    const { formId } = useParams<{ formId: string }>();
    const safeFormId = formId || '';

    // Estados de UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    // Estados de Datos
    const [newAssessment, setNewAssessment] = useState<AssessmentData>(INITIAL_ASSESSMENT_DATA);
    const [assessmentToDelete, setAssessmentToDelete] = useState<{ id: string | null, name: string | null }>({ id: null, name: null });
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewAssessment, setViewAssessment] = useState<Assessment | null>(null);
    const [selectedArea, setSelectedArea] = useState<string>('');
    const [filter, setFilter] = useState<'' | AreaNames>('');

    // Estados de validación y errores
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [paginatedItems, setPaginatedItems] = useState<any[]>([]);

    const { assessmentList, error, successMessage, getAssessmentById, addAssessment, updateAssessment, deleteAssessment } = useAssessment(safeFormId);
    const { areaList } = useArea();

    // Manejadores de modal
    const resetForm = () => {
        setNewAssessment(INITIAL_ASSESSMENT_DATA);
        setFormErrors({});
    };

    const handleAddClick = useCallback(() => {
        resetForm();
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        resetForm();
    }, []);

    const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedArea(e.target.value);
    };

    const handleFilterChange = (newFilter: "" | AreaNames) => {
        setFilter(newFilter);
    };

    // Manejador de submit del formulario
    const handleSubmit = useCallback(async () => {
        const newErrorMessages = validateAssessmentData(newAssessment);
        setFormErrors(newErrorMessages);

        if (Object.keys(newErrorMessages).length > 0) return;

        const assessmentDataRequest = {
            description: newAssessment.description,
            assessment: newAssessment.assessment,
            conclusions: newAssessment.conclusions,
            areaId: newAssessment.areaId,
        };
        console.log('assessmentDataRequest', assessmentDataRequest)

        try {
            newAssessment.id
                ? await updateAssessment(newAssessment.id, assessmentDataRequest)
                : await addAssessment(assessmentDataRequest);

            handleCloseModal();
        } catch (error) {
            console.error('Error al añadir/actualizar la valoración:', error);
        }
    }, [newAssessment, addAssessment, updateAssessment]);

    // Manejadores de eliminación
    const handleDelete = useCallback((id: string, name: string) => {
        setAssessmentToDelete({ id, name });
        setIsConfirmDeleteOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (assessmentToDelete.id) {
            try {
                await deleteAssessment(assessmentToDelete.id);
            } catch (error) {
                console.error('Error al eliminar valoración:', error);
            } finally {
                setAssessmentToDelete({ id: null, name: null });
                setIsConfirmDeleteOpen(false);
            }
        }
    }, [assessmentToDelete.id, deleteAssessment]);

    const handleEdit = (assessment: Assessment) => {
        console.log('assessment edit', assessment)
        setNewAssessment({
            id: assessment.id?.toString(),
            description: assessment.description!,
            assessment: parseInt(assessment.assessment!),
            conclusions: assessment.conclusions!,
            areaId: assessment.area?.id!,
        });
        setIsModalOpen(true);
    };

    const handleView = useCallback(async (assessmentId: string) => {
        try {
            const assessment = await getAssessmentById(assessmentId);
            if (assessment) {
                setViewAssessment(assessment);
                setIsViewModalOpen(true);
            }
        } catch (error) {
            console.error('Error al obtener los detalles de la valoración:', error);
        }
    }, [getAssessmentById]);

    const truncateText = (text: string, maxLength = 60) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const filteredAssessments = useMemo(() => {
        let filteredAssessments = assessmentList;
        console.log('filter', filter)
        if (filter !== AreaNames.ALL) {
            filteredAssessments = assessmentList.filter(
                (assessment) => assessment.area?.name === filter
            );
        }
        console.log('filteredAssessments',filteredAssessments)
        return filteredAssessments;
    }, [assessmentList, filter]);

    // Renderizado de filas de la tabla
    const renderTableRows = useCallback(() => {
        return paginatedItems.map((assessment: any) => ({
            [`${assessment.area?.name ?? 'Unknown Area'}`]: truncateText(assessment.description),
            Requisitos: assessment.requeriments?.[0]?.name,
            Valoración: assessment.assessment,
            Acciones: (
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <IconButtonComponent
                        variant="edit"
                        onClick={() => handleEdit(assessment)}
                    />
                    <IconButtonComponent
                        variant="delete"
                        onClick={() => handleDelete(assessment.id, assessment.description)}
                    />
                    <IconButtonComponent
                        variant="view"
                        onClick={() => handleView(assessment.id)}
                    />
                </div>
            ),
        }));
    }, [paginatedItems, filter, handleDelete, handleEdit]);

    if (error) return <ErrorPage message={error} />;

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title='VALORACIÓN DE AULA VIRTUAL' />
                    {successMessage && (
                        <AlertComponent
                            type="success"
                            message={successMessage}
                            className="mb-4 w-full"
                        />
                    )}

                    <AddButtonComponent onClick={handleAddClick} />
                    {/* Filtros */}
                    <div className="flex w-full justify-start my-4">
                        {/* Select para pantallas pequeñas */}
                        <div className="block md:hidden w-full mb-4">
                            <FilterSelectArea filter={filter} setFilter={handleFilterChange} />
                        </div>

                        {/* Botones para pantallas medianas y grandes */}
                        <div className="hidden md:flex w-full space-x-4">
                            <FilterButtonsArea filter={filter} setFilter={handleFilterChange} />
                        </div>
                    </div>

                    <div className="overflow-x-auto w-full">
                        <TableComponent headers={headers} rows={renderTableRows()} />
                    </div>
                    <PaginationComponent
                        items={filteredAssessments}
                        onPageItemsChange={setPaginatedItems}
                        itemsPerPage={3}
                    />
                </div>
            </div>

            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={newAssessment.id ? 'Editar Valoración' : 'Nuevo Valoración'}
                primaryButtonText={newAssessment.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleSubmit}
                size="large"
            >
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <SelectInput
                                label="Área"
                                value={newAssessment.areaId}
                                options={areaList}
                                onChange={handleAreaChange}
                                error={formErrors.areaId}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Valoración</label>
                            <input
                                type="number"
                                value={newAssessment.assessment}
                                onChange={(e) => setNewAssessment({ ...newAssessment, assessment: parseInt(e.target.value) })}
                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <input
                            type="text"
                            value={newAssessment.description}
                            onChange={(e) => setNewAssessment({ ...newAssessment, description: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                        {formErrors && (
                            <p className="text-red-600 text-sm mt-1">{formErrors.description}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Conclusiones/Recomendaciones</label>
                        <input
                            type="text"
                            value={newAssessment.conclusions}
                            onChange={(e) => setNewAssessment({ ...newAssessment, conclusions: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Requisito</label>
                            <input
                                type="text"
                                value={newAssessment.requerimentName}
                                onChange={(e) => setNewAssessment({ ...newAssessment, requerimentName: e.target.value })}
                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                            />
                            {formErrors && (
                                <p className="text-red-600 text-sm mt-1">{formErrors.requerimentName}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Url</label>
                            <input
                                type="text"
                                value={newAssessment.requerimentUrl}
                                onChange={(e) => setNewAssessment({ ...newAssessment, requerimentUrl: e.target.value })}
                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </form>
            </ModalComponent>

            <ModalComponent
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Detalles de la Valoración"
                size="large"
            >
                {viewAssessment && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Información General</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Área</label>
                                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                            {viewAssessment.area?.name}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                            {viewAssessment.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Detalles Adicionales</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Requisitos</label>
                                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                            {viewAssessment.requeriments?.[0]?.name || 'Sin requisitos'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Conclusiones/Recomendaciones</label>
                                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                            {viewAssessment.conclusions}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {viewAssessment.assessment && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Valoración</h3>
                                <div className="bg-blue-50 p-4 rounded-md">
                                    <p className="text-lg font-medium text-blue-900">
                                        Resultado: {viewAssessment.assessment}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </ModalComponent>

            <ConfirmDeleteModal
                message={`¿Estás seguro de que deseas eliminar el formulario "${assessmentToDelete.name}"?`}
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onSubmit={handleConfirmDelete}
            />
        </>
    );
};

export default AssessmentPage;
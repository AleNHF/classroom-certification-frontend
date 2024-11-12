import React, { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal, HeaderComponent, AlertComponent, PaginationComponent } from '../../../components';
import { ErrorPage } from '../../utils';
import { Assessment, AssessmentData, Requeriment } from '../../../types';
import IconButtonComponent from '../../../components/ui/IconButtonComponent';
import { validateAssessmentData } from '../../../utils/validations/validateAssessmentData';
import { useArea, useAssessment } from '../../../hooks';
import { FilterSelectArea } from '../../../components/ui/FilterSelectArea';
import { AreaNames } from '../../../utils/enums/areaNames';
import { FilterButtonsArea } from '../../../components/ui/FilterButtonsArea';
import ViewAssessmentModal from './ViewAssessment';
import { AssessmentForm } from './AssessmentForm';
import { RequirementsSection } from './RequirementSection';

const headers = ["Área", "Requisitos", "Valoración", "Acciones"];

const INITIAL_ASSESSMENT_DATA: AssessmentData = {
    id: '',
    description: '',
    assessment: 0,
    conclusions: '',
    areaId: 0
};

const INITIAL_REQUIREMENT_DATA: Requeriment = {
    name: '',
    url: '',
    assessmentId: 0,
};

const AssessmentPage: React.FC = () => {
    const { formId } = useParams<{ formId: string }>();
    const safeFormId = formId || '';

    const [uiState, setUiState] = useState({
        isModalOpen: false,
        isConfirmDeleteOpen: false,
        isViewModalOpen: false,
        filter: '' as '' | AreaNames,
    });

    const [formState, setFormState] = useState({
        newAssessment: INITIAL_ASSESSMENT_DATA,
        requirements: [] as Requeriment[],
        newRequirement: INITIAL_REQUIREMENT_DATA,
        selectedArea: '',
        formErrors: {} as Record<string, string>,
        assessmentToDelete: { id: null as string | null, name: null as string | null },
        viewAssessment: null as Assessment | null,
    });

    const [paginatedItems, setPaginatedItems] = useState<any[]>([]);

    const { assessmentList, error, successMessage, getAssessmentById, addAssessment, updateAssessment, deleteAssessment } = useAssessment(safeFormId);
    const { areaList } = useArea();

    // Manejadores de modal
    const resetForm = useCallback(() => {
        setFormState(prev => ({
            ...prev,
            newAssessment: INITIAL_ASSESSMENT_DATA,
            requirements: [],
            formErrors: {},
            selectedArea: '',
            newRequirement: INITIAL_REQUIREMENT_DATA
        }))
    }, [])

    const handleAddClick = useCallback(() => {
        resetForm();
        setUiState(prev => ({ ...prev, isModalOpen: true }));
    }, [resetForm]);

    const handleCloseModal = useCallback(() => {
        setUiState(prev => ({ ...prev, isModalOpen: false }));
        resetForm();
    }, [resetForm]);

    const handleAssessmentChange = useCallback((assessment: AssessmentData) => {
        setFormState(prev => ({
            ...prev,
            newAssessment: assessment
        }));
    }, []);

    const handleAreaChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setFormState(prev => ({
            ...prev,
            selectedArea: value,
            newAssessment: {
                ...prev.newAssessment,
                areaId: parseInt(value)
            }
        }));
    }, []);

    const handleFilterChange = useCallback((newFilter: "" | AreaNames) => {
        setUiState(prev => ({ ...prev, filter: newFilter }));
    }, []);

    const handleRequirementChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            newRequirement: { ...prev.newRequirement, [name]: value }
        }));
    }, []);

    const handleAddRequirement = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setFormState(prev => {
            if (!prev.newRequirement.name) return prev;

            const newReq = {
                ...prev.newRequirement,
                id: String(Date.now()),
                ...(prev.newAssessment.id ? { assessmentId: parseInt(prev.newAssessment.id) } : {})
            };

            return {
                ...prev,
                requirements: [...prev.requirements, newReq],
                newRequirement: INITIAL_REQUIREMENT_DATA
            };
        });
    }, []);

    const handleDeleteRequirement = useCallback((reqId: string) => {
        setFormState(prev => ({
            ...prev,
            requirements: prev.requirements.filter(req => req.id !== reqId)
        }));
    }, []);

    // Handler para submit del formulario
    const handleSubmit = useCallback(async () => {
        try {
            const newErrorMessages = validateAssessmentData(formState.newAssessment);
            if (Object.keys(newErrorMessages).length > 0) {
                setFormState((prev) => ({ ...prev, formErrors: newErrorMessages }));
                return;
            }

            const cleanedRequirements = formState.requirements.map((req) => ({
                name: req.name,
                url: req.url,
                ...(formState.newAssessment.id
                    ? { assessmentId: parseInt(formState.newAssessment.id) }
                    : {}),
            }));

            const assessmentDataRequest = {
                description: formState.newAssessment.description,
                assessment: formState.newAssessment.assessment,
                conclusions: formState.newAssessment.conclusions,
                areaId: formState.newAssessment.areaId,
                requeriments: cleanedRequirements,
                formId: parseInt(safeFormId),
            };

            if (formState.newAssessment.id) {
                await updateAssessment(formState.newAssessment.id, assessmentDataRequest);
            } else {
                await addAssessment(assessmentDataRequest);
            }

            handleCloseModal();
        } catch (error) {
            console.error('Error al añadir/actualizar la valoración:', error);
        }
    }, [
        formState,
        safeFormId,
        updateAssessment,
        addAssessment,
        handleCloseModal,
    ]);

    // Handlers para eliminación
    const handleDelete = useCallback((id: string, name: string) => {
        setFormState(prev => ({
            ...prev,
            assessmentToDelete: { id, name }
        }));
        setUiState(prev => ({ ...prev, isConfirmDeleteOpen: true }));
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        setFormState(prev => {
            if (prev.assessmentToDelete.id) {
                try {
                    deleteAssessment(prev.assessmentToDelete.id);
                } catch (error) {
                    console.error('Error al eliminar valoración:', error);
                }
            }
            return {
                ...prev,
                assessmentToDelete: { id: null, name: null }
            };
        });
        setUiState(prev => ({ ...prev, isConfirmDeleteOpen: false }));
    }, [deleteAssessment]);

    // Handler para edición
    const handleEdit = useCallback((assessment: Assessment) => {
        setFormState(prev => ({
            ...prev,
            newAssessment: {
                id: assessment.id?.toString(),
                description: assessment.description!,
                assessment: parseInt(assessment.assessment!),
                conclusions: assessment.conclusions!,
                areaId: assessment.area?.id!,
            },
            requirements: assessment.requeriments?.map(req => ({
                id: req.id?.toString() || String(Date.now()),
                name: req.name || '',
                url: req.url || '',
                assessmentId: assessment.id! || 0
            })) || []
        }));
        setUiState(prev => ({ ...prev, isModalOpen: true }));
    }, []);

    // Handler para visualización
    const handleView = useCallback(async (assessmentId: string) => {
        try {
            const assessment = await getAssessmentById(assessmentId);
            if (assessment) {
                setFormState(prev => ({
                    ...prev,
                    viewAssessment: assessment
                }));
                setUiState(prev => ({ ...prev, isViewModalOpen: true }));
            }
        } catch (error) {
            console.error('Error al obtener los detalles de la valoración:', error);
        }
    }, [getAssessmentById]);

    // Utilidad para truncar texto
    const truncateText = useCallback((text: string, maxLength = 60) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    }, []);

    // Filtrado de assessments
    const filteredAssessments = useMemo(() => {
        let filtered = assessmentList;
        if (uiState.filter !== AreaNames.ALL) {
            filtered = assessmentList.filter(
                (assessment) => assessment.area?.name === uiState.filter
            );
        }
        return filtered;
    }, [assessmentList, uiState.filter]);

    const listRequirements = (requirements: Requeriment[]) => {
        let namelist = ''
        requirements.forEach(element => {
            namelist += `${element.name}, `
        });

        return namelist;
    }

    // Renderizado de filas de la tabla
    const renderTableRows = useCallback(() => {
        return paginatedItems.map((assessment: any) => ({
            Área: truncateText(assessment.description),
            Requisitos: listRequirements(assessment.requeriments) || 'Sin requerimientos',
            Valoración: assessment.assessment,
            Acciones: (
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <IconButtonComponent
                        variant="edit"
                        onClick={() => handleEdit(assessment)}
                    />
                    <IconButtonComponent
                        variant="delete"
                        onClick={() => handleDelete(assessment.id.toString(), assessment.description)}
                    />
                    <IconButtonComponent
                        variant="view"
                        onClick={() => handleView(assessment.id.toString())}
                    />
                </div>
            ),
        }));
    }, [paginatedItems, handleEdit, handleDelete, handleView, truncateText]);

    const { filter } = uiState;
    const { assessmentToDelete, viewAssessment } = formState;
    const { isViewModalOpen, isConfirmDeleteOpen } = uiState;

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
                isOpen={uiState.isModalOpen}
                onClose={() => setUiState(prev => ({ ...prev, isModalOpen: false }))}
                title={formState.newAssessment.id ? 'Editar Valoración' : 'Nueva Valoración'}
                primaryButtonText={formState.newAssessment.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleSubmit}
                size="large"
            >
                <form className="space-y-4">
                    <AssessmentForm
                        newAssessment={formState.newAssessment}
                        selectedArea={formState.selectedArea}
                        formErrors={formState.formErrors}
                        areaList={areaList}
                        onAssessmentChange={handleAssessmentChange}
                        onAreaChange={handleAreaChange}
                    />
                    <RequirementsSection
                        requirements={formState.requirements}
                        newRequirement={formState.newRequirement}
                        onRequirementChange={handleRequirementChange}
                        onAddRequirement={handleAddRequirement}
                        onDeleteRequirement={handleDeleteRequirement}
                    />
                </form>
            </ModalComponent>

            <ViewAssessmentModal
                isOpen={isViewModalOpen}
                assessment={viewAssessment}
                onClose={() => setUiState(prev => ({ ...prev, isViewModalOpen: false }))}
            />

            <ConfirmDeleteModal
                message={`¿Estás seguro de que deseas eliminar el formulario "${assessmentToDelete.name}"?`}
                isOpen={isConfirmDeleteOpen}
                onClose={() => setUiState(prev => ({ ...prev, isConfirmDeleteOpen: false }))}
                onSubmit={handleConfirmDelete}
            />
        </>
    );
};

export default AssessmentPage;
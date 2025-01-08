import React, { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import { useAuthContext } from '../../../context/AuthContext';

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
    file: null,
};

const AssessmentPage: React.FC = () => {
    const { formId } = useParams<{ formId: string }>();
    const safeFormId = formId || '';
    const navigate = useNavigate();
    
    const location = useLocation();
    const observation = location.state?.formObservation; 
    const classroom = location.state?.classroom;

    const { getUserRole } = useAuthContext();
    const role = getUserRole();

    const [uiState, setUiState] = useState({
        isModalOpen: false,
        isConfirmDeleteOpen: false,
        isViewModalOpen: false,
        filter: '' as '' | AreaNames,
        isLoading: false,
    });

    const [formState, setFormState] = useState({
        newAssessment: INITIAL_ASSESSMENT_DATA,
        requirements: [] as Requeriment[],
        deletedRequirements: [] as string[],
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
            newRequirement: INITIAL_REQUIREMENT_DATA,
            deletedRequirements: []
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
            const { file } = prev.newRequirement;
            if (!file) return prev;

            const newRequirement = {
                ...prev.newRequirement,
                id: String(Date.now()),
                originalFileName: file.name,
            };

            return {
                ...prev,
                requirements: [...prev.requirements, newRequirement],
                newRequirement: {
                    ...INITIAL_REQUIREMENT_DATA,
                    file: null,
                },
            };
        });
    }, []);

    const handleDeleteRequirement = useCallback((reqId: string) => {
        setFormState(prev => ({
            ...prev,
            requirements: prev.requirements.filter(req => req.id !== reqId),
            deletedRequirements: [...prev.deletedRequirements, reqId]
        }));
    }, []);

    const handleFileChange = useCallback((file: File) => {
        setFormState((prev) => ({
            ...prev,
            newRequirement: { ...prev.newRequirement, file },
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

            if (!safeFormId) {
                console.error('El ID del formulario (formId) es obligatorio.');
                return;
            }

            setUiState(prev => ({ ...prev, isLoading: true }));

            const formData = new FormData();
            formData.append('description', formState.newAssessment.description ?? '');
            formData.append('assessment', formState.newAssessment.assessment?.toString() ?? '');
            formData.append('conclusions', formState.newAssessment.conclusions ?? '');
            formData.append('areaId', formState.newAssessment.areaId?.toString() ?? '');
            formData.append('formId', safeFormId.toString());
            formState.requirements.forEach((req) => {
                if (req.file) {
                    formData.append('files', req.file);
                }
            });
            formData.append('deletedRequirements', JSON.stringify(formState.deletedRequirements));

            if (formState.newAssessment.id) {
                await updateAssessment(formState.newAssessment.id, formData);
                handleCloseModal();
            } else {
                await addAssessment(formData);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error al añadir/actualizar la valoración:', error);
        } finally {
            setUiState(prev => ({ ...prev, isLoading: false }));
        }
    }, [
        formState,
        formState.newAssessment,
        safeFormId,
        updateAssessment,
        addAssessment
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
        if (uiState.filter.toLowerCase() !== AreaNames.ALL.toLowerCase()) {
            filtered = assessmentList.filter(
                (assessment) =>
                    assessment.area?.name.toLowerCase() === uiState.filter.toLowerCase()
            );
        }
        return filtered;
    }, [assessmentList, uiState.filter]);

    const listRequirements = (requirements: Requeriment[]) => {
        if (!requirements || requirements.length === 0) {
            return <span>Sin requerimientos</span>;
        }

        return (
            <ul className="list-disc list-inside">
                {requirements.map((element, index) => (
                    <li key={index}>{element.name}</li>
                ))}
            </ul>
        );
    };

    const handleNavigateRosseta = () => {
        navigate('/classrooms/evaluation-summary', { state: { formId: safeFormId, formObservation: observation, classroom: classroom } });
    }

    const dynamicHeaders = useMemo(() => {
        const areaName = uiState.filter === AreaNames.ALL ? "Todas" : uiState.filter;
        return [areaName, "Requisitos", "Valoración", "Acciones"];
    }, [uiState.filter]);

    // Renderizado de filas de la tabla
    const renderTableRows = useCallback(() => {
        return paginatedItems.map((assessment: any) => ({
            Área: truncateText(assessment.description),
            Requisitos: listRequirements(assessment.requeriments) || 'Sin requerimientos',
            Valoración: assessment.assessment,
            Acciones: (
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    {!(role === 'DedteF') && (
                        <>
                            <IconButtonComponent
                                variant="edit"
                                onClick={() => handleEdit(assessment)}
                            />
                            <IconButtonComponent
                                variant="delete"
                                onClick={() => handleDelete(assessment.id.toString(), assessment.description)}
                            />
                        </>
                    )}
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

                    <div className="flex w-full justify-end mb-4">
                        {((role !== 'Evaluador') && (role !== 'DedteF')) && (
                            <AddButtonComponent onClick={handleAddClick} />
                        )}

                        <button
                            className="bg-black hover:bg-slate-700 text-white text-sm w-44 h-9 p-2 rounded-lg ml-2"
                            onClick={() => handleNavigateRosseta()}
                        >
                            VISUALIZAR ROSETA
                        </button>
                    </div>

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
                        <TableComponent headers={dynamicHeaders} rows={renderTableRows()} />
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
                primaryButtonText={uiState.isLoading
                    ? (formState.newAssessment.id ? 'ACTUALIZANDO...' : 'AGREGANDO...')
                    : (formState.newAssessment.id ? 'ACTUALIZAR' : 'AGREGAR')
                }
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
                        onFileChange={handleFileChange}
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
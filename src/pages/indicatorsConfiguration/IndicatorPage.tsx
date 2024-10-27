import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { AddButtonComponent, AlertComponent, ConfirmDeleteModal, CycleResourceIndicatorList, HeaderComponent, IndicatorForm, ModalComponent, PageHeaderComponent } from "../../components";
import { ErrorPage } from "../utils";
import { useCycle, useIndicator } from "../../hooks";

const IndicatorPage: React.FC = () => {
    const { areaId } = useParams<{ areaId: string }>();
    const location = useLocation();
    const areaName = location.state.areaName;
    const safeAreaId = areaId || '';

    const { indicatorList, resourceList, contentList, error, successMessage, addIndicator, updateIndicator, deleteIndicator, fetchResourceList, fetchContentList } = useIndicator(safeAreaId);
    const { cycleList } = useCycle();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    const [selectedCycle, setSelectedCycle] = useState<string>('');
    const [selectedResource, setSelectedResource] = useState<string>('');
    const [selectedContent, setSelectedContent] = useState<string>('');

    const [indicatorName, setIndicatorName] = useState<string>('');
    const [newIndicator, setNewIndicator] = useState({ id: '', name: indicatorName, areaId: safeAreaId, resourceId: selectedResource, contentId: selectedContent ? selectedContent : '' });
    const [indicatorToDelete, setIndicatorToDelete] = useState<{ id: string | null, name: string | null }>({ id: null, name: null });

    const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

    // Estado para manejar la expansión de ciclos y recursos
    const [expandedCycleId, setExpandedCycleId] = useState<string | null>(null);
    const [expandedResourceId, setExpandedResourceId] = useState<string | null>(null);

    // Funciones para alternar la expansión de ciclos y recursos
    const toggleCycleExpansion = (cycleId: string) => {
        if (expandedCycleId === cycleId) {
            setExpandedCycleId(null);
        } else {
            setExpandedCycleId(cycleId);
            fetchResourceList(cycleId);
        }
    };

    const toggleResourceExpansion = (resourceId: string) => {
        if (expandedResourceId === resourceId) {
            setExpandedResourceId(null);
        } else {
            setExpandedResourceId(resourceId);
            fetchContentList(resourceId);
        }
    };

    // Cargar recursos cuando se selecciona un ciclo
    useEffect(() => {
        if (selectedCycle) {
            fetchResourceList(selectedCycle);
        }
    }, [selectedCycle]);

    // Cargar contenidos cuando se selecciona un recurso
    useEffect(() => {
        if (selectedResource) {
            fetchContentList(selectedResource);
        }
    }, [selectedResource]);

    const resetIndicatorForm = () => {
        setNewIndicator({ id: '', name: '', areaId: '', resourceId: '', contentId: '' });
        setSelectedCycle('');
        setSelectedResource('');
        setSelectedContent('');
        setIndicatorName('');
        setErrorMessages({});
    }

    const handleAddClick = () => {
        resetIndicatorForm();
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        resetIndicatorForm();
        setIsModalOpen(false);
    }

    const handleCycleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCycle(e.target.value);
        setSelectedResource('');
        setSelectedContent('');
    };

    const handleResourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const resourceId = e.target.value;
        setSelectedResource(resourceId);
        setSelectedContent('');
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedContent(e.target.value);
    };

    const handleAddOrEditIndicator = async () => {
        const errors: { [key: string]: string } = {};

        if (!indicatorName) {
            errors.name = 'El nombre del indicador es obligatorio.';
        }
        if (!selectedCycle) {
            errors.cycleId = 'Debe seleccionar un ciclo.';
        }
        if (!selectedResource) {
            errors.resourceId = 'Debe seleccionar un recurso.';
        }

        setErrorMessages(errors);

        if (Object.keys(errors).length > 0) return;

        const indicatorData = {
            name: indicatorName,
            areaId: Number(safeAreaId),
            resourceId: Number(selectedResource),
            contentId: selectedContent ? Number(selectedContent) : undefined,
        };
        console.log(indicatorData)

        try {
            newIndicator.id
                ? await updateIndicator(newIndicator.id, indicatorData)
                : await addIndicator(indicatorData);
            handleCloseModal();
        } catch (error) {
            console.error("Error al agregar/editar el indicador:", error);
        }
    };

    const handleDelete = (id: string, name: string) => {
        setIndicatorToDelete({ id, name });
        setIsConfirmDeleteOpen(true);
    }

    const confirmDelete = async () => {
        if (indicatorToDelete.id) {
            try {
                await deleteIndicator(indicatorToDelete.id);
            } catch (error) {
                console.error('Error al eliminar indicador:', error);
            } finally {
                setIndicatorToDelete({id: null, name: null});
                setIsConfirmDeleteOpen(false);
            }
        }
    };

    const handleEdit = (indicator: any) => {
        setNewIndicator({
            id: indicator.id,
            name: indicator.name,
            areaId: indicator.areaId,
            resourceId: indicator.resource?.id || '',
            contentId: indicator.content?.id || ''
        });

        setSelectedCycle(indicator.resource.cycle.id);
        setSelectedResource(indicator.resource?.id || '');
        setSelectedContent(indicator.content?.id || '');

        setIndicatorName(indicator.name);
        setIsModalOpen(true);
    };

    if (error) return <ErrorPage message={error} />;

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title={`ÁREA: ${areaName} - INDICADORES`} />
                    {successMessage && (
                        <AlertComponent
                            type="success"
                            message={successMessage}
                            className="mb-4 w-full"
                        />
                    )}
                    <AddButtonComponent onClick={handleAddClick} />

                    <ModalComponent
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        title={newIndicator.id ? "Editar Indicador" : "Agregar Nuevo Indicador"}
                        primaryButtonText={newIndicator.id ? "ACTUALIZAR" : "AGREGAR"}
                        onSubmit={handleAddOrEditIndicator}
                        size="medium"
                    >
                        <IndicatorForm
                            selectedCycle={selectedCycle}
                            selectedResource={selectedResource}
                            selectedContent={selectedContent}
                            indicatorName={indicatorName}
                            cycleList={cycleList}
                            resourceList={resourceList}
                            contentList={contentList}
                            errorMessages={errorMessages}
                            handleCycleChange={handleCycleChange}
                            handleResourceChange={handleResourceChange}
                            handleContentChange={handleContentChange}
                            setIndicatorName={setIndicatorName}
                        />
                    </ModalComponent>

                    {/* Ciclos */}
                    <CycleResourceIndicatorList
                        cycleList={cycleList}
                        resourceList={resourceList}
                        indicatorList={indicatorList}
                        expandedCycles={expandedCycleId ? { [expandedCycleId]: true } : {}}
                        expandedResources={expandedResourceId ? { [expandedResourceId]: true } : {}}
                        toggleCycleExpansion={toggleCycleExpansion}
                        toggleResourceExpansion={toggleResourceExpansion}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                    />
                </div>
                <ConfirmDeleteModal
                    message={`¿Estás seguro de que deseas eliminar el indicador "${indicatorToDelete.name}"?`}
                    isOpen={isConfirmDeleteOpen}
                    onClose={() => setIsConfirmDeleteOpen(false)}
                    onSubmit={confirmDelete}
                />
            </div>
        </>
    );
};

export default IndicatorPage;

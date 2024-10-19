import { useState, useEffect } from "react";
import HeaderComponent from "../../components/layout/HeaderComponent";
import AddButtonComponent from "../../components/ui/AddButtonComponent";
import ModalComponent from "../../components/ui/ModalComponent";
import PageHeaderComponent from "../../components/ui/PageHeader";
import useCycle from "../../hooks/indicatorsConfiguration/useCycle";
import useIndicator from "../../hooks/indicatorsConfiguration/useIndicator";
import { SelectInput } from "../../components/ui/SelectInput";
import { useLocation, useParams } from "react-router-dom";
import { ActionButtonComponent, ConfirmDeleteModal } from "../../components/ui";
import { LoadingPage, ErrorPage } from "../utils";

const IndicatorPage: React.FC = () => {
    const { areaId } = useParams<{ areaId: string }>();
    const location = useLocation();
    const areaName = location.state.areaName;
    const safeAreaId = areaId || '';

    const { indicatorList, resourceList, contentList, loading, error, addIndicator, updateIndicator, deleteIndicator, fetchResourceList, fetchContentList } = useIndicator(safeAreaId);
    const { cycleList } = useCycle();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    const [selectedCycle, setSelectedCycle] = useState<string>('');
    const [selectedResource, setSelectedResource] = useState<string>('');
    const [selectedContent, setSelectedContent] = useState<string>('');

    const [indicatorName, setIndicatorName] = useState<string>('');
    const [newIndicator, setNewIndicator] = useState({ id: '', name: indicatorName, areaId: safeAreaId, resourceId: selectedResource, contentId: selectedContent ? selectedContent : '' });
    const [indicatorToDelete, setIndicatorToDelete] = useState<string | null>(null);

    const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

    // Estado para manejar la expansión de ciclos y recursos
    const [expandedCycles, setExpandedCycles] = useState<{ [key: string]: boolean }>({});
    const [expandedResources, setExpandedResources] = useState<{ [key: string]: boolean }>({});

    // Funciones para alternar la expansión de ciclos y recursos
    const toggleCycleExpansion = (cycleId: string) => {
        setExpandedCycles(prev => ({ ...prev, [cycleId]: !prev[cycleId] }));
        fetchResourceList(cycleId);
    };

    const toggleResourceExpansion = (resourceId: string) => {
        setExpandedResources(prev => ({ ...prev, [resourceId]: !prev[resourceId] }));
        fetchContentList(resourceId);
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

    const handleDelete = (id: string) => {
        setIndicatorToDelete(id);
        setIsConfirmDeleteOpen(true);
    }

    const confirmDelete = async () => {
        if (indicatorToDelete) {
            try {
                await deleteIndicator(indicatorToDelete);
            } catch (error) {
                console.error('Error al eliminar indicador:', error);
            } finally {
                setIndicatorToDelete(null);
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

    if (loading) return <LoadingPage />;
    if (error) return <ErrorPage message={error} />;

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title={`ÁREA: ${areaName} - INDICADORES`} />
                    <AddButtonComponent onClick={handleAddClick} />

                    <ModalComponent
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        title={newIndicator.id ? "Editar Indicador" : "Agregar Nuevo Indicador"}
                        primaryButtonText={newIndicator.id ? "ACTUALIZAR" : "AGREGAR"}
                        onSubmit={handleAddOrEditIndicator}
                        size="medium"
                    >
                        <form className="space-y-4">
                            <div className="mb-4">
                                <SelectInput
                                    label="Ciclo"
                                    value={selectedCycle}
                                    options={cycleList}
                                    onChange={handleCycleChange}
                                    error={errorMessages.cycleId}
                                />
                            </div>

                            {selectedCycle && (
                                <div className="mb-4">
                                    <SelectInput
                                        label="Recurso"
                                        value={selectedResource}
                                        options={resourceList}
                                        onChange={handleResourceChange}
                                        error={errorMessages.resourceId}
                                    />
                                </div>
                            )}

                            {selectedResource && contentList.length > 0 && (
                                <div className="mb-4">
                                    <SelectInput
                                        label="Contenido"
                                        value={selectedContent}
                                        options={contentList}
                                        onChange={handleContentChange}
                                    //error={errorMessages.cycleId}
                                    />
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Nombre del Indicador</label>
                                <input
                                    type="text"
                                    value={indicatorName}
                                    onChange={(e) => setIndicatorName(e.target.value)}
                                    className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                                />
                                {errorMessages.name && <p className="text-red-600 text-sm">{errorMessages.name}</p>}
                            </div>
                        </form>
                    </ModalComponent>

                    {/* Ciclos */}
                    {cycleList.map(cycle => (
                        <div key={cycle.id} className="w-full mt-4">
                            <button
                                onClick={() => toggleCycleExpansion(cycle.id.toString())}
                                className="w-full text-left p-4 bg-gray-200 hover:bg-gray-300 rounded-md mb-2 transition-all duration-300 ease-in-out"
                            >
                                {cycle.name}
                            </button>

                            {/* Mostrar recursos si el ciclo está expandido */}
                            {expandedCycles[cycle.id] && (
                                <div className="pl-4 mt-2">
                                    {resourceList.map(resource => (
                                        <div key={resource.id} className="mb-4">
                                            <button
                                                onClick={() => toggleResourceExpansion(resource.id.toString())}
                                                className="w-full text-left p-4 bg-gray-200 hover:bg-gray-300 rounded-md mb-2 transition-all duration-300 ease-in-out"
                                            >
                                                {resource.name}
                                            </button>

                                            {/* Mostrar la tabla de indicadores si el recurso está expandido */}
                                            {expandedResources[resource.id] && (
                                                <div className="mt-2 pl-4">
                                                    <table className="min-w-full bg-white shadow-md rounded-lg">
                                                        <thead className="bg-primary-red-color text-white">
                                                            <tr>
                                                                <th className="py-2 px-4">Contenido</th>
                                                                <th className="py-2 px-4">Indicador</th>
                                                                <th className="py-2 px-4">Acciones</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {indicatorList
                                                                .filter(indicator => indicator.resource.id === resource.id)
                                                                .map(indicator => (
                                                                    <tr key={indicator.id} className="border-b">
                                                                        <td className="py-2 px-4">
                                                                            {indicator.content ? indicator.content.name : indicator.resource.name}
                                                                        </td>
                                                                        <td className="py-2 px-4">{indicator.name}</td>
                                                                        <td className="py-2 px-4">
                                                                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                                                                                <ActionButtonComponent
                                                                                    label="EDITAR"
                                                                                    onClick={() => handleEdit(indicator)}
                                                                                    bgColor="bg-secondary-button-color"
                                                                                />
                                                                                <ActionButtonComponent
                                                                                    label="ELIMINAR"
                                                                                    onClick={() => handleDelete(indicator.id.toString())}
                                                                                    bgColor="bg-primary-red-color"
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <ConfirmDeleteModal
                    isOpen={isConfirmDeleteOpen}
                    onClose={() => setIsConfirmDeleteOpen(false)}
                    onSubmit={confirmDelete}
                />
            </div>
        </>
    );
};

export default IndicatorPage;

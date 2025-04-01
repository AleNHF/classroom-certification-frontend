import React, { useCallback, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal, ActionButtonComponent, HeaderComponent, AlertComponent, PaginationComponent } from '../../components';
import { ErrorPage } from '../utils';
import { useResource } from '../../hooks';

const headers = ["Nombre del recurso", "Acciones"];

const ResourcePage: React.FC = () => {
    const { cycleId } = useParams<{ cycleId: string }>();
    const location = useLocation();
    const cycleName = location.state?.cycleName;
    const safeCycleId = cycleId || '';
    const navigate = useNavigate();

    // Estados de UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    // Estados de Datos
    const [newResource, setNewResource] = useState({ id: '', name: '', cycleId: -1 });
    const [resourceToDelete, setResourceToDelete] = useState<{ id: string | null, name: string | null }>({ id: null, name: null });
    
    // Estados de validación y errores
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [paginatedItems, setPaginatedItems] = useState<any[]>([]);

    const {
        resourceList,
        error,
        successMessage,
        addResource,
        updateResource,
        deleteResource
    } = useResource(safeCycleId);

    // Manejadores de modal
    const resetResourceForm = () => {
        setNewResource({ id: '', name: '', cycleId: -1 });
        setErrorMessage(null);
    };

    const handleAddClick = () => {
        resetResourceForm();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetResourceForm();
    };

    // Manejador de submit del formulario
    const handleSubmit = useCallback(async () => {
        if (!newResource.name.trim()) {
            setErrorMessage('El nombre del recurso es obligatorio.');
            return;
        }

        const resourceData = {
            name: newResource.name,
            cycleId: Number(cycleId)
        };

        try {
            newResource.id
                ? await updateResource(newResource.id, resourceData)
                : await addResource(resourceData);

            handleCloseModal();
        } catch (error) {
            console.error('Error al añadir/actualizar el ciclo:', error);
        }
    }, [newResource, addResource, updateResource]);

    // Manejadores de eliminación
    const handleDelete = useCallback((id: string, name: string) => {
        setResourceToDelete({ id, name });
        setIsConfirmDeleteOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (resourceToDelete.id) {
            try {
                await deleteResource(resourceToDelete.id);
            } catch (error) {
                console.error('Error al eliminar recurso:', error);
            } finally {
                setResourceToDelete({ id: null, name: null});
                setIsConfirmDeleteOpen(false);
            }
        }
    }, [resourceToDelete.id, deleteResource]);

    const handleEdit = (resource: any) => {
        setNewResource({
            id: resource.id,
            name: resource.name,
            cycleId: resource.cycleId
        });
        setIsModalOpen(true);
    };

    const handleContentsClick = (resourceId: string, resourceName: string, cycleName: string) => {
        navigate(`/indicators-configuration/contents/${resourceId}`, { state: { cycleName: cycleName, resourceName: resourceName } })
    };

    // Renderizado de filas de la tabla
    const renderTableRows = useCallback(() => {
        return paginatedItems.map((resource: any) => ({
            Nombre: resource.name,
            Acciones: (
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <ActionButtonComponent
                        label="EDITAR"
                        onClick={() => handleEdit(resource)}
                        bgColor='bg-secondary-button-color hover:bg-blue-800'
                    />
                    <ActionButtonComponent
                        label="ELIMINAR"
                        onClick={() => handleDelete(resource.id, resource.name)}
                        bgColor="bg-primary-red-color hover:bg-red-400"
                    />
                    <ActionButtonComponent
                        label="CONTENIDO"
                        onClick={() => handleContentsClick(resource.id, resource.name, cycleName)}
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
                    <PageHeaderComponent title={`CICLO: ${cycleName} - RECURSOS`} />
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
                        items={resourceList}
                        onPageItemsChange={setPaginatedItems}
                    />
                </div>
            </div>

            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={newResource.id ? 'Editar Recurso' : 'Nuevo Recurso'}
                primaryButtonText={newResource.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleSubmit}
                size="medium"
            >
                <form className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={newResource.name}
                            onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                        {errorMessage && (
                            <p className="text-red-600 text-sm mt-1">{errorMessage}</p> // Mostrar el mensaje de error
                        )}
                    </div>
                </form>
            </ModalComponent>

            <ConfirmDeleteModal
                message={`¿Estás seguro de que deseas eliminar el recurso "${resourceToDelete.name}"?`}
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onSubmit={handleConfirmDelete}
            />
        </>
    );
};

export default ResourcePage;
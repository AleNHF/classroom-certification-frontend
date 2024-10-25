import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal, ActionButtonComponent, HeaderComponent } from '../../components';
import { LoadingPage, ErrorPage } from '../utils';
import { useResource } from '../../hooks';

const headers = ["Nombre del recurso", "Acciones"];

const ResourcePage: React.FC = () => {
    const { cycleId } = useParams<{ cycleId: string }>();
    const location = useLocation();
    const cycleName = location.state?.cycleName;
    const safeCycleId = cycleId || '';
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [newResource, setNewResource] = useState({ id: '', name: '', cycleId: -1 });
    const [resourceToDelete, setResourceToDelete] = useState<{ id: string | null, name: string | null }>({ id: null, name: null });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const {
        resourceList,
        loading,
        error,
        addResource,
        updateResource,
        deleteResource
    } = useResource(safeCycleId);

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

    const handleAddOrUpdate = async () => {
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
    };

    const handleDelete = (id: string, name: string) => {
        setResourceToDelete({ id, name});
        setIsConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
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
    };

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

    const rows = resourceList.map((resource: any) => ({
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
                    <PageHeaderComponent title={`CICLO: ${cycleName} - RECURSOS`} />
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
                title={newResource.id ? 'Editar Recurso' : 'Nuevo Recurso'}
                primaryButtonText={newResource.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleAddOrUpdate}
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
                onSubmit={confirmDelete}
            />
        </>
    );
};

export default ResourcePage;
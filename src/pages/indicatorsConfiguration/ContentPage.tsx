import React, { useCallback, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ActionButtonComponent, PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal, HeaderComponent, AlertComponent, PaginationComponent } from '../../components';
import { ErrorPage } from '../utils';
import { useContent } from '../../hooks';

const headers = ["Nombre del recurso", "Acciones"];

const ContentPage: React.FC = () => {
    const { resourceId } = useParams<{ resourceId: string }>();
    const location = useLocation();
    const resourceName = location.state?.resourceName;
    const cycleName = location.state?.cycleName;
    const safeResourceId = resourceId || '';

    // Estados de UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    // Estados de Datos
    const [newContent, setNewContent] = useState({ id: '', name: '', resourceId: -1 });
    const [contentToDelete, setContentToDelete] = useState<{ id: string | null, name: string | null }>({ id: null, name: null });

    // Estados de validación y errores
    const [errorMessage, setErrorMessage] = useState<string | null>(null); 

    const [paginatedItems, setPaginatedItems] = useState<any[]>([]);
    
    const {
        contentList,
        error,
        successMessage,
        addContent,
        updateContent,
        deleteContent
    } = useContent(safeResourceId);

    // Manejadores de modal
    const resetContentForm = () => {
        setNewContent({ id: '', name: '', resourceId: -1 });
        setErrorMessage(null);
    };

    const handleAddClick = () => {
        resetContentForm();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetContentForm();
    };

    // Manejador de submit del formulario
    const handleSubmit = useCallback(async () => {
        if (!newContent.name.trim()) {
            setErrorMessage('El nombre del contenido es obligatorio.');
            return;
        }

        const contentData = {
            name: newContent.name,
            resourceId: Number(resourceId) 
        };

        try {
            newContent.id 
                ? await updateContent(newContent.id, contentData)
                : await addContent(contentData);
                
            handleCloseModal();
        } catch (error) {
            console.error('Error al añadir/actualizar el contenido:', error);
        }
    }, [newContent, addContent, updateContent]);

    // Manejadores de eliminación
    const handleDelete = useCallback((id: string, name: string) => {
        setContentToDelete({ id, name });
        setIsConfirmDeleteOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (contentToDelete.id) {
            try {
                await deleteContent(contentToDelete.id);
            } catch (error) {
                console.error('Error al eliminar contenido:', error);
            } finally {
                setContentToDelete({ id: null, name: null});
                setIsConfirmDeleteOpen(false);
            }
        }
    }, [contentToDelete.id, deleteContent]);

    const handleEdit = (content: {id: string, name: string, resourceId: number}) => {
        setNewContent({ 
            id: content.id, 
            name: content.name,
            resourceId: content.resourceId
        });
        setIsModalOpen(true);
    };

    // Renderizado de filas de la tabla
    const renderTableRows = useCallback(() => {
        return paginatedItems.map((content: any) => ({
            Nombre: content.name,
            Acciones: (
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <ActionButtonComponent
                        label="EDITAR"
                        onClick={() => handleEdit(content)}
                        bgColor='bg-secondary-button-color hover:bg-blue-800'
                    />
                    <ActionButtonComponent
                        label="ELIMINAR"
                        onClick={() => handleDelete(content.id, content.name)}
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
                    <PageHeaderComponent title={`CICLO: ${cycleName}/${resourceName} - CONTENIDO`} />
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
                        items={contentList}
                        onPageItemsChange={setPaginatedItems}
                    />
                </div>
            </div>

            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={newContent.id ? 'Editar Contenido' : 'Nuevo Contenido'}
                primaryButtonText={newContent.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleSubmit}
                size="medium"
            >
                <form className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={newContent.name}
                            onChange={(e) => setNewContent({ ...newContent, name: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                        {errorMessage && (
                            <p className="text-red-600 text-sm mt-1">{errorMessage}</p> 
                        )}
                    </div>
                </form>
            </ModalComponent>

            <ConfirmDeleteModal 
                message={`¿Estás seguro de que deseas eliminar el contenido "${contentToDelete.name}"?`}
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)} 
                onSubmit={handleConfirmDelete} 
            />
        </>
    );
};

export default ContentPage;
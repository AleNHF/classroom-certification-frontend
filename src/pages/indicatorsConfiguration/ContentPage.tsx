import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ActionButtonComponent, PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal, HeaderComponent } from '../../components';
import { LoadingPage, ErrorPage } from '../utils';
import { useContent } from '../../hooks';

const headers = ["Nombre del recurso", "Acciones"];

const ContentPage: React.FC = () => {
    const { resourceId } = useParams<{ resourceId: string }>();
    const location = useLocation();
    const resourceName = location.state?.resourceName;
    const cycleName = location.state?.cycleName;
    const safeResourceId = resourceId || '';

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [newContent, setNewContent] = useState({ id: '', name: '', resourceId: -1 });
    const [contentToDelete, setContentToDelete] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); 
    const [isLoading, setIsLoading] = useState(true);
    
    const {
        contentList,
        loading,
        error,
        addContent,
        updateContent,
        deleteContent
    } = useContent(safeResourceId);

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

    const handleAddOrUpdate = async () => {
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
    };

    const handleDelete = (id: string) => {
        setContentToDelete(id);
        setIsConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (contentToDelete) {
            try {
                await deleteContent(contentToDelete);
            } catch (error) {
                console.error('Error al eliminar contenido:', error);
            } finally {
                setContentToDelete(null);
                setIsConfirmDeleteOpen(false);
            }
        }
    };

    const handleEdit = (content: {id: string, name: string, resourceId: number}) => {
        setNewContent({ 
            id: content.id, 
            name: content.name,
            resourceId: content.resourceId
        });
        setIsModalOpen(true);
    };

    const rows = contentList.map((content: any) => ({
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
                    onClick={() => handleDelete(content.id)}
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
                    <PageHeaderComponent title={`CICLO: ${cycleName}/${resourceName} - CONTENIDO`} />
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
                title={newContent.id ? 'Editar Contenido' : 'Nuevo Contenido'}
                primaryButtonText={newContent.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleAddOrUpdate}
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
                            <p className="text-red-600 text-sm mt-1">{errorMessage}</p> // Mostrar el mensaje de error
                        )}
                    </div>
                </form>
            </ModalComponent>

            <ConfirmDeleteModal 
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)} 
                onSubmit={confirmDelete} 
            />
        </>
    );
};

export default ContentPage;
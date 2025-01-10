import React, { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeaderComponent, TableComponent, ConfirmDeleteModal, HeaderComponent, AlertComponent, PaginationComponent, ModalComponent, ActionButtonComponent } from '../../../components';
import { ErrorPage } from '../../utils';
import useAttach from '../../../hooks/classrooms/useAttach';

const headers = ["ID", "Fecha de creación", "Versión", "Acciones"];

const AttachmentPage: React.FC = () => {
    const location = useLocation();
    const classroom = location.state?.classroom;
    const moodleToken = localStorage.getItem('moodle_token') || '';
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [newAttachment, setNewAttachment] = useState<{ classroomId: number, courseId: number, token: string }>({ classroomId: 0, courseId: 0, token: '' });
    const [attachmentToDelete, setAttachmentToDelete] = useState<{ id: string | null, name: string | null }>({ id: null, name: null });
    const [paginatedItems, setPaginatedItems] = useState<any[]>([]);

    const { attachList, error, successMessage, getAttachmentById, addAttachment, deleteAttachment } = useAttach(classroom.id);

    const resetData = () => {
        setNewAttachment({ classroomId: 0, courseId: 0, token: '' });
    }

    const handleAddClick = useCallback(() => {
        resetData();
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        resetData();
        setIsModalOpen(false);
    }, []);

    // Handler para submit del formulario
    const handleSubmit = useCallback(async () => {
        try {
            if (!classroom.id) {
                console.error('El ID del aula (classroomId) es obligatorio.');
                return;
            }

            const data = {
                classroomId: classroom.id,
                courseId: classroom.moodleCourseId,
                token: moodleToken
            };

            await addAttachment(data);
            handleCloseModal();
            console.info(newAttachment);
        } catch (error) {
            console.error('Error al generar el anexo:', error);
        }
    }, [
        classroom,
        addAttachment,
        handleCloseModal,
    ]);

    // Handlers para eliminación
    const handleDelete = useCallback((id: string, name: string) => {
        setAttachmentToDelete({ id, name });
        setIsDeleting(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (attachmentToDelete.id) {
            try {
                await deleteAttachment(attachmentToDelete.id);
            } catch (error) {
                console.error('Error al eliminar formulario:', error);
            } finally {
                setAttachmentToDelete({ id: null, name: null });
                setIsDeleting(false);
            }
        }
    }, [attachmentToDelete.id, deleteAttachment]);

    // Handler para visualización
    const handleView = useCallback(async (attachmentId: string) => {
        try {
            const attachment = await getAttachmentById(attachmentId);
            if (attachment && attachment.url) {
                navigate(`/classrooms/evaluation-attachments/${attachmentId}`, { state: { attachContent: attachment.url, classroom: classroom } });
            } else {
                console.error('La URL del anexo no está disponible.');
            }
        } catch (error) {
            console.error('Error al obtener los detalles del anexo:', error);
        }
    }, [getAttachmentById, navigate]);

    // Renderizado de filas de la tabla
    const renderTableRows = useCallback(() => {
        return paginatedItems.map((attachment: any) => {
            const formattedDate = new Intl.DateTimeFormat('es-ES', {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(new Date(attachment.createdAt));

            return {
                ID: attachment.id,
                'Fecha de creación': formattedDate,
                Versión: attachment.version,
                Acciones: (
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                        <ActionButtonComponent
                            label="VER"
                            onClick={() => handleView(attachment.id.toString())}
                            bgColor="bg-optional-button-color hover:bg-slate-400 hover:bg-slate-400"
                        />
                        <ActionButtonComponent
                            label="ELIMINAR"
                            onClick={() => handleDelete(attachment.id.toString(), attachment.id.toString()!)}
                            bgColor="bg-primary-red-color hover:bg-red-400 hover:bg-blue-800"
                        />
                    </div>
                ),
            };
        });
    }, [paginatedItems, handleDelete, handleView]);

    if (error) return <ErrorPage message={error} />;

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title='ANEXOS DE LA EVALUACIÓN' />
                    {successMessage && (
                        <AlertComponent
                            type="success"
                            message={successMessage}
                            className="mb-4 w-full"
                        />
                    )}

                    <div className="flex w-full justify-end mb-4">
                        <button
                            className="bg-black hover:bg-slate-700 text-white text-sm w-44 h-9 p-2 rounded-lg ml-2"
                            onClick={() => handleAddClick()}
                        >
                            GENERAR NUEVO ANEXO
                        </button>
                    </div>

                    <div className="overflow-x-auto w-full">
                        <TableComponent headers={headers} rows={renderTableRows()} />
                    </div>
                    <PaginationComponent
                        items={attachList}
                        onPageItemsChange={setPaginatedItems}
                    />
                </div>
            </div>

            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={'Generar Anexo'}
                primaryButtonText={'GENERAR'}
                onSubmit={handleSubmit}
                size="small"
            >
                <div className="text-justify">
                    <p className="text-lg font-medium text-gray-700">¿Deseas generar un nuevo anexo?</p>
                    <p className="mt-2 text-sm text-gray-600">
                        Al confirmar, se registrará un nuevo anexo para esta aula virtual.
                    </p>
                </div>
            </ModalComponent>

            <ConfirmDeleteModal
                message={`¿Estás seguro de que deseas eliminar el anexo con ID:"${attachmentToDelete.name}"?`}
                isOpen={isDeleting}
                onClose={() => setIsDeleting(false)}
                onSubmit={handleConfirmDelete}
            />
        </>
    );
};

export default AttachmentPage;
import { useCallback, useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Action, ActionMessages, Attachment, FetchState } from '../../types';

// Definición de tipos específicos para mejor control
const ACTION_MESSAGES: Record<Action, ActionMessages> = {
    add: {
        loading: 'Agregando anexo...',
        success: 'Anexo agregada exitosamente',
        error: 'Error al agregar anexo'
    },
    update: {
        loading: 'Actualizando anexo                                                                                                                                                                                  ...',
        success: 'Anexo actualizada exitosamente',
        error: 'Error al actualizar anexo'
    },
    delete: {
        loading: 'Eliminando anexo...',
        success: 'Anexo eliminada exitosamente',
        error: 'Error al eliminar anexo'
    }
};

const useAttach = (classroomId: string) => {
    const [attachList, setAttachList] = useState<Attachment[]>([]);
    const [currentAtttach, setCurrentAttach] = useState<Attachment | null>(null);
    const [fetchState, setFetchState] = useState<FetchState>({
        loading: false,
        error: null,
        successMessage: null
    });

    // Función para limpiar mensajes después de un tiempo
    const clearMessages = useCallback(() => {
        setTimeout(() => {
            setFetchState(prev => ({
                ...prev,
                error: null,
                successMessage: null
            }));
        }, 3000);
    }, []);

    const fetchData = useCallback(async () => {
        setFetchState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const response = await apiService.getAttachmentsByClassroom(classroomId);
            setAttachList(response.data.attachments);
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Error al cargar los datos';

            setFetchState(prev => ({
                ...prev,
                error: errorMessage
            }));
            console.error('Error fetching data:', error);
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
    }, [classroomId]);

    const getAttachmentById = useCallback(async (id: string) => {
        try {
            const response = await apiService.getAttachmentById(id);
            setCurrentAttach(response.data.attachment);
            return response.data.attachment;
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Ha ocurrido un problema al cargar la información';

            setFetchState(prev => ({
                ...prev,
                error: errorMessage
            }));
            clearMessages();
            throw error;
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
    }, [clearMessages]);

    // Efecto inicial con retry
    useEffect(() => {
        const initFetch = async () => {
            try {
                await fetchData();
            } catch (error) {
                // Intenta nuevamente después de 5 segundos en caso de error
                setTimeout(fetchData, 5000);
            }
        };

        initFetch();
    }, [fetchData]);

    const handleAction = useCallback(async (
        action: Action,
        attachmentData?: { classroomId: number, courseId: number, token: string },
        id?: string,
    ) => {
        const messages = ACTION_MESSAGES[action];

        setFetchState(prev => ({
            ...prev,
            loading: true,
            error: null,
            successMessage: null
        }));
        try {
            if (action === 'add') {
                await apiService.addAttachment(attachmentData!);
            } else if (action === 'update') {
                await apiService.updateAttachment(id!, attachmentData!);
            } else if (action === 'delete') {
                await apiService.deleteAttachment(id!);
            }
            await fetchData();
            setFetchState(prev => ({
                ...prev,
                successMessage: messages.success
            }));
            clearMessages();
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : messages.error;

            setFetchState(prev => ({
                ...prev,
                error: errorMessage
            }));
            clearMessages();
            throw error;
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
    }, [fetchData, clearMessages]);

    // Optimización de funciones retornadas con useCallback
    const addAttachment = useCallback(
        (attachmentData: { classroomId: number, courseId: number, token: string }) => handleAction('add', attachmentData),
        [handleAction]
    );

    const updateAttachment = useCallback(
        (id: string, attachmentData: { classroomId: number, courseId: number, token: string }) => handleAction('update', attachmentData, id),
        [handleAction]
    );

    const deleteAttachment = useCallback(
        (id: string) => handleAction('delete', undefined, id),
        [handleAction]
    );

    return {
        attachList,
        currentAtttach,

        loading: fetchState.loading,
        error: fetchState.error,
        successMessage: fetchState.successMessage,

        getAttachmentById,
        addAttachment,
        updateAttachment,
        deleteAttachment
    };
};

export default useAttach;

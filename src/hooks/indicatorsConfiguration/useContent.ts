import { useCallback, useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Action, ActionMessages, Content, FetchState } from '../../types';

// Definición de tipos específicos para mejor control
const ACTION_MESSAGES: Record<Action, ActionMessages> = {
    add: {
        loading: 'Agregando contenido...',
        success: 'Contenido agregado exitosamente',
        error: 'Error al agregar contenido'
    },
    update: {
        loading: 'Actualizando contenido...',
        success: 'Contenido actualizado exitosamente',
        error: 'Error al actualizar contenido'
    },
    delete: {
        loading: 'Eliminando contenido...',
        success: 'Contenido eliminado exitosamente',
        error: 'Error al eliminar contenido'
    },
    fetch: {
        loading: 'Cargando...',
        success: 'Cargado exitosamente',
        error: 'Error al cargar'
    }
};

const useContent = (resourceId: string) => {
    const [contentList, setContentList] = useState<Content[]>([]);
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
        }, 5000);
    }, []);

    const fetchData = useCallback(async () => {
        setFetchState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const contentData = await apiService.getContents(resourceId);
            setContentList(contentData.data.contents);
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
    }, []);

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
        contentData?: { name: string; resourceId: number },
        id?: string
    ) => {
        const messages = ACTION_MESSAGES[action];

        setFetchState(prev => ({
            ...prev,
            loading: true,
            error: null,
            successMessage: null
        }));

        try {
            switch (action) {
                case 'add':
                    await apiService.addContent(contentData!);
                    break;
                case 'update':
                    await apiService.updateContent(id!, contentData!);
                    break;
                case 'delete':
                    await apiService.deleteContent(id!);
                    break;
            }
            await fetchData();
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
    const addContent = useCallback(
        (contentData: { name: string; resourceId: number }) => handleAction('add', contentData),
        [handleAction]
    );

    const updateContent = useCallback(
        (id: string, contentData: { name: string; resourceId: number }) => handleAction('update', contentData, id),
        [handleAction]
    );

    const deleteContent = useCallback(
        (id: string) => handleAction('delete', undefined, id),
        [handleAction]
    );

    return {
        contentList,

        loading: fetchState.loading,
        error: fetchState.error,
        successMessage: fetchState.successMessage,
        
        addContent,
        updateContent,
        deleteContent,
    };
};

export default useContent;
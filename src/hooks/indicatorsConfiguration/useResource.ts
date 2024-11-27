import { useCallback, useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Resource, FetchState, Action, ActionMessages } from '../../types';

// Definición de tipos específicos para mejor control
const ACTION_MESSAGES: Record<Action, ActionMessages> = {
    add: {
        loading: 'Agregando recurso...',
        success: 'Recurso agregado exitosamente',
        error: 'Error al agregar recurso'
    },
    update: {
        loading: 'Actualizando recurso...',
        success: 'Recurso actualizado exitosamente',
        error: 'Error al actualizar recurso'
    },
    delete: {
        loading: 'Eliminando recurso...',
        success: 'Recurso eliminado exitosamente',
        error: 'Error al eliminar recurso'
    },
    fetch: {
        loading: 'Cargando...',
        success: 'Cargado exitosamente',
        error: 'Error al cargar'
    }
};

const useResource = (cycleId: string) => {
    const [resourceList, setResourceList] = useState<Resource[]>([]);
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
            const resourceData = await apiService.getResources(cycleId);
            setResourceList(resourceData.data.resources);
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
        resourceData?: { name: string; cycleId: number },
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
                    await apiService.addResource(resourceData!);
                    break;
                case 'update':
                    await apiService.updateResource(id!, resourceData!);
                    break;
                case 'delete':
                    await apiService.deleteResource(id!);
                    break;
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
    const addResource = useCallback(
        (resourceData: { name: string; cycleId: number }) => handleAction('add', resourceData),
        [handleAction]
    );

    const updateResource = useCallback(
        (id: string, resourceData: { name: string; cycleId: number }) => handleAction('update', resourceData, id),
        [handleAction]
    );

    const deleteResource = useCallback(
        (id: string) => handleAction('delete', undefined, id),
        [handleAction]
    );

    return {
        resourceList,

        loading: fetchState.loading,
        error: fetchState.error,
        successMessage: fetchState.successMessage,

        addResource,
        updateResource,
        deleteResource,
    };
};

export default useResource;
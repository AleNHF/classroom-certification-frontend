import { useCallback, useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Action, ActionMessages, Area, FetchState } from '../../types';

// Definición de tipos específicos para mejor control
const ACTION_MESSAGES: Record<Action, ActionMessages> = {
    add: {
        loading: 'Agregando área...',
        success: 'Área agregado exitosamente',
        error: 'Error al agregar área'
    },
    update: {
        loading: 'Actualizando área...',
        success: 'Área actualizado exitosamente',
        error: 'Error al actualizar área'
    },
    delete: {
        loading: 'Eliminando área...',
        success: 'Área eliminado exitosamente',
        error: 'Error al eliminar área'
    },
    fetch: {
        loading: 'Cargando...',
        success: 'Cargado exitosamente',
        error: 'Error al cargar'
    }
};

const useArea = () => {
    const [areaList, setAreaList] = useState<Area[]>([]);
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
            const areaData = await apiService.getAreas();
            setAreaList(areaData.data.areas);
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
        areaData?: { name: string },
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
                    await apiService.addArea(areaData!);
                    break;
                case 'update':
                    await apiService.updateArea(id!, areaData!);
                    break;
                case 'delete':
                    await apiService.deleteArea(id!);
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
    const addArea = useCallback(
        (areaData: { name: string }) => handleAction('add', areaData),
        [handleAction]
    );

    const updateArea = useCallback(
        (id: string, areaData: { name: string }) => handleAction('update', areaData, id),
        [handleAction]
    );

    const deleteArea = useCallback(
        (id: string) => handleAction('delete', undefined, id),
        [handleAction]
    );

    return {
        areaList,

        loading: fetchState.loading,
        error: fetchState.error,
        successMessage: fetchState.successMessage,

        addArea,
        updateArea,
        deleteArea,
    };
};

export default useArea;

import { useCallback, useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Action, ActionMessages, FetchState, Percentage } from '../../types';

// Definición de tipos específicos para mejor control
const ACTION_MESSAGES: Record<Action, ActionMessages> = {
    add: {
        loading: 'Agregando porcentaje de ciclo y área...',
        success: 'Porcentaje de ciclo y área agregado exitosamente',
        error: 'Error al agregar porcentaje de ciclo y área'
    },
    update: {
        loading: 'Actualizando porcentaje de ciclo y área...',
        success: 'Porcentaje de ciclo y área actualizado exitosamente',
        error: 'Error al actualizar porcentaje de ciclo y área'
    },
    delete: {
        loading: 'Eliminando porcentaje de ciclo y área...',
        success: 'Porcentaje de ciclo y área eliminado exitosamente',
        error: 'Error al eliminar porcentaje de ciclo y área'
    },
    fetch: {
        loading: 'Cargando...',
        success: 'Cargado exitosamente',
        error: 'Error al cargar'
    }
};

const usePercentage = () => {
    const [percentageList, setPercentageList] = useState<Percentage[]>([]);
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
            const percentageData = await apiService.getPercentages();
            setPercentageList(percentageData.data.percentages);
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
        percentageData?: { percentage: number, areaId: number, cycleId: number }, 
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
                    await apiService.addPercentage(percentageData!);
                    break;
                case 'update':
                    await apiService.updatePercentage(id!, percentageData!);
                    break;
                case 'delete':
                    await apiService.deletePercentage(id!);
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
    const addPercentage = useCallback(
        (percentageData: { percentage: number, areaId: number, cycleId: number }) => handleAction('add', percentageData),
        [handleAction]
    );

    const updatePercentage = useCallback(
        (id: string, percentageData: { percentage: number, areaId: number, cycleId: number })  => handleAction('update', percentageData, id),
        [handleAction]
    );

    const deletePercentage = useCallback(
        (id: string) => handleAction('delete', undefined, id),
        [handleAction]
    );

    return {
        percentageList,

        loading: fetchState.loading,
        error: fetchState.error,
        successMessage: fetchState.successMessage,

        addPercentage,
        updatePercentage,
        deletePercentage,
    };
};

export default usePercentage;

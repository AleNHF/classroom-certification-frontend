import { useCallback, useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Action, ActionMessages, Cycle, FetchState } from '../../types';

// Definición de tipos específicos para mejor control
const ACTION_MESSAGES: Record<Action, ActionMessages> = {
    add: {
        loading: 'Agregando ciclo...',
        success: 'Ciclo agregado exitosamente',
        error: 'Error al agregar ciclo'
    },
    update: {
        loading: 'Actualizando ciclo...',
        success: 'Ciclo actualizado exitosamente',
        error: 'Error al actualizar ciclo'
    },
    delete: {
        loading: 'Eliminando ciclo...',
        success: 'Ciclo eliminado exitosamente',
        error: 'Error al eliminar ciclo'
    }
};

const useCycle = () => {
    const [cycleList, setCycleList] = useState<Cycle[]>([]);
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
            const cycleData = await apiService.getCycles();
            setCycleList(cycleData.data.cycles);
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

    const getCycle = useCallback(async (id: string) => {
        setFetchState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const response = await apiService.getCycle(id);
            return response.data; // Ajusta esto según la estructura de tu respuesta
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Error al obtener el ciclo';
            
            setFetchState(prev => ({
                ...prev,
                error: errorMessage
            }));
            console.error('Error fetching cycle:', error);
            throw error; // Opcional, si deseas manejar errores externamente
        } finally {
            setFetchState(prev => ({ ...prev, loading: false }));
        }
    }, []);    

    const handleAction = useCallback(async (
        action: Action,
        cycleData?: { name: string },
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
                    await apiService.addCycle(cycleData!);
                    break;
                case 'update':
                    await apiService.updateCycle(id!, cycleData!);
                    break;
                case 'delete':
                    await apiService.deleteCycle(id!);
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
    const addCycle = useCallback(
        (cycleData: { name: string }) => handleAction('add', cycleData),
        [handleAction]
    );

    const updateCycle = useCallback(
        (id: string, cycleData: { name: string }) => handleAction('update', cycleData, id),
        [handleAction]
    );

    const deleteCycle = useCallback(
        (id: string) => handleAction('delete', undefined, id),
        [handleAction]
    );

    return {
        cycleList,

        loading: fetchState.loading,
        error: fetchState.error,
        successMessage: fetchState.successMessage,

        addCycle,
        updateCycle,
        deleteCycle,
        getCycle
    };
};

export default useCycle;
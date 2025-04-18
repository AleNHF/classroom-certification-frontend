import { useCallback, useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Action, ActionMessages, FetchState, Personal } from '../../types';

// Definición de tipos específicos para mejor control
const ACTION_MESSAGES: Record<Action, ActionMessages> = {
    add: {
        loading: 'Agregando personal técnico...',
        success: 'Personal técnico agregado exitosamente',
        error: 'Error al agregar personal técnico'
    },
    update: {
        loading: 'Actualizando personal técnico...',
        success: 'Personal técnico actualizado exitosamente',
        error: 'Error al actualizar personal técnico'
    },
    delete: {
        loading: 'Eliminando personal técnico...',
        success: 'Personal técnico eliminado exitosamente',
        error: 'Error al eliminar personal técnico'
    }
};

const usePersonal = () => {
    const [personalList, setPersonalList] = useState<Personal[]>([]);
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
            const response = await apiService.getPersonal();
            setPersonalList(response.data.personals);
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
        personalData?: { name: string, position: string }, 
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
                    await apiService.addPersonal(personalData!);
                    break;
                case 'update':
                    await apiService.updatePersonal(id!, personalData!);
                    break;
                case 'delete':
                    await apiService.deletePersonal(id!);
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
    const addPersonal = useCallback(
        (personalData: { name: string, position: string }) => handleAction('add', personalData),
        [handleAction]
    );

    const updatePersonal = useCallback(
        (id: string, personalData: { name: string, position: string }) => handleAction('update', personalData, id),
        [handleAction]
    );

    const deletePersonal = useCallback(
        (id: string) => handleAction('delete', undefined, id),
        [handleAction]
    );

    return {
        // Data
        personalList,

        // Estado
        loading: fetchState.loading,
        error: fetchState.error,
        successMessage: fetchState.successMessage,

        // Acciones
        addPersonal,
        updatePersonal,
        deletePersonal,

        // Utilidades
        refreshData: fetchData
    };
};

export default usePersonal;
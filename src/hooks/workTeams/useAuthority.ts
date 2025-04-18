import { useCallback, useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Action, ActionMessages, Authority, FetchState, Personal } from '../../types';

// Definición de tipos específicos para mejor control
const ACTION_MESSAGES: Record<Action, ActionMessages> = {
    add: {
        loading: 'Agregando autoridad...',
        success: 'Autoridad agregado exitosamente',
        error: 'Error al agregar autoridad'
    },
    update: {
        loading: 'Actualizando autoridad...',
        success: 'Autoridad actualizado exitosamente',
        error: 'Error al actualizar autoridad'
    },
    delete: {
        loading: 'Eliminando autoridad...',
        success: 'Autoridad eliminado exitosamente',
        error: 'Error al eliminar autoridad'
    }
};

const useAuthority = () => {
    const [authorityList, setAuthoritylList] = useState<Personal[]>([]);
    const [currentAuthority, setCurrentAuthority] = useState<Authority>();
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
            const response = await apiService.getAuthorities();
            setAuthoritylList(response.data.authorities);
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

    const getAuthorityById = useCallback(async (formId: string) => {
        try {
            const response = await apiService.getAuthorityById(formId);
            setCurrentAuthority(response.data.authority);
            return response.data.authority;
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
        authorityData?: FormData, 
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
                    await apiService.addAuthority(authorityData!);
                    break;
                case 'update':
                    await apiService.updateAuthority(id!, authorityData!);
                    break;
                case 'delete':
                    await apiService.deleteAuthority(id!);
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
    const addAuthority = useCallback(
        (authorityData: FormData) => handleAction('add', authorityData),
        [handleAction]
    );

    const updateAuthority = useCallback(
        (id: string, authorityData: FormData) => handleAction('update', authorityData, id),
        [handleAction]
    );

    const deleteAuthority = useCallback(
        (id: string) => handleAction('delete', undefined, id),
        [handleAction]
    );

    return {
        // Data
        authorityList,
        currentAuthority,

        // Estado
        loading: fetchState.loading,
        error: fetchState.error,
        successMessage: fetchState.successMessage,

        // Acciones
        addAuthority,
        updateAuthority,
        deleteAuthority,
        getAuthorityById,

        // Utilidades
        refreshData: fetchData
    };
};

export default useAuthority;
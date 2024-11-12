import { useEffect, useState, useCallback } from 'react';
import apiService from '../../services/apiService';
import authService from '../../services/authService';
import { UserProps, Role, ActionMessages, FetchState, Action } from '../../types';

// Definición de tipos específicos para mejor control
const ACTION_MESSAGES: Record<Action, ActionMessages> = {
    add: {
        loading: 'Agregando usuario...',
        success: 'Usuario agregado exitosamente',
        error: 'Error al agregar usuario'
    },
    update: {
        loading: 'Actualizando usuario...',
        success: 'Usuario actualizado exitosamente',
        error: 'Error al actualizar usuario'
    },
    delete: {
        loading: 'Eliminando usuario...',
        success: 'Usuario eliminado exitosamente',
        error: 'Error al eliminar usuario'
    },
    fetch: {
        loading: 'Cargando...',
        success: 'Cargado exitosamente',
        error: 'Error al cargar'
    }
};

const useUsers = () => {
    // Estados separados para cada tipo de datos
    const [userList, setUserList] = useState<UserProps[]>([]);
    const [usersMoodleList, setUsersMoodleList] = useState<UserProps[]>([]);
    const [roleList, setRoleList] = useState<Role[]>([]);
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

    // Función de fetch mejorada con manejo de errores específicos
    const fetchData = useCallback(async () => {
        setFetchState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const [usersResponse, moodleResponse, rolesResponse] = await Promise.all([
                apiService.getUsers(),
                apiService.getUsersInMoodle(),
                authService.getRoles(),
            ]);

            setUserList(usersResponse.data.users);
            setUsersMoodleList(moodleResponse.data.users);
            setRoleList(rolesResponse.data.roles);
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
            setFetchState(prev => ({ ...prev, loading: false }));
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

    // Manejador de acciones mejorado con mensajes específicos
    const handleAction = useCallback(async (
        action: Action,
        userData?: UserProps,
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
                    await apiService.addUser(userData!);
                    break;
                case 'update':
                    await apiService.updateUser(id!, userData!);
                    break;
                case 'delete':
                    await apiService.deleteUser(id!);
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
            setFetchState(prev => ({ ...prev, loading: false }));
        }
    }, [fetchData, clearMessages]);

    // Optimización de funciones retornadas con useCallback
    const addUser = useCallback(
        (userData: UserProps) => handleAction('add', userData),
        [handleAction]
    );

    const updateUser = useCallback(
        (id: string, userData: UserProps) => handleAction('update', userData, id),
        [handleAction]
    );

    const deleteUser = useCallback(
        (id: string) => handleAction('delete', undefined, id),
        [handleAction]
    );

    return {
        // Data
        userList,
        usersMoodleList,
        roleList,

        // Estado
        loading: fetchState.loading,
        error: fetchState.error,
        successMessage: fetchState.successMessage,

        // Acciones
        addUser,
        updateUser,
        deleteUser,

        // Utilidades
        refreshData: fetchData
    };
};

export default useUsers;
import { useCallback, useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Action, ActionMessages, FetchState, Team } from '../../types';

// Definición de tipos específicos para mejor control
const ACTION_MESSAGES: Record<Action, ActionMessages> = {
    add: {
        loading: 'Agregando equipo...',
        success: 'Equipo agregado exitosamente',
        error: 'Error al agregar equipo'
    },
    update: {
        loading: 'Actualizando equipo...',
        success: 'Equipo actualizado exitosamente',
        error: 'Error al actualizar equipo'
    },
    delete: {
        loading: 'Eliminando equipo...',
        success: 'Equipo eliminado exitosamente',
        error: 'Error al eliminar equipo'
    }
};

const useTeam = () => {
    const [teamList, setTeamList] = useState<Team[]>([]);
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
            const teamData = await apiService.getTeams();
            setTeamList(teamData.data.teams);
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
        teamData?: Team, 
        id?: string
    ) => {
        const messages = ACTION_MESSAGES[action];

        setFetchState(prev => ({
            ...prev,
            loading: true,
            error: null,
            successMessage: null
        }));try {
            switch (action) {
                case 'add':
                    await apiService.addTeam(teamData!);
                    break;
                case 'update':
                    await apiService.updateTeam(id!, teamData!);
                    break;
                case 'delete':
                    await apiService.deleteTeam(id!);
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
    const addTeam = useCallback(
        (teamData: Team) => handleAction('add', teamData),
        [handleAction]
    );

    const updateTeam = useCallback(
        (id: string, teamData: Team) => handleAction('update', teamData, id),
        [handleAction]
    );

    const deleteTeam = useCallback(
        (id: string) => handleAction('delete', undefined, id),
        [handleAction]
    );

    return {
        // Data
        teamList,

        // Estado
        loading: fetchState.loading,
        error: fetchState.error,
        successMessage: fetchState.successMessage,
        
        // Acciones
        addTeam,
        updateTeam,
        deleteTeam,
    };
};

export default useTeam;

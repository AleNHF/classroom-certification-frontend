import { useCallback, useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Action, ActionMessages, Classroom, FetchState } from '../../types';

// Definición de tipos específicos para mejor control
const ACTION_MESSAGES: Record<Action, ActionMessages> = {
    add: {
        loading: 'Agregando aula virtual...',
        success: 'Aula virtual agregado exitosamente',
        error: 'Error al agregar aula virtual'
    },
    update: {
        loading: 'Actualizando aula virtual...',
        success: 'Aula virtual actualizado exitosamente',
        error: 'Error al actualizar aula virtual'
    },
    delete: {
        loading: 'Eliminando aula virtual...',
        success: 'Aula virtual eliminado exitosamente',
        error: 'Error al eliminar aula virtual'
    }
};

const useClassroom = () => {
    const [classroomList, setClassroomList] = useState<Classroom[]>([]);
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
            const response = await apiService.getClassrooms();
            console.log('classrooms', response)
            setClassroomList(response.data.classrooms);
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
        classroomData?: { name: string, code: string, status: string },
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
                await apiService.addClassroom(classroomData!);
            } else if (action === 'update') {
                await apiService.updateClassroom(id!, classroomData!);
            } else if (action === 'delete') {
                await apiService.deleteClassroom(id!);
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
    const addClassroom = useCallback(
        (classroomData: { name: string, code: string, status: string }) => handleAction('add', classroomData),
        [handleAction]
    );

    const updateClassroom = useCallback(
        (id: string, classroomData: { name: string, code: string, status: string }) => handleAction('update', classroomData, id),
        [handleAction]
    );

    const deleteClassroom = useCallback(
        (id: string) => handleAction('delete', undefined, id),
        [handleAction]
    );

    return {
        classroomList,

        loading: fetchState.loading,
        error: fetchState.error,
        successMessage: fetchState.successMessage,

        addClassroom,
        updateClassroom,
        deleteClassroom
    };
};

export default useClassroom;

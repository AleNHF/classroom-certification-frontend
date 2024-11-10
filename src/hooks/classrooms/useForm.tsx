import { useCallback, useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Action, ActionMessages, FetchState, Form, FormDataProps } from '../../types';

// Definición de tipos específicos para mejor control
const ACTION_MESSAGES: Record<Action, ActionMessages> = {
    add: {
        loading: 'Agregando formulario...',
        success: 'Formulario agregado exitosamente',
        error: 'Error al agregar formulario'
    },
    update: {
        loading: 'Actualizando formulario...',
        success: 'Formulario actualizado exitosamente',
        error: 'Error al actualizar formulario'
    },
    delete: {
        loading: 'Eliminando formulario...',
        success: 'Formulario eliminado exitosamente',
        error: 'Error al eliminar formulario'
    },
    fetch: {
        loading: 'Cargando formulario...',
        success: 'Formulario cargado exitosamente',
        error: 'Error al cargar formulario'
    }
};

const useForm = (classroomId: string) => {
    const [formList, setFormList] = useState<Form[]>([]);
    const [currentForm, setCurrentForm] = useState<Form | null>(null);
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
            const response = await apiService.getFormsByClassroom(classroomId);
            setFormList(response.data.forms);
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
    }, [classroomId]);

    const getFormById = useCallback(async (formId: string) => {
        const messages = ACTION_MESSAGES.fetch;
        setFetchState(prev => ({
            ...prev,
            loading: true,
            error: null,
            successMessage: null
        }));

        try {
            const response = await apiService.getFormById(formId);
            setCurrentForm(response.data.form);
            setFetchState(prev => ({
                ...prev,
                successMessage: messages.success
            }));
            clearMessages();
            return response.data.form;
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
        formData?: FormDataProps,
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
                await apiService.addForm(formData!);
            } else if (action === 'update') {
                await apiService.updateForm(id!, formData!);
            } else if (action === 'delete') {
                await apiService.deleteForm(id!);
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
    const addForm = useCallback(
        (formData: FormDataProps) => handleAction('add', formData),
        [handleAction]
    );

    const updateForm = useCallback(
        (id: string, formData: FormDataProps) => handleAction('update', formData, id),
        [handleAction]
    );

    const deleteForm = useCallback(
        (id: string) => handleAction('delete', undefined, id),
        [handleAction]
    );

    return {
        formList,
        currentForm,

        loading: fetchState.loading,
        error: fetchState.error,
        successMessage: fetchState.successMessage,

        getFormById,
        addForm,
        updateForm,
        deleteForm
    };
};

export default useForm;

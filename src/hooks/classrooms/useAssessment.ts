import { useCallback, useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Action, ActionMessages, Assessment, AssessmentData, FetchState } from '../../types';

// Definición de tipos específicos para mejor control
const ACTION_MESSAGES: Record<Action, ActionMessages> = {
    add: {
        loading: 'Agregando valoración...',
        success: 'Valoración agregada exitosamente',
        error: 'Error al agregar valoración'
    },
    update: {
        loading: 'Actualizando valoración                                                                                                                                                                                  ...',
        success: 'Valoración actualizada exitosamente',
        error: 'Error al actualizar valoración'
    },
    delete: {
        loading: 'Eliminando valoración...',
        success: 'Valoración eliminada exitosamente',
        error: 'Error al eliminar valoración'
    },
    fetch: {
        loading: 'Cargando valoración...',
        success: 'Valoración cargado exitosamente',
        error: 'Error al cargar valoración'
    }
};

const useAssessment = (formId: string) => {
    const [assessmentList, setAssessmentList] = useState<Assessment[]>([]);
    const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
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
            const response = await apiService.getAssessmentByForm(formId);
            console.log('response', response)
            setAssessmentList(response.data.assessments);
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
    }, [formId]);

    const getAssessmentById = useCallback(async (assessmentId: string) => {
        const messages = ACTION_MESSAGES.fetch;
        setFetchState(prev => ({
            ...prev,
            loading: true,
            error: null,
            successMessage: null
        }));

        try {
            const response = await apiService.getAssessmentById(assessmentId);
            setCurrentAssessment(response.data.assessment);
            setFetchState(prev => ({
                ...prev,
                successMessage: messages.success
            }));
            clearMessages();
            return response.data.assessment;
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
        assessmentData?: AssessmentData,
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
                await apiService.addAssessment(assessmentData!);
            } else if (action === 'update') {
                await apiService.updateAssessment(id!, assessmentData!);
            } else if (action === 'delete') {
                await apiService.deleteAssessment(id!);
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
    const addAssessment = useCallback(
        (assessmentData: AssessmentData) => handleAction('add', assessmentData),
        [handleAction]
    );

    const updateAssessment = useCallback(
        (id: string, assessmentData: AssessmentData) => handleAction('update', assessmentData, id),
        [handleAction]
    );

    const deleteAssessment = useCallback(
        (id: string) => handleAction('delete', undefined, id),
        [handleAction]
    );

    return {
        assessmentList,
        currentAssessment,

        loading: fetchState.loading,
        error: fetchState.error,
        successMessage: fetchState.successMessage,

        getAssessmentById,
        addAssessment,
        updateAssessment,
        deleteAssessment
    };
};

export default useAssessment;

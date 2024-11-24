import { useCallback, useState } from 'react';
import apiService from '../../services/apiService';
import { Action, ActionMessages, FetchState } from '../../types';

// Definición de tipos específicos para mejor control
const ACTION_MESSAGES: Record<Action, ActionMessages> = {
    add: {
        loading: 'Agregando evaluación...',
        success: 'Evaluación agregada exitosamente',
        error: 'Error al agregar evaluación'
    },
    update: {
        loading: 'Actualizando evaluación...',
        success: 'Evaluación actualizado exitosamente',
        error: 'Error al actualizar evaluación'
    },
    delete: {
        loading: 'Eliminando evaluación...',
        success: 'Evaluación eliminado exitosamente',
        error: 'Error al eliminar evaluación'
    }
};

const useEvaluation = () => {
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

    const analizeCompliance = useCallback(async (
        classroomId: number,
        token: string,
        cycleId: number,
        areaId: number,
        evaluationId: number
    ) => {
        setFetchState(prev => ({
            ...prev,
            loading: true,
            error: null,
            successMessage: null
        }));

        try {
            const result = await apiService.analizeIndicatorsCompliance(
                classroomId,
                token,
                cycleId,
                areaId,
                evaluationId
            );
            console.log('result',result)

            setFetchState(prev => ({
                ...prev,
                successMessage: 'Análisis de cumplimiento completado exitosamente'
            }));

            clearMessages();
            return result;
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Error al analizar el cumplimiento de indicadores';

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

    const handleAction = useCallback(async (
        action: Action,
        evaluationData?: { classroomId: number, cycleId: number, areaId: number, result: number },
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
                    return await apiService.addEvaluation(evaluationData!);
                case 'update':
                    await apiService.updateEvaluation(id!, evaluationData!);
                    break;
            }

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
    }, [clearMessages]);

    // Optimización de funciones retornadas con useCallback
    const addEvaluation = useCallback(
        (evaluationData: { classroomId: number, cycleId: number, areaId: number, result: number }) => handleAction('add', evaluationData),
        [handleAction]
    );

    const updateEvaluation = useCallback(
        (id: string, evaluationData: { classroomId: number, cycleId: number, areaId: number, result: number }) => handleAction('update', evaluationData, id),
        [handleAction]
    );

    return {
        loading: fetchState.loading,
        error: fetchState.error,
        successMessage: fetchState.successMessage,

        analizeCompliance,
        addEvaluation,
        updateEvaluation,
    };
};

export default useEvaluation;
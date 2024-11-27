import { useCallback, useState } from 'react';
import apiService from '../../services/apiService';
import { Action, ActionMessages, Evaluation, FetchState, WeightedAverageAreaCycle } from '../../types';

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
    },
    fetch: {
        loading: '',
        success: '',
        error: ''
    }
};

const useEvaluation = () => {
    const [evaluationList, setEvaluationList] = useState<Evaluation[]>([]);
    const [weightedAverageList, setWeightedAverageList] = useState<WeightedAverageAreaCycle[]>([]);
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

    const fetchData = useCallback(async (classroomId: number) => {
        setFetchState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const response = await apiService.getEvaluationsByClassroom(classroomId);
            setEvaluationList(response.data.evaluations);
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

    const fetchWeightedAverage = useCallback(async (classroomId: number) => {
        setFetchState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const response = await apiService.getWeightedAverageAreaByCycle(classroomId);
            setWeightedAverageList(response.data);
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

    const fetchEvaluationById = useCallback(async (id: string) => {
        setFetchState(prev => ({
            ...prev,
            loading: true,
            error: null,
            successMessage: null
        }));
    
        try {
            const response = await apiService.getEvaluationById(id);
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Error al obtener la evaluación';
    
            setFetchState(prev => ({
                ...prev,
                error: errorMessage
            }));
            console.error('Error fetching evaluation by ID:', error);
            throw error;
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
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
                case 'delete':
                    await apiService.deleteEvaluation(id!);
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

    const deleteEvaluation = useCallback(
        (id: string) => handleAction('delete', undefined, id),
        [handleAction]
    );

    // Función para actualizar un indicador evaluado
    const updateEvaluatedIndicator = useCallback(async (id: string, updatedData: { result: number, observation: string }) => {
        try {
            await apiService.updateEvaluatedIndicator(id, updatedData);
        } catch (error) {
            const errorMessage = error instanceof Error
                    ? error.message
                    : 'Error al actualizar el indicador evaluado';
            console.error(errorMessage);
            throw error;
        } 
    }, []);

    return {
        evaluationList,
        weightedAverageList,

        loading: fetchState.loading,
        error: fetchState.error,
        successMessage: fetchState.successMessage,

        addEvaluation,
        updateEvaluation,
        deleteEvaluation,
        fetchData,
        fetchEvaluationById,

        analizeCompliance,
        updateEvaluatedIndicator,
        fetchWeightedAverage
    };
};

export default useEvaluation;
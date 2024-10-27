import { useCallback, useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Action, ActionMessages, FetchState } from '../../types';
import { Content, Cycle, Indicator, Resource } from '../../types/indicator';

// Definición de tipos específicos para mejor control
const ACTION_MESSAGES: Record<Action, ActionMessages> = {
    add: {
        loading: 'Agregando indicador...',
        success: 'Indicador agregado exitosamente',
        error: 'Error al agregar indicador'
    },
    update: {
        loading: 'Actualizando indicador...',
        success: 'Indicador actualizado exitosamente',
        error: 'Error al actualizar indicador'
    },
    delete: {
        loading: 'Eliminando indicador...',
        success: 'Indicador eliminado exitosamente',
        error: 'Error al eliminar indicador'
    }
};

const useIndicator = (areaId: string) => {
    const [indicatorList, setIndicatorList] = useState<Indicator[]>([]);
    const [resourceList, setResourceList] = useState<Resource[]>([]);
    const [contentList, setContentList] = useState<Content[]>([]);
    const [cycles, setCycles] = useState<Cycle[]>([]);
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
            const indicatorData = await apiService.getIndicators(areaId);
            setIndicatorList(indicatorData.data.indicators);
            organizeIndicators(indicatorData.data.indicators)
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
        indicatorData?: { name: string, areaId: number, resourceId: number, contentId?: number }, 
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
                    await apiService.addIndicator(indicatorData!);
                    break;
                case 'update':
                    await apiService.updateIndicator(id!, indicatorData!);
                    break;
                case 'delete':
                    await apiService.deleteIndicator(id!);
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

    const fetchResourceList = useCallback(async (cycleId: string) => {
        setFetchState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const resourceData = await apiService.getResources(cycleId);
            setResourceList(resourceData.data.resources);
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Error al cargar los datos de recursos';

            setFetchState(prev => ({
                ...prev,
                error: errorMessage
            }));
            console.error('Error fetching resources data:', error);
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
    }, []);

    const fetchContentList = useCallback(async (resourceId: string) => {
        setFetchState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const contentData = await apiService.getContents(resourceId);
            setContentList(contentData.data.contents);
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Error al cargar los datos de contenidos';

            setFetchState(prev => ({
                ...prev,
                error: errorMessage
            }));
            console.error('Error fetching contents data:', error);
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
    }, []);

    const organizeIndicators = (indicators: Indicator[]) => {
        const cyclesMap: { [key: number]: Cycle } = {};

        indicators.forEach(indicator => {
            const resource = indicator.resource;

            // Verifica si el recurso tiene un ciclo asociado
            if (resource.cycle) {
                const cycleId = resource.cycle.id;
                const cycleName = resource.cycle.name;
                const resourceId = resource.id;
                const resourceName = resource.name;

                // Si el ciclo no existe en el mapa, lo crea
                if (!cyclesMap[cycleId]) {
                    cyclesMap[cycleId] = {
                        id: cycleId,
                        name: cycleName,
                        resources: []
                    };
                }

                // Busca el recurso en el ciclo
                let cycleResource = cyclesMap[cycleId].resources.find(r => r.id === resourceId);

                // Si el recurso no existe, lo crea
                if (!cycleResource) {
                    cycleResource = {
                        id: resourceId,
                        name: resourceName,
                        contents: []
                    };
                    cyclesMap[cycleId].resources.push(cycleResource);
                }

                // Si hay contenido, lo agrega al recurso
                if (indicator.content) {
                    cycleResource.contents.push({
                        id: indicator.content.id,
                        name: indicator.content.name,
                    });
                }
            }
        });

        // Convierte el mapa a un array y lo establece en el estado
        setCycles(Object.values(cyclesMap));
    }

    // Optimización de funciones retornadas con useCallback
    const addIndicator = useCallback(
        (indicatorData: { name: string, areaId: number, resourceId: number, contentId?: number }) => handleAction('add', indicatorData),
        [handleAction]
    );

    const updateIndicator = useCallback(
        (id: string, indicatorData: { name: string, areaId: number, resourceId: number, contentId?: number }) => handleAction('update', indicatorData, id),
        [handleAction]
    );

    const deleteIndicator = useCallback(
        (id: string) => handleAction('delete', undefined, id),
        [handleAction]
    );

    return {
        indicatorList,
        resourceList,
        contentList,
        cycles,

        loading: fetchState.loading,
        error: fetchState.error,
        successMessage: fetchState.successMessage,

        addIndicator,
        updateIndicator,
        deleteIndicator,

        // Utilidades
        fetchResourceList,
        fetchContentList
    };
};

export default useIndicator;

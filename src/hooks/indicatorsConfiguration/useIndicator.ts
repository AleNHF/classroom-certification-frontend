import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { FetchState } from '../../types';
import { Content, Cycle, Indicator, Resource } from '../../types/indicator';

const useIndicator = (areaId: string) => {
    const [indicatorList, setIndicatorList] = useState<Indicator[]>([]);
    const [resourceList, setResourceList] = useState<Resource[]>([]);
    const [contentList, setContentList] = useState<Content[]>([]);
    const [cycles, setCycles] = useState<Cycle[]>([]);

    const [fetchState, setFetchState] = useState<FetchState>({ loading: true, error: null });

    const fetchData = async () => {
        setFetchState({ loading: true, error: null });
        try {
            const indicatorData = await apiService.getIndicators(areaId);
            setIndicatorList(indicatorData.data.indicators);
            organizeIndicators(indicatorData.data.indicators)
        } catch (error) {
            handleFetchError(error);
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
    };

    const handleFetchError = (error: unknown) => {
        console.error('Error fetching data:', error);
        setFetchState({
            loading: false,
            error: 'Error al obtener los datos. Inténtalo de nuevo más tarde.',
        });
    };

    const handleIndicatorAction = async (action: 'add' | 'update' | 'delete', indicatorData?: { name: string, areaId: number, resourceId: number, contentId?: number }, id?: string) => {
        setFetchState(prevState => ({ ...prevState, loading: true, error: null }));
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
        } catch (error) {
            handleActionError(action, error);
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
    };

    const handleActionError = (action: 'add' | 'update' | 'delete', error: unknown) => {
        console.error(`Error ${action} cycle:`, error);
        setFetchState({
            loading: false,
            error: `Error al ${action} el ciclo.`,
        });
    };

    const fetchResourceList = async (cycleId: string) => {
        setFetchState({ loading: true, error: null });
        try {
            const resourceData = await apiService.getResources(cycleId);
            setResourceList(resourceData.data.resources);
        } catch (error) {
            handleFetchError(error);
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
    };

    const fetchContentList = async (resourceId: string) => {
        setFetchState({ loading: true, error: null });
        try {
            const contentData = await apiService.getContents(resourceId);
            setContentList(contentData.data.contents);
        } catch (error) {
            handleFetchError(error);
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
    };

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

    useEffect(() => {
        fetchData();
    }, []);

    return {
        indicatorList,
        resourceList,
        contentList,
        cycles,
        loading: fetchState.loading,
        error: fetchState.error,
        addIndicator: (indicatorData: { name: string, areaId: number, resourceId: number, contentId?: number }) => handleIndicatorAction('add', indicatorData),
        updateIndicator: (id: string, indicatorData: { name: string, areaId: number, resourceId: number, contentId?: number }) => handleIndicatorAction('update', indicatorData, id),
        deleteIndicator: (id: string) => handleIndicatorAction('delete', undefined, id),
        fetchResourceList,
        fetchContentList
    };
};

export default useIndicator;

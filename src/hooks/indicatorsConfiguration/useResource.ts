import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Resource, FetchState } from '../../types';

const useResource = (cycleId: string) => {
    const [resourceList, setResourceList] = useState<Resource[]>([]);
    const [fetchState, setFetchState] = useState<FetchState>({ loading: true, error: null });

    // Fetch resources based on cycleId
    const fetchData = async () => {
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

    // Centralized error handling for fetching
    const handleFetchError = (error: unknown) => {
        console.error('Error fetching resources:', error);
        setFetchState({
            loading: false,
            error: 'Error al obtener los datos. Inténtalo de nuevo más tarde.',
        });
    };

    // Generic handler for adding, updating, and deleting resources
    const handleResourceAction = async (
        action: 'add' | 'update' | 'delete',
        resourceData?: { name: string; cycleId: number },
        id?: string
    ) => {
        setFetchState(prevState => ({ ...prevState, loading: true, error: null }));
        try {
            switch (action) {
                case 'add':
                    await apiService.addResource(resourceData!);
                    break;
                case 'update':
                    await apiService.updateResource(id!, resourceData!);
                    break;
                case 'delete':
                    await apiService.deleteResource(id!);
                    break;
            }
            await fetchData();
        } catch (error) {
            handleActionError(action, error);
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
    };

    // Centralized error handling for resource actions
    const handleActionError = (action: 'add' | 'update' | 'delete', error: unknown) => {
        console.error(`Error ${action} resource:`, error);
        setFetchState({
            loading: false,
            error: `Error al ${action} el recurso.`,
        });
    };

    // Fetch resources on cycleId change
    useEffect(() => {
        if (cycleId) fetchData();
    }, [cycleId]);

    return {
        resourceList,
        loading: fetchState.loading,
        error: fetchState.error,
        addResource: (resourceData: { name: string; cycleId: number }) => handleResourceAction('add', resourceData),
        updateResource: (id: string, resourceData: { name: string; cycleId: number }) => handleResourceAction('update', resourceData, id),
        deleteResource: (id: string) => handleResourceAction('delete', undefined, id),
    };
};

export default useResource;

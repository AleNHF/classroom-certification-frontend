import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Content, FetchState } from '../../types';

const useContent = (resourceId: string) => {
    const [contentList, setContentList] = useState<Content[]>([]);
    const [fetchState, setFetchState] = useState<FetchState>({ loading: true, error: null });

    // Fetch content based on resourceId
    const fetchData = async () => {
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

    // Centralized error handling for fetching
    const handleFetchError = (error: unknown) => {
        console.error('Error fetching resources:', error);
        setFetchState({
            loading: false,
            error: 'Error al obtener los datos. Inténtalo de nuevo más tarde.',
        });
    };

    // Generic handler for adding, updating, and deleting contents
    const handleContentAction = async (
        action: 'add' | 'update' | 'delete',
        contentData?: { name: string; resourceId: number },
        id?: string
    ) => {
        setFetchState(prevState => ({ ...prevState, loading: true, error: null }));
        try {
            switch (action) {
                case 'add':
                    await apiService.addContent(contentData!);
                    break;
                case 'update':
                    await apiService.updateContent(id!, contentData!);
                    break;
                case 'delete':
                    await apiService.deleteContent(id!);
                    break;
            }
            await fetchData();
        } catch (error) {
            handleActionError(action, error);
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
    };

    // Centralized error handling for contents actions
    const handleActionError = (action: 'add' | 'update' | 'delete', error: unknown) => {
        console.error(`Error ${action} resource:`, error);
        setFetchState({
            loading: false,
            error: `Error al ${action} el recurso.`,
        });
    };

    // Fetch contents on resourceId change
    useEffect(() => {
        if (resourceId) fetchData();
    }, [resourceId]);


    return {
        contentList,
        loading: fetchState.loading,
        error: fetchState.error,
        addContent: (contentData: { name: string; resourceId: number }) => handleContentAction('add', contentData),
        updateContent: (id: string, contentData: { name: string; resourceId: number }) => handleContentAction('update', contentData, id),
        deleteContent: (id: string) => handleContentAction('delete', undefined, id),
    };
};

export default useContent;
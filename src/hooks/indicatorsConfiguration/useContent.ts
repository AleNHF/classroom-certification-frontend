import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';

const useContent = (resourceId: string) => {
    const [contentList, setContentList] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData(resourceId);
    }, [resourceId]);

    const fetchData = async (resourceId: string) => {
        setLoading(true);
        try {
            const contentData = await apiService.getContents(resourceId);
            console.log('contentdata', contentData)
            setContentList(contentData.data.contents);
        } catch (error) {
            setError('Error al obtener los datos. Inténtalo de nuevo más tarde.');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addContent = async (contenData: { name: string, resourceId: number }) => {
        try {
            await apiService.addContent(contenData);
            console.log('contenData', contenData)
            fetchData(String(contenData.resourceId));
        } catch (error) {
            console.error('Error adding content:', error);
            throw error;
        }
    };

    const updateContent = async (id: string, contentData: { name: string, resourceId: number }) => {
        try {
            await apiService.updateContent(id, contentData);
            fetchData(String(contentData.resourceId)); 
        } catch (error) {
            console.error('Error updating content:', error);
            throw error;
        }
    };

    const deleteContent = async (id: string) => {
        try {
            await apiService.deleteContent(id);
            fetchData(resourceId);
        } catch (error) {
            console.error('Error deleting content:', error);
            throw error;
        }
    };

    return {
        contentList,
        loading,
        error,
        addContent,
        updateContent,
        deleteContent,
    };
};

export default useContent;
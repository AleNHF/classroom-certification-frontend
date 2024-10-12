import { useEffect, useState } from 'react';
import apiService from '../services/apiService';

const useResource = (cycleId: string) => {
    const [resourceList, setResourceList] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData(cycleId);
    }, [cycleId]); // Asegúrate de que se ejecute cada vez que cambie el cycleId

    const fetchData = async (cycleId: string) => {
        setLoading(true);
        try {
            const resourceData = await apiService.getResources(cycleId);
            console.log('resourceData', resourceData)
            setResourceList(resourceData.data.resources);
        } catch (error) {
            setError('Error al obtener los datos. Inténtalo de nuevo más tarde.');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addResource = async (resourceData: { name: string, cycleId: number }) => {
        try {
            await apiService.addResource(resourceData);
            fetchData(String(resourceData.cycleId)); // Asegúrate de enviar el cycleId correcto
        } catch (error) {
            console.error('Error adding resource:', error);
            throw error;
        }
    };

    const updateResource = async (id: string, resourceData: { name: string, cycleId: number }) => {
        try {
            await apiService.updateResource(id, resourceData);
            fetchData(String(resourceData.cycleId)); // Asegúrate de enviar el cycleId correcto
        } catch (error) {
            console.error('Error updating resource:', error);
            throw error;
        }
    };

    const deleteResource = async (id: string) => {
        try {
            await apiService.deleteResource(id);
            fetchData(cycleId); // Usa el cycleId actual
        } catch (error) {
            console.error('Error deleting resource:', error);
            throw error;
        }
    };

    return {
        resourceList,
        loading,
        error,
        addResource,
        updateResource,
        deleteResource,
    };
};

export default useResource;
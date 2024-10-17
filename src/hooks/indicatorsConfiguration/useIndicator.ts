import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';

interface Indicator {
    name: string;
    resource: string;
    content: string;
}

const useIndicator = () => {
    const [indicatorList, setIndicatorList] = useState<Indicator[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const indicatorData = await apiService.getCycles();
            setIndicatorList(indicatorData.data.indicator);
        } catch (error) {
            setError('Error al obtener los datos. Inténtalo de nuevo más tarde.');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addIndicator = async (indicatorData: { name: string, areaId: number, resourceId: number, contentId?: number }) => {
        try {
            await apiService.addIndicator(indicatorData);
            fetchData();
        } catch (error) {
            console.error('Error adding indicator:', error);
            throw error;
        }
    };

    const updateIndicator = async (id: string, indicatorData: { name: string, areaId: number, resourceId: number, contentId?: number }) => {
        try {
            await apiService.updateIndicator(id, indicatorData);
            fetchData();
        } catch (error) {
            console.error('Error updating indicator:', error);
            throw error;
        }
    };

    const deleteIndicator = async (id: string) => {
        try {
            await apiService.deleteIndicator(id);
            fetchData();
        } catch (error) {
            console.error('Error deleting indicator:', error);
            throw error;
        }
    };

    return {
        indicatorList,
        loading,
        error,
        addIndicator,
        updateIndicator,
        deleteIndicator,
    };
};

export default useIndicator;

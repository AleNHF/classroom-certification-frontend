import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';

const usePercentage = () => {
    const [percentageList, setPercentageList] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const percentageData = await apiService.getPercentages();
            setPercentageList(percentageData.data.percentages);
        } catch (error) {
            setError('Error al obtener los datos. Inténtalo de nuevo más tarde.');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addPercentage = async (percentageData: { percentage: number, areaId: number, cycleId: number }) => {
        try {
            await apiService.addPercentage(percentageData);
            fetchData();
        } catch (error) {
            console.error('Error adding percentage:', error);
            throw error;
        }
    };

    const updatePercentage = async (id: string, percentageData: { percentage: number, areaId: number, cycleId: number }) => {
        try {
            await apiService.updatePercentage(id, percentageData);
            fetchData();
        } catch (error) {
            console.error('Error updating percentage:', error);
            throw error;
        }
    };

    const deletePercentage = async (id: string) => {
        try {
            await apiService.deletePercentage(id);
            fetchData();
        } catch (error) {
            console.error('Error deleting percentage:', error);
            throw error;
        }
    };

    return {
        percentageList,
        loading,
        error,
        addPercentage,
        updatePercentage,
        deletePercentage,
    };
};

export default usePercentage;

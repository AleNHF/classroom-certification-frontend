import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';

interface Cycle {
    id: number;
    name: string;
}

const useCycle = () => {
    const [cycleList, setCycleList] = useState<Cycle[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const cycleData = await apiService.getCycles();
            setCycleList(cycleData.data.cycles);
        } catch (error) {
            setError('Error al obtener los datos. Inténtalo de nuevo más tarde.');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addCycle = async (cycleData: { name: string }) => {
        try {
            await apiService.addCycle(cycleData);
            fetchData();
        } catch (error) {
            console.error('Error adding cycle:', error);
            throw error;
        }
    };

    const updateCycle = async (id: string, cycleData: { name: string }) => {
        try {
            await apiService.updateCycle(id, cycleData);
            fetchData();
        } catch (error) {
            console.error('Error updating cycle:', error);
            throw error;
        }
    };

    const deleteCycle = async (id: string) => {
        try {
            await apiService.deleteCycle(id);
            fetchData();
        } catch (error) {
            console.error('Error deleting cycle:', error);
            throw error;
        }
    };

    return {
        cycleList,
        loading,
        error,
        addCycle,
        updateCycle,
        deleteCycle,
    };
};

export default useCycle;

import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';

const useArea = () => {
    const [areaList, setAreaList] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const areaData = await apiService.getAreas();
            setAreaList(areaData.data.areas);
        } catch (error) {
            setError('Error al obtener los datos. Inténtalo de nuevo más tarde.');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addArea = async (areaData: { name: string }) => {
        try {
            await apiService.addArea(areaData);
            fetchData();
        } catch (error) {
            console.error('Error adding area:', error);
            throw error;
        }
    };

    const updateArea = async (id: string, areaData: { name: string }) => {
        try {
            await apiService.updateArea(id, areaData);
            fetchData();
        } catch (error) {
            console.error('Error updating area:', error);
            throw error;
        }
    };

    const deleteArea = async (id: string) => {
        try {
            await apiService.deleteArea(id);
            fetchData();
        } catch (error) {
            console.error('Error deleting area:', error);
            throw error;
        }
    };

    return {
        areaList,
        loading,
        error,
        addArea,
        updateArea,
        deleteArea,
    };
};

export default useArea;

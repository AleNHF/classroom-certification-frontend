import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Area, FetchState } from '../../types';

const useArea = () => {
    const [areaList, setAreaList] = useState<Area[]>([]);
    const [fetchState, setFetchState] = useState<FetchState>({ loading: true, error: null });

    const fetchData = async () => {
        setFetchState({ loading: true, error: null });
        try {
            const areaData = await apiService.getAreas();
            setAreaList(areaData.data.areas);
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

    const handleAreaAction = async (action: 'add' | 'update' | 'delete', areaData?: { name: string }, id?: string) => {
        setFetchState(prevState => ({ ...prevState, loading: true, error: null }));
        try {
            switch (action) {
                case 'add':
                    await apiService.addArea(areaData!);
                    break;
                case 'update':
                    await apiService.updateArea(id!, areaData!);
                    break;
                case 'delete':
                    await apiService.deleteArea(id!);
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

    useEffect(() => {
        fetchData();
    }, []);

    return {
        areaList,
        loading: fetchState.loading,
        error: fetchState.error,
        addArea: (areaData: { name: string }) => handleAreaAction('add', areaData),
        updateArea: (id: string, areaData: { name: string }) => handleAreaAction('update', areaData, id),
        deleteArea: (id: string) => handleAreaAction('delete', undefined, id),
    };
};

export default useArea;

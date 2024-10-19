import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { FetchState, Percentage } from '../../types';

const usePercentage = () => {
    const [percentageList, setPercentageList] = useState<Percentage[]>([]);
    const [fetchState, setFetchState] = useState<FetchState>({ loading: true, error: null });

    const fetchData = async () => {
        setFetchState({ loading: true, error: null });
        try {
            const percentageData = await apiService.getPercentages();
            setPercentageList(percentageData.data.percentages);
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

    const handlePercentageAction = async (action: 'add' | 'update' | 'delete', percentageData?: { percentage: number, areaId: number, cycleId: number }, id?: string) => {
        setFetchState(prevState => ({ ...prevState, loading: true, error: null }));
        try {
            switch (action) {
                case 'add':
                    await apiService.addPercentage(percentageData!);
                    break;
                case 'update':
                    await apiService.updatePercentage(id!, percentageData!);
                    break;
                case 'delete':
                    await apiService.deletePercentage(id!);
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
        percentageList,
        loading: fetchState.loading,
        error: fetchState.error,
        addPercentage: (percentageData: { percentage: number, areaId: number, cycleId: number }) => handlePercentageAction('add', percentageData),
        updatePercentage: (id: string, percentageData: { percentage: number, areaId: number, cycleId: number }) => handlePercentageAction('update', percentageData, id),
        deletePercentage: (id: string) => handlePercentageAction('delete', undefined, id),
    };
};

export default usePercentage;

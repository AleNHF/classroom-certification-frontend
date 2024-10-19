import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Cycle, FetchState } from '../../types';

const useCycle = () => {
    const [cycleList, setCycleList] = useState<Cycle[]>([]);
    const [fetchState, setFetchState] = useState<FetchState>({ loading: true, error: null });

    const fetchData = async () => {
        setFetchState({ loading: true, error: null });
        try {
            const cycleData = await apiService.getCycles();
            setCycleList(cycleData.data.cycles);
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

    const handleCycleAction = async (action: 'add' | 'update' | 'delete', cycleData?: { name: string }, id?: string) => {
        setFetchState(prevState => ({ ...prevState, loading: true, error: null }));
        try {
            switch (action) {
                case 'add':
                    await apiService.addCycle(cycleData!);
                    break;
                case 'update':
                    await apiService.updateCycle(id!, cycleData!);
                    break;
                case 'delete':
                    await apiService.deleteCycle(id!);
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
        cycleList,
        loading: fetchState.loading,
        error: fetchState.error,
        addCycle: (cycleData: { name: string }) => handleCycleAction('add', cycleData),
        updateCycle: (id: string, cycleData: { name: string }) => handleCycleAction('update', cycleData, id),
        deleteCycle: (id: string) => handleCycleAction('delete', undefined, id),
    };
};

export default useCycle;
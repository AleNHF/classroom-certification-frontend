import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { FetchState, Personal } from '../../types';

const usePersonal = () => {
    const [personalList, setPersonalList] = useState<Personal[]>([]);
    const [fetchState, setFetchState] = useState<FetchState>({ loading: true, error: null });

    const fetchData = async () => {
        setFetchState({ loading: true, error: null });
        try {
            const response = await apiService.getPersonal();
            setPersonalList(response.data.personals);
        } catch (error) {
            setFetchState({ loading: false, error: 'Error al obtener los datos. Inténtalo de nuevo más tarde.' });
            console.error('Error fetching data:', error);
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePersonalAction = async (action: 'add' | 'update' | 'delete', personalData?: FormData, id?: string) => {
        setFetchState(prevState => ({ ...prevState, loading: true, error: null }));
        try {
            if (action === 'add') {
                await apiService.addPersonal(personalData!);
            } else if (action === 'update') {
                await apiService.updatePersonal(id!, personalData!);
            } else if (action === 'delete') {
                await apiService.deletePersonal(id!);
            }
            await fetchData();
        } catch (error) {
            console.error(`Error ${action} personal:`, error);
            setFetchState({ loading: false, error: `Error al ${action} el personal.` });
            throw error;
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
    };

    return {
        personalList,
        loading: fetchState.loading,
        error: fetchState.error,
        addPersonal: (personalData: FormData) => handlePersonalAction('add', personalData),
        updatePersonal: (id: string, personalData: FormData) => handlePersonalAction('update', personalData, id),
        deletePersonal: (id: string) => handlePersonalAction('delete', undefined, id),
    };
};

export default usePersonal;

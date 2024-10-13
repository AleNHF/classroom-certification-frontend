import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';

export interface PersonalProps {
    id: string,
    name: string;
    position: string;
    //signature: string;
}

const usePersonal = () => {
    const [personalList, setPersonalList] = useState<PersonalProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const personalData = await apiService.getPersonal();
            setPersonalList(personalData.data.personals);
        } catch (error) {
            setError('Error al obtener los datos. Inténtalo de nuevo más tarde.');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addPersonal = async (personalData: FormData) => {
        try {
            await apiService.addPersonal(personalData);
            fetchData();
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    };

    const updatePersonal = async (id: string, personalData: FormData) => {
        try {
            await apiService.updatePersonal(id, personalData);
            fetchData();
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    };

    const deletePersonal = async (id: string) => {
        try {
            await apiService.deletePersonal(id);
            fetchData();
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    };

    return {
        personalList,
        loading,
        error,
        addPersonal,
        updatePersonal,
        deletePersonal,
    };
};

export default usePersonal;

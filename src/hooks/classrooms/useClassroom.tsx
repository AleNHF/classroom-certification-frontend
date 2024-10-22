import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Classroom, FetchState } from '../../types';

const useClassroom = () => {
    const [classroomList, setClassroomList] = useState<Classroom[]>([]);
    const [fetchState, setFetchState] = useState<FetchState>({ loading: true, error: null });

    const fetchData = async () => {
        setFetchState({ loading: true, error: null });
        try {
            const response = await apiService.getClassrooms();
            console.log('classrooms', response)
            setClassroomList(response.data.classrooms);
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

    const handleClassroomAction = async (action: 'add' | 'update' | 'delete', classroomData?: {name: string, code: string, status: string}, id?: string) => {
        setFetchState(prevState => ({ ...prevState, loading: true, error: null }));
        try {
            if (action === 'add') {
                await apiService.addClassroom(classroomData!);
            } else if (action === 'update') {
                await apiService.updateClassroom(id!, classroomData!);
            } else if (action === 'delete') {
                await apiService.deleteClassroom(id!);
            }
            await fetchData();
        } catch (error) {
            console.error(`Error ${action} classroom:`, error);
            setFetchState({ loading: false, error: `Error al ${action} el aula.` });
            throw error;
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
    };

    return {
        classroomList,
        loading: fetchState.loading,
        error: fetchState.error,
        addClassroom: (classroomData: {name: string, code: string, status: string}) => handleClassroomAction('add', classroomData),
        updateClassroom: (id: string, classroomData: {name: string, code: string, status: string}) => handleClassroomAction('update', classroomData, id),
        deleteClassroom: (id: string) => handleClassroomAction('delete', undefined, id),
    };
};

export default useClassroom;

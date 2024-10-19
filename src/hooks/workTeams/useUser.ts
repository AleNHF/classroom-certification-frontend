import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import authService from '../../services/authService';
import { UserProps, Role, FetchState } from '../../types';

const useUsers = () => {
    const [userList, setUserList] = useState<UserProps[]>([]);
    const [usersMoodleList, setUsersMoodleList] = useState<UserProps[]>([]);
    const [roleList, setRoleList] = useState<Role[]>([]);
    const [fetchState, setFetchState] = useState<FetchState>({ loading: true, error: null });

    const fetchData = async () => {
        setFetchState({ loading: true, error: null });
        try {
            const [userData, moodleData, roleData] = await Promise.all([
                apiService.getUsers(),
                apiService.getUsersInMoodle(),
                authService.getRoles(),
            ]);
            const usersMoodle = moodleData.data.users;

            setUserList(userData.data.users);
            setUsersMoodleList(usersMoodle);
            setRoleList(roleData.data.roles);
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

    const handleUserAction = async (action: 'add' | 'update' | 'delete', userData?: UserProps, id?: string) => {
        setFetchState(prevState => ({ ...prevState, loading: true, error: null }));
        try {
            if (action === 'add') {
                await apiService.addUser(userData!);
            } else if (action === 'update') {
                await apiService.updateUser(id!, userData!);
            } else if (action === 'delete') {
                await apiService.deleteUser(id!);
            }
            await fetchData();
        } catch (error) {
            console.error(`Error ${action} user:`, error);
            setFetchState({ loading: false, error: `Error al ${action} el usuario.` });
            throw error;
        } finally {
            setFetchState(prevState => ({ ...prevState, loading: false }));
        }
    };

    return {
        userList,
        usersMoodleList,
        roleList,
        loading: fetchState.loading,
        error: fetchState.error,
        addUser: (userData: UserProps) => handleUserAction('add', userData),
        updateUser: (id: string, userData: UserProps) => handleUserAction('update', userData, id),
        deleteUser: (id: string) => handleUserAction('delete', undefined, id),
    };
};

export default useUsers;

import { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import authService from '../services/authService';
import { Role } from '../types/roleTypes';
import { UserProps } from '../types/userTypes';

const useUsers = () => {
    const [userList, setUserList] = useState<UserProps[]>([]);
    const [usersMoodleList, setUsersMoodleList] = useState<UserProps[]>([]);
    const [roleList, setRoleList] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
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
            setError('Error al obtener los datos. Inténtalo de nuevo más tarde.');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addUser = async (userData: UserProps) => {
        try {
            await apiService.addUser(userData);
            fetchData();
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    };

    const updateUser = async (id: string, userData: UserProps) => {
        try {
            await apiService.updateUser(id, userData);
            fetchData();
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    };

    const deleteUser = async (id: string) => {
        try {
            await apiService.deleteUser(id);
            fetchData();
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    };

    return {
        userList,
        usersMoodleList,
        roleList,
        loading,
        error,
        addUser,
        updateUser,
        deleteUser,
    };
};

export default useUsers;

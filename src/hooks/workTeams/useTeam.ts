import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { Team } from '../../types/teamTypes';

const useTeam = () => {
    const [teamList, setTeamList] = useState<Team[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const teamData = await apiService.getTeams();
            setTeamList(teamData.data.teams);
        } catch (error) {
            setError('Error al obtener los datos. Inténtalo de nuevo más tarde.');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTeam = async (teamData: Team) => {
        try {
            await apiService.addTeam(teamData);
            fetchData();
        } catch (error) {
            console.error('Error adding team:', error);
            throw error;
        }
    };

    const updateTeam = async (id: string, teamData: Team) => {
        try {
            await apiService.updateTeam(id, teamData);
            fetchData();
        } catch (error) {
            console.error('Error updating team:', error);
            throw error;
        }
    };

    const deleteTeam = async (id: string) => {
        try {
            await apiService.deleteTeam(id);
            fetchData();
        } catch (error) {
            console.error('Error deleting team:', error);
            throw error;
        }
    };

    return {
        teamList,
        loading,
        error,
        addTeam,
        updateTeam,
        deleteTeam,
    };
};

export default useTeam;
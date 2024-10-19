import { useEffect, useState } from 'react';
import apiService from '../../services/apiService';
import { FetchState, Team } from '../../types';

const useTeam = () => {
    const [teamList, setTeamList] = useState<Team[]>([]);
    const [fetchState, setFetchState] = useState<FetchState>({ loading: true, error: null });

    const fetchData = async () => {
        setFetchState({ loading: true, error: null });
        try {
            const teamData = await apiService.getTeams();
            setTeamList(teamData.data.teams);
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

    const handleTeamAction = async (action: 'add' | 'update' | 'delete', teamData?: Team, id?: string) => {
        setFetchState(prevState => ({ ...prevState, loading: true, error: null }));
        try {
            switch (action) {
                case 'add':
                    await apiService.addTeam(teamData!);
                    break;
                case 'update':
                    await apiService.updateTeam(id!, teamData!);
                    break;
                case 'delete':
                    await apiService.deleteTeam(id!);
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
        console.error(`Error ${action} team:`, error);
        setFetchState({
            loading: false,
            error: `Error al ${action} el equipo.`,
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        teamList,
        loading: fetchState.loading,
        error: fetchState.error,
        addTeam: (teamData: Team) => handleTeamAction('add', teamData),
        updateTeam: (id: string, teamData: Team) => handleTeamAction('update', teamData, id),
        deleteTeam: (id: string) => handleTeamAction('delete', undefined, id),
    };
};

export default useTeam;

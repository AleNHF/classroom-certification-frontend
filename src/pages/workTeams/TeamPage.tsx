import React, { useState } from 'react';
import HeaderComponent from '../../components/layout/HeaderComponent';
import TableComponent from '../../components/ui/TableComponent';
import AddButtonComponent from '../../components/ui/AddButtonComponent';
import ModalComponent from '../../components/ui/ModalComponent';
import useTeam from '../../hooks/useTeam';
import usePersonal from '../../hooks/usePersonal';
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal';

interface TeamMember {
    id: string;
    name: string;
    position: string;
}

const TeamPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [newTeam, setNewTeam] = useState({ id: '', name: '', management: '', faculty: '' });
    const [selectedPersonalId, setSelectedPersonalId] = useState<string | null>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [memberData, setMemberData] = useState<number[]>([]);
    const [teamToDelete, setTeamToDelete] = useState<string | null>(null);

    const { teamList, loading, error, addTeam, updateTeam, deleteTeam } = useTeam();
    const { personalList } = usePersonal();

    const handleAddClick = () => {
        setIsModalOpen(true);
        setNewTeam({ id: '', name: '', management: '', faculty: '' });
        setTeamMembers([]);
        setMemberData([]);
        setSelectedPersonalId(null);
    };

    const handleEditClick = (team: any) => {
        setIsModalOpen(true);
        setNewTeam({ id: team.id, name: team.name, management: team.management, faculty: team.faculty });
    
        const members = Array.isArray(team.personals) ? team.personals : [];
    
        setTeamMembers(members); 
        setMemberData(members.map((member: any) => member.id));
    };
    

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPersonalId(null);
        setNewTeam({ id: '', name: '', management: '', faculty: '' });
    };

    const handleAddMember = () => {
        if (selectedPersonalId) {
            const selectedMember = personalList.find(person => Number(person.id) === Number(selectedPersonalId));
            if (selectedMember) {
                const isMemberAlreadyAdded = teamMembers.some(member => member.id === selectedMember.id);
                if (!isMemberAlreadyAdded) {
                    setTeamMembers(prevMembers => [
                        ...prevMembers,
                        { id: selectedMember.id, name: selectedMember.name, position: selectedMember.position }
                    ]);
                    setMemberData(prevData => [...prevData, Number(selectedMember.id)]);
                } else {
                    console.error('El miembro ya está en el equipo.');
                }
                setSelectedPersonalId(null);
            } else {
                console.error('No se encontró el miembro seleccionado.');
            }
        }
    };

    const handleRemoveMember = (id: string) => {
        const updatedMembers = teamMembers.filter(member => member.id !== id); // filtra el miembro por ID
        setTeamMembers(updatedMembers);
        setMemberData(memberData.filter(memberId => memberId !== Number(id))); // elimina ID del estado memberData
    };

    const handleSubmitTeam = async () => {
        const teamData = {
            name: newTeam.name,
            faculty: newTeam.faculty,
            management: newTeam.management,
            personal: memberData
        }

        try {
            newTeam.id ? await updateTeam(newTeam.id, teamData) : await addTeam(teamData);
            handleCloseModal();
        } catch (error) {
            console.error('Error adding/updating team:', error);
        }
    };

    const handleDelete = (id: string) => {
        setTeamToDelete(id);
        setIsConfirmDeleteOpen(true);
    };

    const confirmDeleteTeam = async () => {
        if (teamToDelete) {
            try {
                await deleteTeam(teamToDelete);
            } catch (error) {
                console.error('Error deleting team:', error);
            } finally {
                setTeamToDelete(null);
                setIsConfirmDeleteOpen(false);
            }
        }
    };

    const headers = ["Nombre", "Gestión", "Facultad", "Acciones"];
    const rows = teamList.map((team: any) => ({
        Nombre: team.name,
        Gestión: team.management,
        Facultad: team.faculty,
        Acciones: (
            <div className="flex space-x-2">
                <button
                    className="bg-secondary-button-color text-white text-sm px-4 py-1 rounded w-24"
                    onClick={() => handleEditClick(team)}
                >
                    EDITAR
                </button>
                <button
                    className="bg-primary-red-color text-white text-sm px-4 py-1 rounded w-24"
                    onClick={() => handleDelete(team.id)}
                >
                    ELIMINAR
                </button>
            </div>
        )
    }));

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <h1 className="text-2xl font-medium my-10 text-left w-full">GESTIONAR EQUIPOS</h1>
                    <AddButtonComponent onClick={handleAddClick} />
                    <TableComponent headers={headers} rows={rows} />
                </div>
            </div>

            {/* Modal para agregar o editar equipo */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={newTeam.id ? "Editar Equipo" : "Nuevo Equipo"}
                primaryButtonText={newTeam.id ? "ACTUALIZAR" : "GUARDAR"}
                onSubmit={handleSubmitTeam}
                size='large'
            >
                <form className="space-y-4">
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                value={newTeam.name}
                                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Gestión</label>
                            <input
                                type="text"
                                value={newTeam.management}
                                onChange={(e) => setNewTeam({ ...newTeam, management: e.target.value })}
                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Facultad</label>
                            <input
                                type="text"
                                value={newTeam.faculty}
                                onChange={(e) => setNewTeam({ ...newTeam, faculty: e.target.value })}
                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Personal Técnico</label>
                        <div className="flex items-center mt-2">
                            <select
                                value={selectedPersonalId || ''}
                                onChange={(e) => setSelectedPersonalId(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-200 focus:border-blue-500"
                            >
                                <option value="" disabled>Selecciona un miembro del personal...</option>
                                {personalList.map(person => (
                                    <option key={person.id} value={person.id}>
                                        {person.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={handleAddMember}
                                className="ml-2 bg-primary-red-color text-white px-4 py-2 rounded-md"
                            >
                                AGREGAR
                            </button>
                        </div>
                    </div>

                    <table className="min-w-full mt-4">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Nombre</th>
                                <th className="px-4 py-2">Cargo</th>
                                <th className="px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamMembers.map((member) => (
                                <tr key={member.id}>
                                    <td className="border px-4 py-2">{member.name}</td>
                                    <td className="border px-4 py-2">{member.position}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => handleRemoveMember(member.id)}
                                            className="bg-red-600 text-white px-4 py-1 rounded"
                                        >
                                            ELIMINAR
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </form>
            </ModalComponent>

            {/* Modal de Confirmación de Eliminación */}
            <ConfirmDeleteModal isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)} onSubmit={confirmDeleteTeam} />
        </>
    );
};

export default TeamPage;

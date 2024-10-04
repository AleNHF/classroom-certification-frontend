import React, { useState } from 'react';
import HeaderComponent from '../../components/layout/HeaderComponent';
import TableComponent from '../../components/ui/TableComponent';
import AddButtonComponent from '../../components/ui/AddButtonComponent';
import ModalComponent from '../../components/ui/ModalComponent';

const TeamPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: '', management: '', personal: [] });
    const [selectedPersonal, setSelectedPersonal] = useState('');
    const [teamMembers, setTeamMembers] = useState([
        { name: 'Juan Carlo Soliz', position: 'Integrador' },
        { name: 'Pedro Perez', position: 'Diseñador' },
        { name: 'Juan Perez', position: 'Planificador' }
    ]);

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddMember = () => {
        if (selectedPersonal) {
            const newMember = { name: selectedPersonal, position: 'Personal Técnico' }; // Adjust position logic as needed
            setTeamMembers([...teamMembers, newMember]);
            setSelectedPersonal('');
        }
    };

    const handleRemoveMember = (index: any) => {
        const updatedMembers = [...teamMembers];
        updatedMembers.splice(index, 1);
        setTeamMembers(updatedMembers);
    };

    // Configurar las cabeceras y las filas para la tabla
    const headers = ["Nombre", "Gestión", "Facultad", "Acciones"];
    const rows = teamMembers.map((personal: any) => ({
        Nombre: personal.name,
        Gestión: personal.name,
        Facultad: personal.name,
        Cargo: personal.position,
        Acciones: (
            <div className="flex space-x-2">
                <button className="bg-secondary-button-color text-white text-sm px-4 py-1 rounded w-24">EDITAR</button>
                <button
                    className="bg-primary-red-color text-white text-sm px-4 py-1 rounded w-24"
                    onClick={() => handleRemoveMember(personal.id)}
                >
                    ELIMINAR
                </button>
            </div>
        )
    }));

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                {/* Header */}
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                {/* Main Content */}
                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <h1 className="text-2xl font-medium my-10 text-left w-full">GESTIONAR EQUIPOS</h1>
                    <AddButtonComponent onClick={handleAddClick} />
                    <TableComponent headers={headers} rows={rows} />
                </div>
            </div>

            {/* Modal para agregar nuevo personal */}
            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Nuevo Equipo"
                primaryButtonText="GUARDAR"
                onSubmit={handleAddMember}
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
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Personal Técnico</label>
                        <select
                            value={selectedPersonal}
                            onChange={(e) => setSelectedPersonal(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        >
                            <option value="">Selecciona una persona</option>
                            <option value="Juan Carlo Soliz">Juan Carlo Soliz</option>
                            <option value="Pedro Perez">Pedro Perez</option>
                            <option value="Juan Perez">Juan Perez</option>
                            {/* Add more options as needed */}
                        </select>
                        <button
                            type="button"
                            onClick={handleAddMember}
                            className="mt-2 bg-primary-red-color text-white px-4 py-2 rounded-md"
                        >
                            AGREGAR
                        </button>
                    </div>

                    {/* Table of Team Members */}
                    <table className="min-w-full mt-4">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Nombre</th>
                                <th className="px-4 py-2">Cargo</th>
                                <th className="px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamMembers.map((member, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{member.name}</td>
                                    <td className="border px-4 py-2">{member.position}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            className="bg-primary-red-color text-white px-2 py-1 rounded"
                                            onClick={() => handleRemoveMember(index)}
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
        </>
    );
};

export default TeamPage;

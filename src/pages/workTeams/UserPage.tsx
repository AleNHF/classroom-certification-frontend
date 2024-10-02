import React, { useEffect, useState } from 'react';
import HeaderComponent from '../../components/layout/HeaderComponent';
import TableComponent from '../../components/ui/TableComponent';
import AddButtonComponent from '../../components/ui/AddButtonComponent';
import ModalComponent from '../../components/ui/ModalComponent';
import apiService from '../../services/apiService';

const UserPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userList, setUserList] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', role: '' });
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

    {/* Cargar los usuarios al cargar la vista */ }
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const userData = await apiService.getPersonnel();
            setUserList(userData);
            setSuggestions(userData.map((user: any) => user.name));
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewUser({ name: '', role: '' });
        setFilteredSuggestions([]);
        setIsSuggestionsOpen(false);
    };

    const handleAddUser = async () => {
        const formData = new FormData();
        formData.append('name', newUser.name);
        formData.append('role', newUser.role);

        try {
            await apiService.addPersonnel(formData);
            fetchUsers();
            handleCloseModal();
        } catch (error) {
            console.error('Error adding user:', error)
        }
    }

    const handleDeleteUser = async (id: string) => {
        try {
            await apiService.deletePersonnel(id);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const userInput = e.target.value;
        setNewUser({ ...newUser, name: userInput });

        if (userInput) {
            const filtered = suggestions.filter(suggestion =>
                suggestion.toLowerCase().startsWith(userInput.toLowerCase())
            );
            setFilteredSuggestions(filtered);
            setIsSuggestionsOpen(true);
        } else {
            setFilteredSuggestions([]);
            setIsSuggestionsOpen(false);
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        setNewUser({ ...newUser, name: suggestion });
        setFilteredSuggestions([]);
        setIsSuggestionsOpen(false);
    }

    const headers = ["Nombre", "Rol", "Acciones"];
    const rows = userList.map((user: any) => ({
        Nombre: user.name,
        Cargo: user.role,
        Acciones: (
            <div className="flex space-x-2">
                <button className="bg-secondary-button-color text-white text-sm px-4 py-1 rounded w-24">EDITAR</button>
                <button
                    className="bg-primary-red-color text-white text-sm px-4 py-1 rounded w-24"
                    onClick={() => handleDeleteUser(user.id)}
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
                    <h1 className="text-2xl font-medium my-10 text-left w-full">GESTIONAR USUARIOS</h1>
                    <AddButtonComponent onClick={handleAddClick} />
                    <TableComponent headers={headers} rows={rows} />
                </div>
            </div>
            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Nuevo Usuario"
                primaryButtonText="AGREGAR"
                onSubmit={handleAddUser}
            >
                <form className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={newUser.name}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                        {isSuggestionsOpen && filteredSuggestions.length > 0 && (
                            <ul className="border border-gray-300 mt-1 rounded-md max-h-40 overflow-y-auto">
                                {filteredSuggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className="cursor-pointer p-2 hover:bg-gray-200"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Rol</label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        >
                            <option value="">Selecciona un rol</option>
                            <option value="Editor Audiovisual">Administrador</option>
                            <option value="Integrador">Evaluador</option>
                        </select>
                    </div>
                </form>
            </ModalComponent>
        </>
    );
};

export default UserPage;
import React, { useEffect, useState } from 'react';
import HeaderComponent from '../../components/layout/HeaderComponent';
import TableComponent from '../../components/ui/TableComponent';
import AddButtonComponent from '../../components/ui/AddButtonComponent';
import ModalComponent from '../../components/ui/ModalComponent';
import useUsers from '../../hooks/useUser';
import notifyImage from '../../assets/undraw_notify_re_65on.svg';

const UserPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [newUser, setNewUser] = useState({ id: '', name: '', username: '', roleId: '' });
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const { userList, usersMoodleList, roleList, loading, error, addUser, updateUser, deleteUser } = useUsers();

    useEffect(() => {
        if (!loading && usersMoodleList.length) {
            setSuggestions(usersMoodleList.map((user: any) => user.fullname));
        }
    }, [loading, usersMoodleList]);

    const handleAddClick = () => {
        setNewUser({ id: '', name: '', username: '', roleId: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetNewUserState();
    };

    const resetNewUserState = () => {
        setNewUser({ id: '', name: '', username: '', roleId: '' });
        setFilteredSuggestions([]);
        setIsSuggestionsOpen(false);
    };

    const handleAddOrUpdate = async () => {
        if (!newUser.roleId) {
            console.error('Error: roleId must not be empty');
            return;
        }

        const userData = {
            name: newUser.name,
            username: newUser.username || newUser.name,
            roleId: Number(newUser.roleId),
        };

        try {
            newUser.id ? await updateUser(newUser.id, userData) : await addUser(userData);
            handleCloseModal();
        } catch (error) {
            console.error('Error adding/updating user:', error);
        }
    };

    const handleDelete = (id: string) => {
        setUserToDelete(id);
        setIsConfirmDeleteOpen(true);
    };

    const confirmDeleteUser = async () => {
        if (userToDelete) {
            try {
                await deleteUser(userToDelete);
            } catch (error) {
                console.error('Error deleting user:', error);
            } finally {
                setUserToDelete(null);
                setIsConfirmDeleteOpen(false);
            }
        }
    };

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
            resetFilteredSuggestions();
        }
    };

    const resetFilteredSuggestions = () => {
        setFilteredSuggestions([]);
        setIsSuggestionsOpen(false);
    };

    const handleSuggestionClick = (suggestion: string) => {
        const selectedUser = usersMoodleList.find((user: any) => user.fullname === suggestion);
        const username = selectedUser && selectedUser.username ? selectedUser.username : '';

        setNewUser({ ...newUser, name: suggestion, username });
        resetFilteredSuggestions();
    };

    const handleEdit = (user: any) => {
        setNewUser({ id: user.id, name: user.name, username: user.username, roleId: user.rol.id });
        setIsModalOpen(true);
    };

    const headers = ["Nombre", "Username", "Rol", "Acciones"];
    const rows = userList.map((user: any) => ({
        Nombre: user.name,
        Usuario: user.username,
        Rol: roleList.find((role: any) => role.id === user.rol.id)?.name || 'N/A',
        Acciones: (
            <div className="flex space-x-2">
                <button
                    className="bg-secondary-button-color text-white text-sm px-4 py-1 rounded w-24"
                    onClick={() => handleEdit(user)}
                >
                    EDITAR
                </button>
                <button
                    className="bg-primary-red-color text-white text-sm px-4 py-1 rounded w-24"
                    onClick={() => handleDelete(user.id)}
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
                    {error && (
                        <div className="bg-red-200 text-red-600 border border-red-400 rounded-md p-3 mb-4 w-full">
                            {error}
                        </div>
                    )}
                    <AddButtonComponent onClick={handleAddClick} />
                    <TableComponent headers={headers} rows={rows} />
                </div>
            </div>
            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={newUser.id ? 'Editar Usuario' : 'Nuevo Usuario'}
                primaryButtonText={newUser.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleAddOrUpdate}
            >
                <form className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={newUser.name}
                            onChange={handleInputChange}
                            disabled={!!newUser.id}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                        {/* Mostrar las sugerencias filtradas */}
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rol</label>
                        <select value={newUser.roleId} onChange={(e) => setNewUser({ ...newUser, roleId: e.target.value })} className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500">
                            <option value="">Selecciona un rol</option>
                            {roleList.map((role: any) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
            </ModalComponent>

            {/* Modal de Confirmación de Eliminación */}
            <ModalComponent
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                title="Confirmar eliminación"
                primaryButtonText="ELIMINAR"
                onSubmit={confirmDeleteUser}
            >
                <div className="flex flex-col items-center">
                    <img
                        src={notifyImage}
                        alt="Advertencia"
                        className="w-48 h-48 mb-4"
                    />
                    <p>¿Estás seguro de que deseas eliminar este usuario?</p>
                </div>
            </ModalComponent>
        </>
    );
};

export default UserPage;
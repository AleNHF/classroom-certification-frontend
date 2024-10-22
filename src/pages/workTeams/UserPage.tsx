import React, { useEffect, useState } from 'react';
import { validateUserForm } from '../../utils/validateUserForm';
import { ActionButtonComponent, PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal, HeaderComponent, SelectInput } from '../../components';
import { LoadingPage, ErrorPage } from '../utils';
import { useUsers } from '../../hooks';

const UserPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [newUser, setNewUser] = useState<{ id: string; name: string; username: string; roleId: string }>({
        id: '',
        name: '',
        username: '',
        roleId: '',
    });
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [userError, setUserError] = useState<string | null>(null);

    const { userList, usersMoodleList, roleList, loading, error, addUser, updateUser, deleteUser } = useUsers();

    useEffect(() => {
        if (!loading && usersMoodleList.length) {
            setSuggestions(usersMoodleList.map((user: any) => user.fullname));
        }
    }, [loading, usersMoodleList]);

    const handleAddClick = () => {
        resetNewUserState();
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
        setErrorMessages({});
    };

    const handleAddOrUpdate = async () => {
        const newErrorMessages = validateUserForm(newUser);
        setErrorMessages(newErrorMessages);
        setUserError(null);

        if (Object.keys(newErrorMessages).length > 0) return;

        const userData = {
            name: newUser.name,
            username: newUser.username || newUser.name,
            roleId: Number(newUser.roleId),
        };

        try {
            newUser.id ? await updateUser(newUser.id, userData) : await addUser(userData);
            handleCloseModal();
        } catch (error) {
            handleUserActionError(error);
        }
    };

    const handleUserActionError = (error: unknown) => {
        console.error('Error adding/updating user:', error);
        if (error instanceof Error) {
            console.log('useError', userError);
            alert(error.message.includes("User with username") ? `Error: ${error.message}` : 'An unexpected error occurred.');
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
        const username = selectedUser?.username || '';

        setNewUser({ ...newUser, name: suggestion, username });
        resetFilteredSuggestions();
    };

    const handleEdit = (user: any) => {
        setNewUser({ id: user.id, name: user.name, username: user.username, roleId: user.rol.id });
        setIsModalOpen(true);
    };

    const renderTableRows = () => {
        return userList.map((user: any) => ({
            Nombre: user.name,
            Usuario: user.username,
            Rol: roleList.find((role: any) => role.id === user.rol.id)?.name || 'N/A',
            Acciones: (
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <ActionButtonComponent
                        label="EDITAR"
                        onClick={() => handleEdit(user)}
                        bgColor="bg-secondary-button-color hover:bg-blue-800"
                    />
                    <ActionButtonComponent
                        label="ELIMINAR"
                        onClick={() => handleDelete(user.id)}
                        bgColor="bg-primary-red-color hover:bg-red-400"
                    />
                </div>
            )
        }));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); 

        return () => clearTimeout(timer);
    }, []);

    if (loading || isLoading) return <LoadingPage />;
    if (error) return <ErrorPage message={error} />;

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>
                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title='GESTIONAR USUARIOS' />
                    {error && (
                        <div className="bg-red-200 text-red-600 border border-red-400 rounded-md p-3 mb-4 w-full">
                            {error}
                        </div>
                    )}
                    <AddButtonComponent onClick={handleAddClick} />
                    <div className="overflow-x-auto w-full">
                        <TableComponent headers={["Nombre", "Username", "Rol", "Acciones"]} rows={renderTableRows()} />
                    </div>
                </div>
            </div>
            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={newUser.id ? 'Editar Usuario' : 'Nuevo Usuario'}
                primaryButtonText={newUser.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleAddOrUpdate}
                size='medium'
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
                        {errorMessages.name && <p className="text-red-600 text-sm">{errorMessages.name}</p>}
                    </div>
                    <div>
                        <SelectInput
                            label="Rol"
                            value={newUser.roleId}
                            options={roleList}
                            onChange={(e) => setNewUser({ ...newUser, roleId: e.target.value })}
                            error={errorMessages.roleId}
                        />
                    </div>
                </form>
            </ModalComponent>
            <ConfirmDeleteModal 
                isOpen={isConfirmDeleteOpen} 
                onClose={() => setIsConfirmDeleteOpen(false)} 
                onSubmit={confirmDeleteUser} 
            />
        </>
    );
};

export default UserPage;
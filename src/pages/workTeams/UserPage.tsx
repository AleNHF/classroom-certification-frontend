import React, { useCallback, useEffect, useState } from 'react';
import { validateUserForm } from '../../utils/validations/validateUserForm';
import { ActionButtonComponent, PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal, HeaderComponent, SelectInput, AlertComponent, PaginationComponent } from '../../components';
import { LoadingPage, ErrorPage } from '../utils';
import { useUsers } from '../../hooks';

interface UserForm {
    id: string;
    name: string;
    username: string;
    roleId: string;
}

const INITIAL_USER_FORM: UserForm = {
    id: '',
    name: '',
    username: '',
    roleId: '',
};

const UserPage: React.FC = () => {
    // Estados de UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

    // Estados de datos
    const [newUser, setNewUser] = useState<UserForm>(INITIAL_USER_FORM);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [userToDelete, setUserToDelete] = useState<{ id: string | null, name: string | null }>({ id: null, name: null });

    // Estados de validación y errores
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [paginatedItems, setPaginatedItems] = useState<any[]>([]);

    const {
        userList,
        usersMoodleList,
        roleList,
        loading,
        error,
        successMessage,
        addUser,
        updateUser,
        deleteUser
    } = useUsers();

    // Efecto para cargar sugerencias de usuarios de Moodle
    useEffect(() => {
        if (!loading && usersMoodleList.length) {
            setSuggestions(usersMoodleList.map((user: any) => user.fullname));
        }
    }, [loading, usersMoodleList]);

    // Manejadores de modal
    const handleAddClick = useCallback(() => {
        setNewUser(INITIAL_USER_FORM);
        setIsModalOpen(true);
        setFormErrors({});
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        resetNewUserState();
    }, []);

    const resetNewUserState = () => {
        setIsModalOpen(false);
        setNewUser(INITIAL_USER_FORM);
        setFilteredSuggestions([]);
        setIsSuggestionsOpen(false);
        setFormErrors({});
    };

    // Manejador de submit del formulario
    const handleSubmit = useCallback(async () => {
        const newErrorMessages = validateUserForm(newUser);
        setFormErrors(newErrorMessages);

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
            if (error instanceof Error) {
                setFormErrors(prev => ({
                    ...prev,
                    submit: error.message.includes("User with username")
                        ? error.message
                        : 'Ha ocurrido un error inesperado'
                }));
            }
        }
    }, [newUser, addUser, updateUser]);

    // Manejadores de eliminación
    const handleDelete = useCallback((id: string, name: string) => {
        setUserToDelete({ id, name });
        setIsConfirmDeleteOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!userToDelete.id) return;

        try {
            await deleteUser(userToDelete.id);
            setIsConfirmDeleteOpen(false);
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        } finally {
            setUserToDelete({ id: null, name: null });
        }
    }, [userToDelete.id, deleteUser]);

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

    // Renderizado de filas de la tabla
    const renderTableRows = useCallback(() => {
        return paginatedItems.map((user: any) => ({
            Nombre: user.name,
            Usuario: user.username,
            Rol: roleList.find(role => role.id === user.rol.id)?.name || 'N/A',
            Acciones: (
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <ActionButtonComponent
                        label="EDITAR"
                        onClick={() => {
                            setNewUser({
                                id: user.id,
                                name: user.name,
                                username: user.username,
                                roleId: user.rol.id
                            });
                            setIsModalOpen(true);
                        }}
                        bgColor="bg-secondary-button-color hover:bg-blue-800"
                    />
                    <ActionButtonComponent
                        label="ELIMINAR"
                        onClick={() => handleDelete(user.id, user.name)}
                        bgColor="bg-primary-red-color hover:bg-red-400"
                    />
                </div>
            )
        }));
    }, [paginatedItems, roleList, handleDelete]);

    if (loading) return <LoadingPage />;
    if (error) return <ErrorPage message={error} />;

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>
                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title='GESTIONAR USUARIOS' />
                    {successMessage && (
                        <AlertComponent
                            type="success"
                            message={successMessage}
                            className="mb-4 w-full"
                        />
                    )}

                    {formErrors.submit && (
                        <AlertComponent
                            type="error"
                            message={formErrors.submit}
                            className="mb-4 w-full"
                        />
                    )}
                    <AddButtonComponent onClick={handleAddClick} />
                    <div className="overflow-x-auto w-full">
                        <TableComponent
                            headers={["Nombre", "Username", "Rol", "Acciones"]}
                            rows={renderTableRows()}
                        />
                    </div>
                    <PaginationComponent
                        items={userList}
                        onPageItemsChange={setPaginatedItems}
                    />
                </div>
            </div>
            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={newUser.id ? 'Editar Usuario' : 'Nuevo Usuario'}
                primaryButtonText={newUser.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleSubmit}
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
                        {formErrors.name && (
                            <p className="text-red-600 text-sm">{formErrors.name}</p>
                        )}
                    </div>
                    <div>
                        <SelectInput
                            label="Rol"
                            value={newUser.roleId}
                            options={roleList}
                            onChange={(e) => setNewUser({ ...newUser, roleId: e.target.value })}
                            error={formErrors.roleId}
                        />
                    </div>
                </form>
            </ModalComponent>
            <ConfirmDeleteModal
                message={`¿Estás seguro de que deseas eliminar al usuario "${userToDelete.name}"?`}
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onSubmit={handleConfirmDelete}
            />
        </>
    );
};

export default UserPage;
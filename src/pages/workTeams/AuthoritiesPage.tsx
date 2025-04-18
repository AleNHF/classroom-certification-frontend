import React, { useCallback, useState } from 'react';
import { ActionButtonComponent, PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal, HeaderComponent, AlertComponent, PaginationComponent } from '../../components';
import { ErrorPage } from '../utils';
import { validateAuthorityForm } from '../../utils/validations/validateAuthorityForm';
import useAuthority from '../../hooks/workTeams/useAuthority';
import { Authority } from '../../types';

const headers = ["Nombre", "Cargo", "Acciones"];

interface AuthorityForm {
    id: string;
    name: string;
    position: string;
    signature: File | null;
}

const INITIAL_PERSONAL_FORM: AuthorityForm = {
    id: '',
    name: '',
    position: '',
    signature: null as File | null
};

const AuthoritiesPage: React.FC = () => {
    // Estados de UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedAuthority, setSelectedAuthority] = useState<Authority | null>(null);

    // Estados de Datos
    const [authorityForm, setAuthorityForm] = useState<AuthorityForm>(INITIAL_PERSONAL_FORM);
    const [personalToDelete, setPersonalToDelete] = useState<{ id: string | null, name: string | null }>({ id: null, name: null });

    // Estados de validación y errores
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [paginatedItems, setPaginatedItems] = useState<any[]>([]);

    const {
        authorityList,
        error,
        successMessage,
        addAuthority,
        updateAuthority,
        deleteAuthority,
        getAuthorityById
    } = useAuthority();

    // Manejadores de modal
    const handleAddClick = useCallback(() => {
        setAuthorityForm(INITIAL_PERSONAL_FORM);
        setIsModalOpen(true);
        setFormErrors({});
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        resetAuthorityForm();
    }, []);

    const resetAuthorityForm = () => {
        setAuthorityForm(INITIAL_PERSONAL_FORM);
        setFormErrors({});
    };

    // Manejador de submit del formulario
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file && file.type.startsWith('image/')) {
            setAuthorityForm(prev => ({ ...prev, signature: file }));
            setFormErrors(prev => ({ ...prev, signature: '' }));
        } else {
            setFormErrors(prev => ({ ...prev, signature: 'Por favor, sube un archivo de imagen válido.' }));
        }
    };

    const handleSubmit = useCallback(async () => {
        const validation = validateAuthorityForm(authorityForm);
        if (!validation.isValid) {
            setFormErrors(validation.errors);
            return;
        }

        const formData = new FormData();
        formData.append('name', authorityForm.name);
        formData.append('position', authorityForm.position);
        if (authorityForm.signature) {
            formData.append('signature', authorityForm.signature);
        }

        setLoading(true);
        try {
            authorityForm.id
                ? await updateAuthority(authorityForm.id, formData)
                : await addAuthority(formData);
            handleCloseModal();
        } catch (error) {
            console.error('Error al añadir/actualizar autoridad:', error);
        } finally {
            setLoading(false);
        }
    }, [authorityForm, addAuthority, updateAuthority]);

    // Manejadores de eliminación
    const handleDelete = useCallback((id: string, name: string) => {
        setPersonalToDelete({ id, name });
        setIsConfirmDeleteOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (personalToDelete.id) {
            try {
                await deleteAuthority(personalToDelete.id);
            } catch (error) {
                console.error('Error al eliminar autoridad:', error);
            } finally {
                setPersonalToDelete({ id: null, name: null });
                setIsConfirmDeleteOpen(false);
            }
        }
    }, [personalToDelete.id, deleteAuthority]);

    const handleViewAuthority = useCallback(async (id: string) => {
        try {
            const authority = await getAuthorityById(id);
            setSelectedAuthority({
                id: authority.id,
                name: authority.name,
                position: authority.position,
                signature: authority.signature || null,
            });
            setIsViewModalOpen(true);
        } catch (error) {
            console.error('Error al cargar los detalles de la autoridad:', error);
        }
    }, [getAuthorityById]);

    // Renderizado de filas de la tabla
    const renderTableRows = useCallback(() => {
        return paginatedItems.map((personal: any) => ({
            Nombre: personal.name,
            Cargo: personal.position,
            Acciones: (
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <ActionButtonComponent
                        label="VER"
                        onClick={() => handleViewAuthority(personal.id)}
                        bgColor="bg-secondary-button-color hover:bg-blue-800"
                    />
                    <ActionButtonComponent
                        label="EDITAR"
                        onClick={() => {
                            setAuthorityForm({
                                id: personal.id,
                                name: personal.name,
                                position: personal.position,
                                signature: personal.signature
                            });
                            setIsModalOpen(true);
                        }}
                        bgColor="bg-optional-button-color hover:bg-slate-400"
                    />
                    <ActionButtonComponent
                        label="ELIMINAR"
                        onClick={() => handleDelete(personal.id, personal.name)}
                        bgColor="bg-primary-red-color hover:bg-red-400"
                    />
                </div>
            )
        }));

    }, [paginatedItems, handleDelete]);

    //if (loading) return <LoadingPage />;
    if (error) return <ErrorPage message={error} />;

    return (
        <div className="flex flex-col items-center justify-start bg-white min-h-screen">
            <HeaderComponent />
            <div className="flex flex-col items-center w-full max-w-6xl px-4">
                <PageHeaderComponent title='GESTIONAR AUTORIDAD ADMINISTRATIVA' />
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
                <AddButtonComponent onClick={() => handleAddClick()} />
                <div className="overflow-x-auto w-full">
                    <TableComponent headers={headers} rows={renderTableRows()} />
                </div>
                <PaginationComponent
                    items={authorityList}
                    onPageItemsChange={setPaginatedItems}
                />
            </div>

            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={authorityForm.id ? 'Editar Autoridad' : 'Nueva Autoridad'}
                primaryButtonText={authorityForm.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleSubmit}
                size="medium"
                loading={loading}
            >
                <form className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={authorityForm.name}
                            onChange={(e) => setAuthorityForm(prev => ({ ...prev, name: e.target.value }))}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                        {formErrors.name && <p className="text-red-600 text-sm">{formErrors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Cargo</label>
                        <select
                            value={authorityForm.position}
                            onChange={(e) => setAuthorityForm(prev => ({ ...prev, position: e.target.value }))}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        >
                            <option value="">Selecciona un cargo</option>
                            <option value="Jefe DEDTE">Jefe DEDTE</option>
                            <option value="Directora DICAA">Directora DICAA</option>
                            <option value="Vicerrectorado">Vicerrectorado</option>
                        </select>
                        {formErrors.position && <p className="text-red-600 text-sm">{formErrors.position}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Firma (Subir imagen)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                        {formErrors.signature && <p className="text-red-600 text-sm">{formErrors.signature}</p>}
                    </div>
                </form>
            </ModalComponent>

            <ModalComponent
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Detalles de la Autoridad"
                size="medium"
            >
                {selectedAuthority ? (
                    <div className="space-y-6">
                        {/* Cabecera con nombre y cargo */}
                        <div className="flex items-center space-x-4">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    {selectedAuthority.name}
                                </h2>
                            </div>
                        </div>

                        {/* Línea divisoria */}
                        <hr className="border-gray-200" />

                        {/* Detalles adicionales */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Cargo:</h3>
                                <p className="text-gray-600">{selectedAuthority.position}</p>
                            </div>

                            {/* Firma */}
                            {selectedAuthority.signature && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700">Firma:</h3>
                                    <div className="mt-2 flex items-center justify-center">
                                        <img
                                            src={selectedAuthority.signature}
                                            alt="Firma"
                                            className="border border-gray-300 rounded-lg shadow-md max-w-full h-auto"
                                            style={{ maxHeight: '200px' }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center min-h-[150px]">
                        <p className="text-gray-600">Cargando detalles...</p>
                    </div>
                )}
            </ModalComponent>

            <ConfirmDeleteModal
                message={`¿Estás seguro de que deseas eliminar a la autoridad "${personalToDelete.name}"?`}
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onSubmit={handleConfirmDelete}
            />
        </div>
    );
};

export default AuthoritiesPage;
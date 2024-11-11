import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal, HeaderComponent, AlertComponent, PaginationComponent } from '../../components';
import { ErrorPage } from '../utils';
import { useForm } from '../../hooks';
import { Form, FormDataProps } from '../../types';
import { validateFormData } from '../../utils/validations/validateFormData';
import IconButtonComponent from '../../components/ui/IconButtonComponent';

const headers = ["Autor de Cont.", "Servidor", "Carrera", "Resultado", "Acciones"];

const INITIAL_FORM_DATA: FormDataProps = {
    id: '',
    name: '',
    server: '',
    career: '',
    director: '',
    responsible: '',
    author: '',
    classroomId: 0
};

const FormPage: React.FC = () => {
    const { classroomId } = useParams<{ classroomId: string }>();
    const safeClassroomId = classroomId || '';
    const navigate = useNavigate();

    // Estados de UI
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    // Estados de Datos
    const [newForm, setNewForm] = useState<FormDataProps>(INITIAL_FORM_DATA);
    const [formToDelete, setFormToDelete] = useState<{ id: string | null, name: string | null }>({ id: null, name: null });
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewForm, setViewForm] = useState<Form | null>(null);

    // Estados de validación y errores
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [paginatedItems, setPaginatedItems] = useState<any[]>([]);

    const { formList, error, successMessage, getFormById, addForm, updateForm, deleteForm } = useForm(safeClassroomId);

    // Manejadores de modal
    const resetForm = () => {
        setNewForm(INITIAL_FORM_DATA);
        setFormErrors({});
    };

    const handleAddClick = useCallback(() => {
        resetForm();
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        resetForm();
    }, []);

    // Manejador de submit del formulario
    const handleSubmit = useCallback(async () => {
        const newErrorMessages = validateFormData(newForm);
        setFormErrors(newErrorMessages);

        if (Object.keys(newErrorMessages).length > 0) return;

        const formDataRequest = {
            name: newForm.name,
            server: newForm.server,
            career: newForm.career,
            director: newForm.director,
            responsible: newForm.responsible,
            author: newForm.author,
            classroomId: parseInt(safeClassroomId)
        };
        console.log('formDataRequest', formDataRequest)

        try {
            newForm.id
                ? await updateForm(newForm.id, formDataRequest)
                : await addForm(formDataRequest);

            handleCloseModal();
        } catch (error) {
            console.error('Error al añadir/actualizar el formulario:', error);
        }
    }, [newForm, addForm, updateForm]);

    // Manejadores de eliminación
    const handleDelete = useCallback((id: string, name: string) => {
        setFormToDelete({ id, name });
        setIsConfirmDeleteOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (formToDelete.id) {
            try {
                await deleteForm(formToDelete.id);
            } catch (error) {
                console.error('Error al eliminar formulario:', error);
            } finally {
                setFormToDelete({ id: null, name: null });
                setIsConfirmDeleteOpen(false);
            }
        }
    }, [formToDelete.id, deleteForm]);

    const handleEdit = (form: Form) => {
        setNewForm({
            id: form.id?.toString(),
            name: form.name!,
            server: form.server!,
            career: form.career!,
            director: form.director!,
            responsible: form.responsible!,
            author: form.author!,
            classroomId: form.classroom!.id!
        });
        setIsModalOpen(true);
    };

    const handleView = useCallback(async (formId: string) => {
        try {
            const form = await getFormById(formId);
            if (form) {
                setViewForm(form);
                setIsViewModalOpen(true);
            }
        } catch (error) {
            console.error('Error al obtener los detalles del formulario:', error);
        }
    }, [getFormById]);

    const handleAssessmentClick = (formId: string, formName: string) => {
        navigate(`/classrooms/evaluation-assessment/${formId}`, { state: { formName: formName } })
    };

    // Renderizado de filas de la tabla
    const renderTableRows = useCallback(() => {
        return paginatedItems.map((form: any) => ({
            'Autor de Cont.': form.author,
            Servidor: form.server,
            Carrera: form.career,
            Resultado: form.finalGrade,
            Acciones: (
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <IconButtonComponent
                        variant="edit"
                        onClick={() => handleEdit(form)}
                    />
                    <IconButtonComponent
                        variant="delete"
                        onClick={() => handleDelete(form.id, form.name)}
                    />
                    <IconButtonComponent
                        variant="view"
                        onClick={() => handleView(form.id)}
                    />
                    <IconButtonComponent
                        variant="content"
                        onClick={() => handleAssessmentClick(form.id, form.name)}
                    />
                </div>
            )
        }));
    }, [paginatedItems, handleDelete, handleEdit]);

    if (error) return <ErrorPage message={error} />;

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title='VALORACIÓN DE AULA VIRTUAL' />
                    {successMessage && (
                        <AlertComponent
                            type="success"
                            message={successMessage}
                            className="mb-4 w-full"
                        />
                    )}

                    <AddButtonComponent onClick={handleAddClick} />
                    <div className="overflow-x-auto w-full">
                        <TableComponent headers={headers} rows={renderTableRows()} />
                    </div>
                    <PaginationComponent
                        items={formList}
                        onPageItemsChange={setPaginatedItems}
                    />
                </div>
            </div>

            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={newForm.id ? 'Editar Formulario' : 'Nuevo Formulario'}
                primaryButtonText={newForm.id ? 'ACTUALIZAR' : 'AGREGAR'}
                onSubmit={handleSubmit}
                size="large"
            >
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                value={newForm.name}
                                onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                            />
                            {formErrors && (
                                <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Servidor</label>
                            <select
                                value={newForm.server}
                                onChange={(e) => setNewForm(prev => ({ ...prev, server: e.target.value }))}
                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                            >
                                <option value="">Selecciona un servidor</option>
                                <option value="Virtual">Virtual</option>
                                <option value="Presencial">Presencial</option>
                            </select>
                            {formErrors.server && <p className="text-red-600 text-sm">{formErrors.server}</p>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Autor de Contenido</label>
                        <input
                            type="text"
                            value={newForm.author}
                            onChange={(e) => setNewForm({ ...newForm, author: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                        {formErrors && (
                            <p className="text-red-600 text-sm mt-1">{formErrors.author}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Carrera</label>
                            <input
                                type="text"
                                value={newForm.career}
                                onChange={(e) => setNewForm({ ...newForm, career: e.target.value })}
                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                            />
                            {formErrors && (
                                <p className="text-red-600 text-sm mt-1">{formErrors.career}</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Director/a</label>
                            <input
                                type="text"
                                value={newForm.director}
                                onChange={(e) => setNewForm({ ...newForm, director: e.target.value })}
                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                            />
                            {formErrors && (
                                <p className="text-red-600 text-sm mt-1">{formErrors.director}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Responsable DEDTE-F</label>
                        <input
                            type="text"
                            value={newForm.responsible}
                            onChange={(e) => setNewForm({ ...newForm, responsible: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                        {formErrors && (
                            <p className="text-red-600 text-sm mt-1">{formErrors.responsible}</p>
                        )}
                    </div>
                </form>
            </ModalComponent>

            <ModalComponent
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Detalles del Formulario"
                size="large"
            >
                {viewForm && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Información General</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                            {viewForm.name}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Servidor</label>
                                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                            {viewForm.server}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Autor de Contenido</label>
                                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                            {viewForm.author}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Detalles Académicos</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Carrera</label>
                                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                            {viewForm.career}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Director/a</label>
                                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                            {viewForm.director}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Responsable DEDTE-F</label>
                                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded-md p-2">
                                            {viewForm.responsible}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {viewForm.finalGrade && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Resultado Final</h3>
                                <div className="bg-blue-50 p-4 rounded-md">
                                    <p className="text-lg font-medium text-blue-900">
                                        Calificación Final: {viewForm.finalGrade}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </ModalComponent>

            <ConfirmDeleteModal
                message={`¿Estás seguro de que deseas eliminar el formulario "${formToDelete.name}"?`}
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onSubmit={handleConfirmDelete}
            />
        </>
    );
};

export default FormPage;
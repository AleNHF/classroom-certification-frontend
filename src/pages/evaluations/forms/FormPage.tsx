import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeaderComponent, AddButtonComponent, TableComponent, ModalComponent, ConfirmDeleteModal, HeaderComponent, AlertComponent, PaginationComponent } from '../../../components';
import { ErrorPage } from '../../utils';
import { useForm } from '../../../hooks';
import { Form, FormDataProps } from '../../../types';
import { validateFormData } from '../../../utils/validations/validateFormData';
import IconButtonComponent from '../../../components/ui/IconButtonComponent';
import ViewFormModal from './ViewFormModal';
import FormModalContent from './FormModalComponent';

const headers = ["Autor de Cont.", "Servidor", "Carrera", "Resultado", "Acciones"];

const INITIAL_FORM_DATA: FormDataProps = {
    id: '',
    name: 'FEPCAV007',
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
    const [loading, setLoading] = useState<boolean>(false);

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

        setLoading(true);
        try {
            newForm.id
                ? await updateForm(newForm.id, formDataRequest)
                : await addForm(formDataRequest);

            handleCloseModal();
        } catch (error) {
            console.error('Error al añadir/actualizar el formulario:', error);
        } finally {
            setLoading(false);
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

    const handleAssessmentClick = async (formId: string, formName: string, formObservation: string) => {
        navigate(`/classrooms/evaluation-assessment/${formId}`, { state: { formName: formName, formObservation: formObservation } })
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
                        onClick={() => handleAssessmentClick(form.id, form.name, form.observation)}
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

                    {/* {formList.length == 0 && (
                        <AddButtonComponent onClick={handleAddClick} />
                    )} */}
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
                loading={loading}
            >
                <FormModalContent
                    formData={newForm}
                    setFormData={setNewForm}
                    formErrors={formErrors}
                />
            </ModalComponent>

            <ViewFormModal
                isOpen={isViewModalOpen}
                form={viewForm}
                onClose={() => setIsViewModalOpen(false)}
            />

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
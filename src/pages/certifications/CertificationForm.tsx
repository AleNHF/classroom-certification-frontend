import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CertificationFormData } from "../../types";
import { AlertComponent, HeaderComponent, PageHeaderComponent } from "../../components";
import { useCertification, useUsers } from "../../hooks";
import CertificationPage from "./CertificationPage";
import useAuthority from "../../hooks/workTeams/useAuthority";
import { LoadingPage } from "../utils";
import ModalCertification from "./components/ModalCerification";
import GeneralDataSection from "./components/GeneralData";

const INITIAL_FORM_DATA: CertificationFormData = {
    id: '',
    career: '',
    contentAuthor: '',
    faculty: '',
    evaluatorUsername: '',
    classroomId: 0,
    plan: '',
    modality: '',
    teacher: '',
    teacherCode: '',
    responsibleDedtef: '',
    authorityIds: []
}

const CertificationForm: React.FC = () => {
    const { classroomId } = useParams<{ classroomId: string }>();
    const safeClassroomId = classroomId || '';
    const location = useLocation();
    const classroom = location.state?.classroom;
    const navigate = useNavigate();

    const [newCertification, setNewCertification] = useState<CertificationFormData>(INITIAL_FORM_DATA);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { userList } = useUsers();
    const { authorityList } = useAuthority();
    const { certificationList, addCertification, successMessage } = useCertification(safeClassroomId);

    const evaluators = userList.filter((user: any) => user.rol.name === 'Evaluador');

    const handleSubmit = useCallback(
        async () => {
            setIsLoading(true);
    
            // Simula un tiempo de carga fijo de 2 segundos
            setTimeout(async () => {
                const authorityIds = authorityList.map((authority: any) => authority.id);
    
                const certificationData = {
                    career: newCertification.career,
                    contentAuthor: newCertification.contentAuthor,
                    faculty: newCertification.faculty,
                    evaluatorUsername: newCertification.evaluatorUsername,
                    classroomId: parseInt(safeClassroomId),
                    plan: newCertification.plan,
                    modality: newCertification.modality,
                    teacher: newCertification.teacher,
                    teacherCode: newCertification.teacherCode,
                    responsibleDedtef: newCertification.responsibleDedtef,
                    authorityIds: authorityIds
                };
    
                try {
                    const certificate = await addCertification(certificationData);
                    setIsLoading(false);
                    navigate(`/classrooms/certificate-view/${certificate.data.certification.id}`, { state: { classroom } });
                } catch (error) {
                    setIsLoading(false);
                    console.error('Error al añadir/actualizar el formulario:', error);
                }
            }, 2000); // 2 segundos de espera antes de realizar la acción
        },
        [newCertification, addCertification, authorityList, safeClassroomId, navigate, classroom]
    );
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (certificationList.length === 0) {
                setIsLoading(false);
                setShowModal(true); // Mostrar el modal si no hay certificaciones
            } else {
                const certificate = certificationList[0];
                navigate(`/classrooms/certificate-view/${certificate.id}`, { state: { classroom } });
            }
        }, 1500); // Espera 3 segundos antes de comprobar

        return () => clearTimeout(timeout); // Limpia el timeout si el componente se desmonta
    }, [certificationList, navigate, classroom]);

    return (
        <>
            {isLoading ? (
                <LoadingPage />
            ) :
                certificationList.length > 0 ? (
                    <CertificationPage />
                ) : (
                    <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                        <div className="w-full flex-shrink-0">
                            <HeaderComponent />
                        </div>
                        <div className="flex flex-col items-center w-full max-w-6xl px-4">
                            <PageHeaderComponent title={classroom.name} />
                            {successMessage && (
                                <AlertComponent
                                    type="success"
                                    message={successMessage}
                                    className="mb-4 w-full"
                                />
                            )}

                            {showModal && (
                                <ModalCertification
                                    message="El aula aún no tiene un certificado. Por favor, ingresa los datos necesarios en el formulario para poder generarlo."
                                    onClose={() => setShowModal(false)}
                                />
                            )}
                            <div className="bg-white shadow-lg rounded-lg w-full p-6">
                                <form className="space-y-6 w-full" onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmit();
                                }}>
                                    {/* Datos generales del aula */}
                                    <GeneralDataSection
                                        formData={newCertification}
                                        setFormData={setNewCertification}
                                    />

                                    {/* Datos generales de la evaluación */}
                                    <div className="w-full">
                                        <h3 className="font-semibold text-gray-600 mb-2">
                                            Datos generales de la evaluación
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Autor de contenido:
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newCertification.contentAuthor}
                                                    onChange={(e) => setNewCertification(prev => ({ ...prev, contentAuthor: e.target.value }))}
                                                    className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Responsable DEDTE-F:
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newCertification.responsibleDedtef}
                                                    onChange={(e) => setNewCertification(prev => ({ ...prev, responsibleDedtef: e.target.value }))}
                                                    className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Evaluador:
                                                </label>
                                                <select
                                                    value={newCertification.evaluatorUsername}
                                                    onChange={(e) => setNewCertification(prev => ({ ...prev, evaluatorUsername: e.target.value }))}
                                                    className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                                                >
                                                    <option>Selecciona un evaluador</option>
                                                    {evaluators.map((evaluator: any) => (
                                                        <option key={evaluator.id} value={evaluator.name}>
                                                            {evaluator.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-optional-button-color text-white rounded-md shadow hover:bg-gray-400"
                                        >
                                            CANCELAR
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-primary-red-color text-white rounded-md shadow hover:bg-red-400"
                                        >
                                            GENERAR
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
};

export default CertificationForm;
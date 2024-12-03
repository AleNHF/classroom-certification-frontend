import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CertificationFormData } from "../../types";
import { AlertComponent, HeaderComponent, PageHeaderComponent } from "../../components";
import { useCertification, useUsers } from "../../hooks";
import CertificationPage from "./CertificationPage";
import useAuthority from "../../hooks/workTeams/useAuthority";

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

    const { userList } = useUsers();
    const { authorityList } = useAuthority();
    const { certificationList, addCertification, successMessage } = useCertification(safeClassroomId);

    const evaluators = userList.filter((user: any) => user.rol.name === 'Evaluador');

    const handleSubmit = useCallback(async () => {
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
            console.log(certificate)
            navigate(`/classrooms/certificate-view/${certificate.data.certification.id}`, { state: { classroom } })
        } catch (error) {
            console.error('Error al añadir/actualizar el formulario:', error);
        }
    }, [newCertification, addCertification, safeClassroomId, navigate]);

    useEffect(() => {
        if (certificationList.length === 0) {
            setShowModal(true);
        } else {
            const certificate = certificationList[0];
            navigate(`/classrooms/certificate-view/${certificate.id}`, { state: { classroom } })
        }
    }, [certificationList]);

    return (
        <>
            {certificationList.length > 0 ? (
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
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                        Tienes que crear un certificado
                                    </h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-primary-red-color text-white rounded-md shadow hover:bg-red-400"
                                    >
                                        Aceptar
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="bg-white shadow-lg rounded-lg w-full p-6">
                            <form className="space-y-6 w-full" onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}>
                                {/* Datos generales del aula */}
                                <div className="w-full">
                                    <h3 className="font-semibold text-gray-600 mb-2">
                                        Datos generales del Aula
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Docente de la materia:
                                            </label>
                                            <input
                                                type="text"
                                                value={newCertification.teacher}
                                                onChange={(e) => setNewCertification(prev => ({ ...prev, teacher: e.target.value }))}
                                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Código de docente:
                                            </label>
                                            <input
                                                type="text"
                                                value={newCertification.teacherCode}
                                                onChange={(e) => setNewCertification(prev => ({ ...prev, teacherCode: e.target.value }))}
                                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Carrera:
                                            </label>
                                            <input
                                                type="text"
                                                value={newCertification.career}
                                                onChange={(e) => setNewCertification(prev => ({ ...prev, career: e.target.value }))}
                                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Facultad:
                                            </label>
                                            <input
                                                type="text"
                                                value={newCertification.faculty}
                                                onChange={(e) => setNewCertification(prev => ({ ...prev, faculty: e.target.value }))}
                                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Plan:
                                            </label>
                                            <select
                                                value={newCertification.plan}
                                                onChange={(e) => setNewCertification(prev => ({ ...prev, plan: e.target.value }))}
                                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                                            >
                                                <option value="">Selecciona un plan</option>
                                                <option value="Semestral">Semestral</option>
                                                <option value="Anual">Anual</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Modalidad:
                                            </label>
                                            <select
                                                value={newCertification.modality}
                                                onChange={(e) => setNewCertification(prev => ({ ...prev, modality: e.target.value }))}
                                                className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                                            >
                                                <option>Selecciona una modalidad</option>
                                                <option>Presencial</option>
                                                <option>Virtual</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

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
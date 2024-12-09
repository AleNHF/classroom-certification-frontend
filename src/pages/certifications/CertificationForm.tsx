import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CertificationFormData } from "../../types";
import { AlertComponent, HeaderComponent, PageHeaderComponent, WarningModal } from "../../components";
import { useCertification, useUsers } from "../../hooks";
import CertificationPage from "./CertificationPage";
import useAuthority from "../../hooks/workTeams/useAuthority";
import { LoadingPage } from "../utils";
import ModalCertification from "./components/ModalCerification";
import GeneralDataSection from "./components/GeneralData";
import QRCode from "qrcode";
import EvaluationDataSection from "./components/EvaluationData";
import { validateCertificationForm } from "../../utils/validations/validateCertificationForm";

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

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const evaluators = userList.filter((user: any) => user.rol.name === 'Evaluador');

    const moodleToken = localStorage.getItem('moodle_token') || '';

    const [isTokenWarningModalOpen, setIsTokenWarningModalOpen] = useState(false);

    useEffect(() => {
        if (!moodleToken) {
            setShowModal(false);
            setIsTokenWarningModalOpen(true);
        }
    }, [moodleToken]);

    const handleCloseTokenWarningModal = () => {
        setIsTokenWarningModalOpen(false);
    }

    const handleSubmit = useCallback(
        async () => {
            const newErrorMessages = validateCertificationForm(newCertification);
            setFormErrors(newErrorMessages);
            if (Object.keys(newErrorMessages).length > 0) return;

            setIsLoading(true);
            setTimeout(async () => {
                try {
                    const authorityIds = authorityList.map((authority: any) => authority.id);
                    const formattedClassroomCode = classroom.code.replace(/\s+/g, '-');
                    console.log(window.location.pathname);

                    const certificateURL = `${window.location.origin}/aula-virtual/${formattedClassroomCode}/certificado/${safeClassroomId}`;

                    // Generar el código QR como base64
                    const qrCodeBase64 = await QRCode.toDataURL(certificateURL);
                    const response = await fetch(qrCodeBase64);
                    const qrBlob = await response.blob();
                    const qrFile = new File([qrBlob], `qr-code-${safeClassroomId}.png`, { type: "image/png" });

                    // Crear un FormData para enviar los datos
                    const formData = new FormData();
                    formData.append("faculty", newCertification.faculty || "");
                    formData.append("evaluatorUsername", newCertification.evaluatorUsername || "");
                    formData.append("classroomId", safeClassroomId || "");
                    formData.append("plan", newCertification.plan || "");
                    formData.append("modality", newCertification.modality || "");
                    formData.append("teacher", newCertification.teacher || "");
                    formData.append("teacherCode", newCertification.teacherCode || "");
                    formData.append("qrFile", qrFile);
                    formData.append("authorityIds", JSON.stringify(authorityIds));

                    // Llamar a la función para crear el certificado
                    const certificate = await addCertification(formData);

                    setIsLoading(false);
                    navigate(`/classrooms/certificate-view/${certificate.data.certification.id}`, {
                        state: { classroom },
                    });
                } catch (error) {
                    setIsLoading(false);
                    console.error("Error al añadir/actualizar el formulario:", error);
                }
            }, 2000);
        },
        [newCertification, addCertification, authorityList, safeClassroomId, navigate, classroom]
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!certificationList) {
                setIsLoading(false);
                setShowModal(true);
            } else {
                const certificate = certificationList[0];
                navigate(`/classrooms/certificate-view/${certificate.id}`, { state: { classroom } });
            }
        }, 1500);

        return () => clearTimeout(timeout);
    }, [certificationList, navigate, classroom]);

    return (
        <>
            {isLoading ? (
                <LoadingPage />
            ) :
                certificationList ? (
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
                                        formErrors={formErrors}
                                    />

                                    {/* Datos generales de la evaluación */}
                                    <EvaluationDataSection
                                        formData={newCertification}
                                        setFormData={setNewCertification}
                                        evaluators={evaluators}
                                        formErrors={formErrors}
                                    />

                                    {/* Botones */}
                                    <div className="flex justify-end space-x-4">
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
                        <WarningModal
                            isOpen={isTokenWarningModalOpen}
                            onClose={handleCloseTokenWarningModal}
                            size="medium"
                        />
                    </div>
                )}
        </>
    );
};

export default CertificationForm;
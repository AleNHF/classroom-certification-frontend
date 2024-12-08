import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCertification, useUsers } from "../../hooks";
import { Certification, CertificationFormData } from "../../types";
import CertificationEditModal from "./components/CertificationEditModal";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CertificationPageView from "./components/CertificationPageView";

const CertificationPageContainer: React.FC = () => {
    const { certificationId } = useParams<{ certificationId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const classroom = location.state?.classroom;

    const { getCertificationById, updateCertification } = useCertification(classroom.id);
    const [certificationData, setCertificationData] = useState<Certification | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<CertificationFormData | null>(null);

    const { userList } = useUsers();
    const evaluators = userList.filter((user: any) => user.rol.name === 'Evaluador');

    useEffect(() => {
        const fetchCertification = async () => {
            if (!certificationId) {
                console.error("El ID del certificado no está definido");
                return;
            }

            try {
                const data = await getCertificationById(certificationId);
                setCertificationData(data);
            } catch (error) {
                console.error("Error al obtener los datos del certificado:", error);
            }
        };

        fetchCertification();
    }, [certificationId, getCertificationById]);

    const handleDownloadPDF = async () => {
        const element = document.getElementById("certificate-content");
        if (!element) {
            console.error("No se encontró el contenido del certificado para exportar");
            return;
        }

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
            });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "letter",
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`certification-${classroom.code}`);
        } catch (error) {
            console.error("Error al generar el PDF:", error);
        }
    };

    const handleOpenModal = () => {
        if (certificationData) {
            setEditData({
                id: certificationData.id || "",
                career: certificationData.career || "",
                contentAuthor: certificationData.contentAuthor || "",
                faculty: certificationData.faculty || "",
                evaluatorUsername: certificationData.evaluatorName || "",
                classroomId: classroom?.id || "",
                plan: certificationData.plan || "",
                modality: certificationData.modality || "",
                teacher: certificationData.teacher || "",
                teacherCode: certificationData.teacherCode || "",
                responsibleDedtef: certificationData.responsible || "",
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveChanges = async () => {
        if (!editData || !editData.id) {
            console.error("Los datos de edición no están completos.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("career", editData.career || "");
            formData.append("contentAuthor", editData.contentAuthor || "");
            formData.append("faculty", editData.faculty || "");
            formData.append("evaluatorUsername", editData.evaluatorUsername || "");
            formData.append("classroomId", (classroom?.id || "").toString());
            formData.append("plan", editData.plan || "");
            formData.append("modality", editData.modality || "");
            formData.append("teacher", editData.teacher || "");
            formData.append("teacherCode", editData.teacherCode || "");
            formData.append("responsibleDedtef", editData.responsibleDedtef || "");

            const updatedData = await updateCertification(editData.id, formData);
            setCertificationData(updatedData.data.certification);
            setIsModalOpen(false);
        } catch (error) {
            setIsModalOpen(false);
            console.error("Error al añadir/actualizar el formulario:", error);
        }
    };

    if (!classroom) {
        return <div>Error: No se encontró información del aula</div>;
    }

    return (
        <>
            <CertificationPageView
                classroom={classroom}
                certificationData={certificationData}
                onDownloadPDF={handleDownloadPDF}
                onOpenModal={handleOpenModal}
                onBackToDashboard={() => navigate('/classrooms/evaluation-dashboard', { state: { classroom: classroom } })}
            />
            {editData && (
                <CertificationEditModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    editData={editData}
                    setEditData={setEditData}
                    classroom={classroom}
                    evaluators={evaluators}
                    onSave={handleSaveChanges}
                />
            )}
        </>
    );
};

export default CertificationPageContainer;
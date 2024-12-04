import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HeaderComponent, PageHeaderComponent } from "../../components";
import { useCertification } from "../../hooks";
import { Certification } from "../../types";
import headerImage from "../../assets/certificate/header_cert.png";
import ribbonImage from "../../assets/certificate/ribbon_cert.png";
import dedteLogo from "../../assets/certificate/dedte_logo.png";
import uagrmLogo from "../../assets/certificate/uagrm_logo.png";
import footerImage from "../../assets/certificate/footer_cert.png";
import dedteLogoCompleto from "../../assets/certificate/dedte_firm_logo.png";
import dicaaLogo from "../../assets/certificate/dicaa_logo.png";
import vicerrectoradoLogo from "../../assets/certificate/vicerectorado_logo.png";
import signatureone from "../../assets/certificate/firma1.png";
import signaturetwo from "../../assets/certificate/firma2.png";
import signaturethree from "../../assets/certificate/firma3.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CertificationPage: React.FC = () => {
    const { certificationId } = useParams<{ certificationId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const classroom = location.state?.classroom;

    const { getCertificationById } = useCertification(classroom.id);
    const [certificationData, setCertificationData] = useState<Certification | null>(null);

    const logoMap: Record<string, string> = {
        "Jefe DEDTE": dedteLogoCompleto,
        "Directora DICAA": dicaaLogo,
        "Vicerrectorado": vicerrectoradoLogo,
    };

    const signatureMap: Record<string, string> = {
        "Jefe DEDTE": signatureone,
        "Directora DICAA": signaturetwo,
        "Vicerrectorado": signaturethree,
    };

    useEffect(() => {
        const fetchCertification = async () => {
            console.log('certificationid', certificationId)
            if (!certificationId) {
                console.error("El ID del certificado no está definido");
                return;
            }

            try {
                const data = await getCertificationById(certificationId);
                console.log(data)
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
            // Captura el contenido como una imagen usando html2canvas
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
            });
            const imgData = canvas.toDataURL("image/png");

            // Genera el PDF
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "letter",
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

            // Descarga el PDF
            pdf.save(`certification-${classroom.code}`);
        } catch (error) {
            console.error("Error al generar el PDF:", error);
        }
    };

    if (!classroom) {
        return <div>Error: No se encontró información del aula</div>;
    }

    return (
        <div className="flex flex-col items-center justify-start bg-white min-h-screen">
            <div className="w-full flex-shrink-0">
                <HeaderComponent />
            </div>

            <div className="flex flex-col items-center w-full max-w-6xl px-4">
                <PageHeaderComponent title={classroom.name} onBack={() => navigate('/classrooms/evaluation-dashboard')} />

                {/* Botones de acción */}
                <div className="flex justify-between items-center w-full my-4">
                    <div className="flex space-x-4">
                        <button
                            className="bg-black text-white px-4 py-2 rounded-md shadow hover:bg-gray-800"
                            onClick={handleDownloadPDF}
                        >
                            DESCARGAR
                        </button>
                        <button
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700"
                            onClick={() => navigate(`/classrooms/edit-certification/${certificationId}`, { state: { classroom } })}
                        >
                            EDITAR
                        </button>
                    </div>
                </div>

                {/* Información del certificado */}
                <div id="certificate-viewer" className="bg-gray-200 w-full h-96 rounded-md shadow-inner flex flex-col items-center justify-start p-4 overflow-auto">

                    {certificationData ? (
                        <div id="certificate-content" className="bg-white rounded-lg shadow-md w-full">
                            {/* Encabezado del certificado con imagen */}
                            <div className="w-full relative mb-4 bg-white">
                                {/* Imagen del encabezado */}
                                <img
                                    src={headerImage}
                                    alt="Certificado Header"
                                    className="w-full h-32 object-cover rounded-t-md"
                                />
                                {/* Imagen del ribbon */}
                                <img
                                    src={ribbonImage}
                                    alt="Certificado Ribbon"
                                    className="absolute top-10 left-9 h-40 object-cover"
                                />
                                <img
                                    src={dedteLogo}
                                    alt="Dedte Logo"
                                    className="absolute top-3 right-9 h-28 object-cover"
                                />
                                <img
                                    src={uagrmLogo}
                                    alt="Uagrm Logo"
                                    className="absolute top-28 right-9 h-24 object-cover"
                                />
                            </div>
                            <h2 className="text-6xl font-serif font-medium text-center mb-4 mt-9 text-text-color-cert tracking-widest">CERTIFICACIÓN</h2>
                            <h2 className="text-4xl font-serif font-medium text-center mb-4 ml-32 mr-32 text-text-color-subt-cert tracking-widest">Construcción de Ambiente Virtual de Aprendizaje - AVA</h2>
                            <p className="text-lg text-justify mb-4 mt-9 ml-12 mr-12 tracking-widest">Este certificado garantiza que el aula cumple con los indicadores y estándares establecidos por el Departamento de Educación a Distancia y Educación a Distancia y Tecnología Educativa   (DEDTE), asegurando que se han seguido los lineamientos apropiados para ofrecer una formación de calidad.</p>
                            <div className="border-b-2 border-text-color-subt-cert mx-12"></div>
                            <p className="text-xl text-center mt-4 font-bold tracking-widest">
                                DATOS GENERALES
                            </p>
                            <p className="text-start text-lg mt-1 ml-16"><strong>Facultad:</strong> {certificationData.faculty || "N/A"}</p>
                            <p className="text-start text-lg mt-1 ml-16"><strong>Evaluador:</strong> {certificationData.evaluatorName || "N/A"}</p>
                            <p className="text-start text-lg mt-1 ml-16"><strong>Responsable DEDTE-F:</strong> {certificationData.responsible || "N/A"}</p>
                            <p className="text-start text-lg mt-1 ml-16">
                                <strong>Fecha de Certificación:</strong>{" "}
                                {certificationData.updatedAt
                                    ? new Date(certificationData.updatedAt).toLocaleDateString("es-ES", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : "N/A"}
                            </p>

                            <p className="text-xl text-center mt-4 font-bold tracking-widest">
                                DATOS DEL DOCENTE
                            </p>
                            <p className="text-start text-lg mt-1 ml-16"><strong>Docente - Código:</strong> {certificationData.teacher || "N/A"} - {certificationData.teacherCode || "N/A"}</p>
                            <p className="text-start text-lg mt-1 ml-16"><strong>Carrera - Plan:</strong> {certificationData.career || "N/A"} -  {certificationData.plan || "N/A"}</p>

                            <p className="text-xl text-center mt-4 font-bold tracking-widest">
                                DATOS DE LA MATERIA
                            </p>
                            <p className="text-start text-lg mt-1 ml-16"><strong>Asignatura:</strong> {classroom.name || "N/A"}</p>
                            <p className="text-start text-lg mt-1 ml-16"><strong>Código:</strong> {classroom.code || "N/A"}</p>
                            <p className="text-start text-lg mt-1 ml-16"><strong>Modalidad:</strong> {certificationData.modality || "N/A"}</p>
                            <p className="text-start text-lg mt-1 ml-16"><strong>Autor de Contenido:</strong> {certificationData.contentAuthor || "N/A"}</p>
                            <p className="text-xl text-center mt-4 font-bold tracking-widest">
                                EQUIPO TÉCNICO
                            </p>
                            {classroom.team ? (
                                <ul>
                                    {classroom.team.personals.map((personal: any) => (
                                        <li className="text-start text-lg mt-1 ml-16" key={personal.id}>
                                            <strong>{personal.position}:</strong> {personal.name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay equipo técnico asignado</p>
                            )}

                            {certificationData.authorities?.length ? (
                                <div className="relative bg-white mt-6 -mb-24 z-10 max-w-5xl mx-auto">
                                    <div className="grid grid-cols-3 gap-4">
                                        {certificationData.authorities.map((authority: any) => (
                                            <div key={authority.id} className="flex flex-col items-center">
                                                {/* Imagen de la firma */}
                                                <img
                                                    src={signatureMap[authority.position] || "/default-signature.png"}
                                                    alt={`Firma de ${authority.name}`}
                                                    className="w-28 h-24 object-fill"
                                                />
                                                {/* Línea debajo de la firma */}
                                                <div className="w-44 h-px bg-gray-400 -mt-4 mb-2"></div>
                                                {/* Posición */}
                                                <p className="text-lg font-bold text-text-color-cert">{authority.position}</p>
                                                {/* Nombre */}
                                                <p className="text-lg">{authority.name}</p>
                                                {/* Logo asociado a la autoridad */}
                                                <img
                                                    src={logoMap[authority.position] || "/default-logo.png"}
                                                    alt={`Logo de ${authority.position}`}
                                                    className="w-50 object-fill mt-2 mb-4 h-24"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p>No hay autoridades asignadas</p>
                            )}

                            <div className="relative w-full bg-white">
                                <img
                                    src={footerImage}
                                    alt="Certificado Footer"
                                    className="w-full h-32 object-cover rounded-t-md"
                                />
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Cargando certificado...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CertificationPage;
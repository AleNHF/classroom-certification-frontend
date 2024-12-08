import React, { useEffect, useState } from 'react';
import headerImage from "../../../assets/certificate/header_cert.png";
import ribbonImage from "../../../assets/certificate/ribbon_cert.png";
import dedteLogo from "../../../assets/certificate/dedte_logo.png";
import uagrmLogo from "../../../assets/certificate/uagrm_logo.png";
import footerImage from "../../../assets/certificate/footer_cert.png";
import dedteLogoCompleto from "../../../assets/certificate/dedte_firm_logo.png";
import dicaaLogo from "../../../assets/certificate/dicaa_logo.png";
import vicerrectoradoLogo from "../../../assets/certificate/vicerectorado_logo.png";
import signatureone from "../../../assets/certificate/firma1.png";
import signaturetwo from "../../../assets/certificate/firma2.png";
import signaturethree from "../../../assets/certificate/firma3.png";
import backgroundImage from "../../../assets/certificate/fondo.png";

interface CertificateContentProps {
    certificationData: any;
    classroom: any;
}

const CertificateContent: React.FC<CertificateContentProps> = ({
    certificationData,
    classroom
}) => {
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

    const [base64QrUrl, setBase64QrUrl] = useState<string | null>(null);

    useEffect(() => {
        const convertImageToBase64 = async () => {
            try {
                console.log(certificationData)
                if (certificationData.qrUrl) {
                    const response = await fetch(certificationData.qrUrl, { mode: 'cors' });
                    const blob = await response.blob();
                    return new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                }
                return null;
            } catch (error) {
                console.error('Error converting image to base64:', error);
                return null;
            }
        };

        convertImageToBase64().then(setBase64QrUrl);
    }, [certificationData]);

    if (!certificationData) {
        return <p className="text-gray-500">Cargando certificado...</p>;
    }

    return (
        <div
            id="certificate-content"
            className="bg-white rounded-lg shadow-md w-full"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Header Section */}
            <div className="w-full relative mb-4">
                {/* Header and Logo Placements */}
                <img src={headerImage} alt="Certificado Header" className="w-full h-auto object-contain rounded-t-md" />
                <img src={ribbonImage} alt="Certificado Ribbon" className="absolute top-0 left-9 h-48 object-cover" />
                <img src={dedteLogo} alt="Dedte Logo" className="absolute top-0 right-4 h-24 object-fill" />
                <img src={uagrmLogo} alt="Uagrm Logo" className="absolute top-16 mt-3 right-4 h-20 object-cover" />

                {/* Title */}
                <h1 className="absolute top-40 left-28 right-10 text-7xl font-serif font-medium text-center text-text-color-cert tracking-widest">
                    CERTIFICACIÓN
                </h1>
                <h2 className="absolute top-52 left-28 right-10 text-4xl font-serif font-medium text-center mt-8 ml-32 mr-32 text-text-color-subt-cert tracking-widest">
                    Construcción de Ambiente Virtual de Aprendizaje - AVA
                </h2>
            </div>

            <p className="text-lg text-justify mb-4 mt-24 ml-12 mr-12 tracking-widest">Este certificado garantiza que el aula cumple con los indicadores y estándares establecidos por el Departamento de Educación a Distancia y Educación a Distancia y Tecnología Educativa   (DEDTE), asegurando que se han seguido los lineamientos apropiados para ofrecer una formación de calidad.</p>
            <div className="border-b-2 border-text-color-subt-cert mx-12"></div>
            <p className="text-xl text-center mt-2 font-bold tracking-widest">
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

            <div className="w-full relative">
                {certificationData.authorities?.length ? (
                    <div className="absolute bottom-0 left-0 right-0 mx-auto">
                        <img
                            src={base64QrUrl || certificationData.qrUrl}
                            alt={`QR de ${classroom.name}`}
                            className="absolute bottom-80 right-20 w-auto h-auto object-fill" // Ajusta 'top' y 'right' según lo necesario
                        />
                        <div className="relative bg-white mt-6 z-10 max-w-3xl mx-auto mb-10">
                            <div className="grid grid-cols-3 gap-8">
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
                                        <p className="text-lg font-bold text-text-color-cert text-center">{authority.position}</p>
                                        {/* Nombre */}
                                        <p className="text-center text-sm w-full break-words leading-tight">{authority.name}</p>
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
                    </div>
                ) : (
                    <p>No hay autoridades asignadas</p>
                )}
                <img
                    src={footerImage}
                    alt="Certificado Footer"
                    className="w-full h-auto object-cover"
                />
            </div>
        </div>
    );
};

export default CertificateContent;
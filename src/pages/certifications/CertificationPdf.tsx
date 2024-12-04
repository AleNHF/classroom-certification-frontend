import React from "react";

interface CertificationPageProps {
    faculty: string;
    evaluator: string;
    responsible: string;
    certificationDate: string;
    teacher: string;
    teacherCode: string;
    careerPlan: string;
    subject: string;
    subjectCode: string;
    qrCodeSrc: string;
    logoLeftSrc: string;
    logoRightSrc: string;
}

const CertificationPage: React.FC<CertificationPageProps> = ({
    faculty,
    evaluator,
    responsible,
    certificationDate,
    teacher,
    teacherCode,
    careerPlan,
    subject,
    subjectCode,
    qrCodeSrc,
    logoLeftSrc,
    logoRightSrc,
}) => {
    return (
        <div className="certificate">
            {/* Encabezado con onda */}
            <div className="header">
                <div className="header-content">
                    <img src={logoLeftSrc} alt="Logo Izquierda" />
                    <div className="title">CERTIFICACIÓN</div>
                    <img src={logoRightSrc} alt="Logo Derecha" />
                </div>
            </div>

            <div className="subtitle">Construcción de Ambiente Virtual de Aprendizaje - AVA</div>

            <div className="content">
                <p className="details">
                    Este certificado garantiza que el aula cumple con los indicadores y estándares establecidos por el Departamento de Educación a Distancia y Educación a Distancia y Tecnología Educativa (DEDiTE), asegurando que se han seguido los lineamientos apropiados para ofrecer una formación de calidad.
                </p>

                <div className="section">
                    <h4 className="section-title">DATOS GENERALES</h4>
                    <p className="details">
                        <strong>Facultad:</strong> {faculty}<br />
                        <strong>Evaluador:</strong> {evaluator}<br />
                        <strong>Responsable DEDiTE:</strong> {responsible}<br />
                        <strong>Fecha de Certificación:</strong> {certificationDate}
                    </p>
                </div>

                <div className="section">
                    <h4 className="section-title">DATOS DEL DOCENTE</h4>
                    <p className="details">
                        <strong>Docente:</strong> {teacher}<br />
                        <strong>Código:</strong> {teacherCode}<br />
                        <strong>Carrera/Plan:</strong> {careerPlan}
                    </p>
                </div>

                <div className="section">
                    <h4 className="section-title">DATOS DE LA MATERIA</h4>
                    <p className="details">
                        <strong>Asignatura:</strong> {subject}<br />
                        <strong>Código:</strong> {subjectCode}
                    </p>
                </div>

                <div className="qr-code">
                    <img src={qrCodeSrc} alt="QR Code" />
                </div>
            </div>

            <div className="signatures">
                <div className="signature">
                    <p>Firma del Jefe DEDITE</p>
                </div>
                <div className="signature">
                    <p>Firma de la Dirección</p>
                </div>
                <div className="signature">
                    <p>Firma del Vicerrectorado</p>
                </div>
            </div>
        </div>
    );
};

export default CertificationPage;
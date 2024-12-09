import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CertificateContent from './components/CertificateContent';
import apiService from '../../services/apiService';
import { ActionButtonComponent } from '../../components';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Certification {
    classroom: any;
    [key: string]: any;
}

const CertificationViewContent: React.FC = () => {
    const { classroomId } = useParams<{ classroomId: string }>();
    const [certification, setCertification] = useState<Certification | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCertification = async () => {
            try {
                if (!classroomId) {
                    setError('No classroom ID provided');
                    setIsLoading(false);
                    return;
                }

                const response = await apiService.getPublicCertificationByClassroom(classroomId);
                setCertification(response.data.certification);
            } catch (err) {
                setError('Failed to load certification');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCertification();
    }, [classroomId]);

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
            pdf.save(`certification-${certification?.classroom.code}`);
        } catch (error) {
            console.error("Error al generar el PDF:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-lg font-semibold text-gray-600">
                Cargando certificado...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-lg font-semibold text-red-500">
                {error}
            </div>
        );
    }

    if (!certification) {
        return (
            <div className="flex justify-center items-center min-h-screen text-lg font-semibold text-gray-600">
                No se encontró el certificado
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-start bg-gradient-to-r from-blue-100 to-indigo-200 min-h-screen py-8 px-4">
            <div className="flex flex-col items-center w-full max-w-6xl">
                <ActionButtonComponent
                    label="DESCARGAR"
                    onClick={handleDownloadPDF}
                    bgColor="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md shadow-lg mb-4"
                />
                <div
                    id="certificate-viewer"
                    className="bg-white w-full rounded-lg shadow-lg p-6 flex flex-col items-center justify-start mb-3 border-2 border-gray-300"
                >
                    <CertificateContent
                        certificationData={certification}
                        classroom={certification.classroom}
                    />
                </div>
            </div>
        </div>
    );
};

export default CertificationViewContent;

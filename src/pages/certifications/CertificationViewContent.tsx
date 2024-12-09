import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CertificateContent from './components/CertificateContent';
import apiService from '../../services/apiService';

interface Certification {
    classroom: any;
    [key: string]: any;
}

const CertificationViewContent: React.FC = () => {
    const { classroomId } = useParams<{ classroomId: string }>();
    console.log("Classroom ID from URL:", classroomId); 
    const [certification, setCertification] = useState<Certification | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('entra a la vista de certificado')
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

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Cargando certificado...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
    }

    if (!certification) {
        return <div className="flex justify-center items-center min-h-screen">No se encontró el certificado</div>;
    }

    return (
        <div className="flex flex-col items-center justify-start bg-white min-h-screen">
            <div className="flex flex-col items-center w-full max-w-6xl px-4">
                <div 
                    id="certificate-viewer" 
                    className="bg-gray-200 w-full h-96 rounded-md shadow-inner flex flex-col items-center justify-start p-4 overflow-auto mb-3"
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
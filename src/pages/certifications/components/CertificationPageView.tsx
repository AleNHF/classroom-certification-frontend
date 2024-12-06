import React from 'react';
import { HeaderComponent, PageHeaderComponent } from '../../../components';
import CertificateContent from './CertificateContent';

interface CertificationPageViewProps {
    classroom: any;
    certificationData: any;
    onDownloadPDF: () => void;
    onOpenModal: () => void;
    onBackToDashboard: () => void;
}

const CertificationPageView: React.FC<CertificationPageViewProps> = ({
    classroom,
    certificationData,
    onDownloadPDF,
    onOpenModal,
    onBackToDashboard
}) => {
    return (
        <div className="flex flex-col items-center justify-start bg-white min-h-screen">
            <div className="w-full flex-shrink-0">
                <HeaderComponent />
            </div>

            <div className="flex flex-col items-center w-full max-w-6xl px-4">
                <PageHeaderComponent 
                    title={classroom.name} 
                    onBack={onBackToDashboard} 
                />

                {/* Action Buttons */}
                <div className="flex justify-end items-center w-full my-4 mt-1">
                    <div className="flex space-x-4">
                        <button
                            className="bg-black text-white px-4 py-2 rounded-md shadow hover:bg-gray-800"
                            onClick={onDownloadPDF}
                        >
                            DESCARGAR
                        </button>
                        <button
                            className="bg-secondary-button-color text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700"
                            onClick={onOpenModal}
                        >
                            EDITAR
                        </button>
                    </div>
                </div>

                {/* Certificate Viewer */}
                <div id="certificate-viewer" className="bg-gray-200 w-full h-96 rounded-md shadow-inner flex flex-col items-center justify-start p-4 overflow-auto mb-3">
                    <CertificateContent 
                        certificationData={certificationData} 
                        classroom={classroom} 
                    />
                </div>
            </div>
        </div>
    );
};

export default CertificationPageView;
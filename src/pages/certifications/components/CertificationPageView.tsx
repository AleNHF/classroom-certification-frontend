import React from 'react';
import { ActionButtonComponent, ConfirmDeleteModal, HeaderComponent, PageHeaderComponent } from '../../../components';
import CertificateContent from './CertificateContent';

interface CertificationPageViewProps {
    classroom: any;
    certificationData: any;
    onDownloadPDF: () => void;
    onOpenModal: () => void;
    onBackToDashboard: () => void;
    handleDelete: () => void;
    isConfirmDeleteOpen: boolean;
    handleConfirmDelete: () => void;
    onCloseConfirmDelete: () => void;
}

const CertificationPageView: React.FC<CertificationPageViewProps> = ({
    classroom,
    certificationData,
    onDownloadPDF,
    onOpenModal,
    onBackToDashboard,
    handleDelete,
    isConfirmDeleteOpen,
    handleConfirmDelete,
    onCloseConfirmDelete
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
                        <ActionButtonComponent
                            label="DESCARGAR"
                            onClick={onDownloadPDF}
                            bgColor="bg-black hover:bg-gray-800"
                        />
                        <ActionButtonComponent
                            label="EDITAR"
                            onClick={onOpenModal}
                            bgColor="bg-secondary-button-color hover:bg-blue-800"
                        />
                        <ActionButtonComponent
                            label="ELIMINAR"
                            onClick={handleDelete}
                            bgColor="bg-primary-red-color hover:bg-red-400 hover:bg-blue-800"
                        />
                    </div>
                </div>

                {/* Certificate Viewer */}
                <div id="certificate-viewer" className="bg-gray-200 w-full h-96 rounded-md shadow-inner flex flex-col items-center justify-start p-4 overflow-auto mb-3">
                    <CertificateContent
                        certificationData={certificationData}
                        classroom={classroom}
                    />
                </div>

                <ConfirmDeleteModal
                    message={`¿Estás seguro de que deseas eliminar el certificado de esta aula?`}
                    isOpen={isConfirmDeleteOpen}
                    onClose={onCloseConfirmDelete}
                    onSubmit={handleConfirmDelete}
                />
            </div>
        </div>
    );
};

export default CertificationPageView;
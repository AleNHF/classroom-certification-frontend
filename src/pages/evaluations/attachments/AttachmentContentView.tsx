import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeaderComponent, HeaderComponent, AlertComponent } from '../../../components';
import ContentToPDF from './ContentToPdf';

const AttachmentContentView: React.FC = () => {
    const location = useLocation();
    const contentJson = location.state?.attachContent;

    const [contentData, setContentData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (contentJson) {
                    const response = await fetch(contentJson);
                    if (!response.ok) {
                        throw new Error("Error al cargar los datos del aula.");
                    }
                    const data = await response.json();
                    setContentData(data);
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [contentJson]);

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-gray-50 min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title="CONTENIDO DEL AULA" />

                    {/* Indicador de carga o error */}
                    {isLoading && (
                        <AlertComponent type="info" message={"Cargando..."} className="mb-4 w-full" />
                    )}
                    {error && (
                        <p className="text-red-500 text-lg font-medium mt-4">
                            Error: {error}
                        </p>
                    )}

                    {/* Listado de secciones y módulos */}
                    {!isLoading && !error && (
                        <ContentToPDF contentData={contentData} />
                    )}
                </div>
            </div>
        </>
    );
};

export default AttachmentContentView;
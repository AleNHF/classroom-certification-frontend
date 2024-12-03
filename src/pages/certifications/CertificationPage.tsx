import React from "react";
import { HeaderComponent, PageHeaderComponent } from "../../components";
import { useLocation, useNavigate } from "react-router-dom";

const CertificationPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const classroom = location.state?.classroom;

    if (!classroom || !classroom.id) {
        return <div>Error: No se encontró información del aula</div>;
    }

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                <PageHeaderComponent title={classroom.name} onBack={() => navigate('/classrooms/evaluation-dashboard', { state: { classroom } } )}/>
                    {/* Información de la certificación */}
                    <div className="flex justify-between items-center w-full my-4">
                        <div className="flex space-x-4">
                            <button className="bg-black text-white px-4 py-2 rounded-md shadow hover:bg-gray-800">
                                DESCARGAR
                            </button>
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700">
                                EDITAR
                            </button>
                        </div>
                    </div>

                    {/* Área del certificado */}
                    <div className="bg-gray-200 w-full h-96 rounded-md shadow-inner flex items-center justify-center">
                        {/* Aquí se mostrará el certificado */}
                        <p className="text-gray-500">El certificado se mostrará aquí...</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CertificationPage;
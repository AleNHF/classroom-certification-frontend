import React, { useEffect, useState } from 'react';
import HeaderComponent from '../../components/layout/HeaderComponent';
import { useNavigate } from 'react-router-dom';
import { ActionButtonComponent, PageHeaderComponent, TableComponent } from '../../components';
import { LoadingPage, ErrorPage } from '../utils';
import { useClassroom } from '../../hooks';

const headers = ["Código", "Nombre del Aula", "Estado", "Acciones"];

const ClassroomPage: React.FC = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'' | 'processing' | 'evaluated' | 'certified'>('');
    const [isLoading, setIsLoading] = useState(true);

    const {
        classroomList,
        loading,
        error
    } = useClassroom();

    const handleClassroomDetail = (classroomId: string) => {
        navigate(`/indicators-configuration/resources/${classroomId}`);
    };

    const rows = classroomList.map((classroom: any) => ({
        Código: classroom.code,
        'Nombre del Aula': classroom.name,
        Estado: classroom.status,
        Acciones: (
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <ActionButtonComponent
                    label="SELECCIONAR"
                    onClick={() => handleClassroomDetail(classroom.id)}
                    bgColor="bg-primary-red-color hover:bg-red-400"
                />
            </div>
        )
    }));

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000); 

        return () => clearTimeout(timer);
    }, []);

    if (loading || isLoading) return <LoadingPage />;
    if (error) return <ErrorPage message={error} />;

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title="AULAS VIRTUALES" />
                    {error && (
                        <div className="bg-red-200 text-red-600 border border-red-400 rounded-md p-3 mb-4 w-full">
                            {error}
                        </div>
                    )}

                    {/* Buscador */}
                    <div className="flex w-full justify-end mb-4">
                        <button
                            type="button"
                            className="text-white bg-secondary-button-color hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            BUSCAR AULAS A EVALUAR
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-6 ml-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Filtros */}
                    <div className="flex w-full justify-start my-4">
                        {/* Select para pantallas pequeñas */}
                        <div className="block md:hidden w-full mb-4">
                            <select
                                className="w-full px-4 py-2 border border-red-500 rounded-full focus:outline-none focus:ring focus:ring-red-300 bg-white"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as '' | 'processing' | 'evaluated' | 'certified')}
                            >
                                <option value="" className="bg-white hover:bg-red-100">Todas</option>
                                <option value="processing" className="bg-white hover:bg-red-100">En Proceso</option>
                                <option value="evaluated" className="bg-white hover:bg-red-100">Evaluadas</option>
                                <option value="certified" className="bg-white hover:bg-red-100">Certificadas</option>
                            </select>
                        </div>

                        {/* Botones para pantallas medianas y grandes */}
                        <div className="hidden md:flex w-full space-x-4">
                            <button
                                className={`px-4 py-2 rounded-full border ${filter === '' ? 'bg-red-500 text-white' : 'border-red-500 text-red-500'}`}
                                onClick={() => setFilter('')}
                            >
                                Todas
                            </button>
                            <button
                                className={`px-4 py-2 rounded-full border ${filter === 'processing' ? 'bg-red-500 text-white' : 'border-red-500 text-red-500'}`}
                                onClick={() => setFilter('processing')}
                            >
                                En Proceso
                            </button>
                            <button
                                className={`px-4 py-2 rounded-full border ${filter === 'evaluated' ? 'bg-red-500 text-white' : 'border-red-500 text-red-500'}`}
                                onClick={() => setFilter('evaluated')}
                            >
                                Evaluadas
                            </button>
                            <button
                                className={`px-4 py-2 rounded-full border ${filter === 'certified' ? 'bg-red-500 text-white' : 'border-red-500 text-red-500'}`}
                                onClick={() => setFilter('certified')}
                            >
                                Certificadas
                            </button>
                        </div>
                    </div>

                    {/* Tabla */}
                    <div className="overflow-x-auto w-full">
                        <TableComponent headers={headers} rows={rows} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClassroomPage;

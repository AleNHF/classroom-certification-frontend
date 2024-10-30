import React, { useCallback, useMemo, useState } from 'react';
import HeaderComponent from '../../components/layout/HeaderComponent';
import { ActionButtonComponent, PageHeaderComponent, SearchInputComponent, TableComponent } from '../../components';
import { ErrorPage } from '../utils';
import { useClassroom } from '../../hooks';
import { ClassroomMoodle } from '../../types';

const headers = ["Código", "Nombre", "Acciones"];

const SearchClassroomPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [fieldTerm, setFieldTerm] = useState<string>("id");
    const [customErrorMessage, setCustomErrorMessage] = useState<string | null>(null);

    const {
        searchClassroomsList,
        error,
        searchClassrooms
    } = useClassroom();

    // Manejador para la búsqueda
    const handleSearch = useCallback(() => {
        setCustomErrorMessage(null); // Resetea el mensaje de error antes de buscar
        searchClassrooms({ field: fieldTerm, value: searchTerm })
            .catch(err => {
                // Manejo específico para error 404
                if (err.message && err.message.includes('404')) {
                    setCustomErrorMessage(`No se encontró el aula en Moodle con shortname = [${searchTerm}]`);
                } else {
                    setCustomErrorMessage('Ocurrió un error al buscar el aula. Intenta de nuevo más tarde.');
                }
            });
    }, [fieldTerm, searchTerm, searchClassrooms]);

    const rows = useMemo(() => {
        return searchClassroomsList.map((classroom: ClassroomMoodle) => ({
            Código: classroom.shortname,
            Nombre: classroom.fullname,
            Acciones: (
                <ActionButtonComponent
                    label="SELECCIONAR"
                    onClick={() => { } /* manejar navegación */}
                    bgColor="bg-primary-red-color hover:bg-red-400"
                />
            )
        }));
    }, [searchClassroomsList]);

    if (error && customErrorMessage === null) {
        return <ErrorPage message={error} />;
    }

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title="BUSCAR AULAS A EVALUAR" />
                    {customErrorMessage && (
                        <div className="bg-red-100 text-red-600 border border-red-400 rounded-md p-3 mb-4 w-full">
                            {customErrorMessage}
                        </div>
                    )}

                    {/* Buscador */}
                    <div className="flex flex-col sm:flex-row w-full items-center mb-4">
                        <SearchInputComponent
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            fieldTerm={fieldTerm}
                            setFieldTerm={setFieldTerm}
                            onSearch={handleSearch}
                        />
                    </div>

                    <div className="flex w-full justify-start mt-4">
                        <p className="text-sm"> {searchClassroomsList.length} Resultados</p>
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

export default SearchClassroomPage;
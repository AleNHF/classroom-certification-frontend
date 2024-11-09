import React, { useEffect, useMemo, useState } from 'react';
import HeaderComponent from '../../components/layout/HeaderComponent';
import { ActionButtonComponent, FilterButtons, FilterSelect, PageHeaderComponent, PaginationComponent, TableComponent } from '../../components';
import { LoadingPage, ErrorPage } from '../utils';
import { useClassroom } from '../../hooks';
import { ClassroomStatus } from '../../utils/enums/classroomStatus';
import SearchButtonComponent from '../../components/ui/SearchButton';
import { useNavigate } from 'react-router-dom';

const headers = ["Nombre del Aula", "Estado", "Acciones"];

const mapStatusToText = (status: ClassroomStatus): string => {
    switch (status) {
        case ClassroomStatus.PENDING:
            return 'Pendiente';
        case ClassroomStatus.PROCESSING:
            return 'En Proceso';
        case ClassroomStatus.EVALUATED:
            return 'Evaluada';
        case ClassroomStatus.CERTIFIED:
            return 'Certificada'
        default:
            return status;
    }
}

const ClassroomPage: React.FC = () => {
    const navigate = useNavigate();

    const [filter, setFilter] = useState<'' | ClassroomStatus>('');
    const [isLoading, setIsLoading] = useState(true);
    const [paginatedItems, setPaginatedItems] = useState<any[]>([]);

    const {
        classroomList,
        loading,
        error
    } = useClassroom();

    const filteredClassrooms = useMemo(() => {
        return classroomList.filter((classroom: any) => filter === '' || classroom.status === filter);
    }, [classroomList, filter]);

    const handleConfirm = (selectedClassroom: any) => {
        console.log('handleconfifi')
        navigate('/classrooms/evaluation-dashboard', { state: { classroom: selectedClassroom } });
    }

    const rows = useMemo(() => {
        return paginatedItems.map((classroom: any) => ({
            'Nombre del Aula': classroom.name,
            Estado: mapStatusToText(classroom.status),
            Acciones: (
                <ActionButtonComponent
                    label="SELECCIONAR"
                    onClick={() => handleConfirm(classroom)}
                    bgColor="bg-primary-red-color hover:bg-red-400"
                />
            )
        }));
    }, [paginatedItems]);

    const handleSearchClassroomClick = () => {
        navigate('search');
    };

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
                    <SearchButtonComponent label='BUSCAR AULAS A EVALUAR' onClick={handleSearchClassroomClick} />

                    {/* Filtros */}
                    <div className="flex w-full justify-start my-4">
                        {/* Select para pantallas pequeñas */}
                        <div className="block md:hidden w-full mb-4">
                            <FilterSelect filter={filter} setFilter={setFilter} />
                        </div>

                        {/* Botones para pantallas medianas y grandes */}
                        <div className="hidden md:flex w-full space-x-4">
                            <FilterButtons filter={filter} setFilter={setFilter} />
                        </div>
                    </div>

                    {/* Tabla */}
                    <div className="overflow-x-auto w-full">
                        <TableComponent headers={headers} rows={rows} />
                    </div>
                    <PaginationComponent
                        items={filteredClassrooms}
                        onPageItemsChange={setPaginatedItems}
                        itemsPerPage={3}
                    />
                </div>
            </div>
        </>
    );
};

export default ClassroomPage;

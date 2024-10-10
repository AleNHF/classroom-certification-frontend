import React from 'react';
import HeaderComponent from '../../components/layout/HeaderComponent';
import Card from '../../components/ui/CardComponent';
import { useAuthContext } from '../../context/AuthContext';
import PageHeaderComponent from '../../components/ui/PageHeader';

const WorkTeamsPage: React.FC = () => {
    const { getUserRole } = useAuthContext();
    const role = getUserRole();

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                {/* Header */}
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                {/* Main Content */}
                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title='EQUIPOS DE TRABAJO' />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-2 w-full">
                        <Card title='PERSONAL TÉCNICO' route='personal' />

                        <Card title='EQUIPOS' route='teams' />

                        {role !== 'Evaluador' && (
                            <Card title='GESTIÓN DE USUARIOS' route='users' />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default WorkTeamsPage;
import React from 'react';
import Card from '../components/ui/CardComponent';
import HeaderComponent from '../components/layout/HeaderComponent';
import { useAuthContext } from '../context/AuthContext';

const HomePage: React.FC = () => {
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
                    <h1 className="text-2xl font-medium my-10 text-left w-full">DASHBOARD</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-2 w-full">
                        <Card title='CERTIFICACIÓN DE AULAS' route='/certificacion' />

                        {role !== 'Evaluador' && (
                            <Card title='CONFIGURACIÓN DE INDICADORES' route='/indicadores' />
                        )}
                        
                        <Card title='EQUIPOS DE TRABAJO' route='work-teams' />
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;

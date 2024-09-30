import React from 'react';
import HeaderComponent from '../../components/layout/HeaderComponent';
import Card from '../../components/ui/CardComponent';

const WorkTeamsPage: React.FC = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                {/* Header */}
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                {/* Main Content */}
                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    {/* Title */}
                    <h1 className="text-2xl font-medium my-10 text-left w-full">EQUIPOS DE TRABAJO</h1>

                    {/* Card Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-2 w-full">
                        {/* Tarjeta que redirige al proceso de personal técnico */}
                        <Card title='PERSONAL TÉCNICO' route='personal' />

                        {/* Tarjeta que redirige a los equipos */}
                        <Card title='EQUIPOS' route='/teams' />
                    </div>
                </div>
            </div>
        </>
    );
};

export default WorkTeamsPage;
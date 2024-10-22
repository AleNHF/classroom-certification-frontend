import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { Card, HeaderComponent, PageHeaderComponent } from '../../components';

const IndicatorConfigurationPage: React.FC = () => {
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
                    <PageHeaderComponent title='CONFIGURACIÓN DE INDICADORES' />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-2 w-full">
                        {role !== 'Evaluador' && (
                            <>
                                <Card title='CICLOS' route='cycles' />
                                <Card title='ÁREAS' route='areas' />
                                <Card title='PORCENTAJES' route='percentages' />
                                <Card title='VERSIONES' route='users' />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default IndicatorConfigurationPage;
import React, { useState } from 'react';
import HeaderComponent from '../../components/layout/HeaderComponent';
import ModalComponent from '../../components/ui/ModalComponent';
import AddButtonComponent from '../../components/ui/AddButtonComponent';
import PageHeaderComponent from '../../components/ui/PageHeader';

interface Indicator {
    name: string;
    resource: string;
    content: string;
}

const indicatorsData: Indicator[] = [
    { name: 'Cuestionario diagnóstico', resource: 'Recurso 1', content: 'Contiene banco de preguntas mínimo 10 preguntas.' },
    { name: 'Cuestionario diagnóstico', resource: 'Recurso 2', content: 'El cuestionario tiene 10 preguntas autocalificadas.' },
    { name: 'Bibliografía', resource: 'Recurso 3', content: 'Contiene documentos digitales ordenados por unidad.' },
];

const Section = ({ title }: { title: string }) => {
    return (
        <div className="border p-4 bg-gray-50 mb-4">
            <h2 className="font-bold text-xl mb-4">{title}</h2>
            <div className="grid grid-cols-3 bg-red-500 text-white font-semibold p-2 rounded-t-md">
                <span>Contenido</span>
                <span>Indicador</span>
            </div>
            {indicatorsData.map((item, index) => (
                <div
                    key={index}
                    className="grid grid-cols-3 p-2 border-b last:border-b-0"
                >
                    <span>{item.content}</span>
                    <span>{item.name}</span>
                </div>
            ))}
        </div>
    );
};

const Cycle = ({ cycle }: { cycle: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-4 bg-gray-200 hover:bg-gray-300 rounded-md mb-2"
            >
                {cycle}
            </button>
            {isOpen && (
                <Section title={`Contenido: ${cycle}`} />
            )}
        </div>
    );
};

const AspectosOrganizacionales = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-4 bg-gray-200 hover:bg-gray-300 rounded-md mb-2"
            >
                Aspectos Organizacionales
            </button>
            {isOpen && (
                <Section title="Aspectos Organizacionales" />
            )}
        </div>
    );
};

const IndicatorPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newIndicator, setNewIndicator] = useState<Indicator>({
        name: '',
        resource: '',
        content: '',
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleAddClick = () => {
        resetIndicatorForm();
        setIsModalOpen(true);
    };

    const resetIndicatorForm = () => {
        setNewIndicator({ name: '', resource: '', content: '' });
        setErrorMessage(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetIndicatorForm();
    };

    const handleAddOrUpdate = async () => {
        if (!newIndicator.name.trim() || !newIndicator.resource.trim() || !newIndicator.content.trim()) {
            setErrorMessage('Todos los campos son obligatorios.');
            return;
        }

        // Agregar lógica para agregar el nuevo indicador (puede ser una llamada a un servicio o la actualización de un estado)
        console.log('Nuevo indicador:', newIndicator);
        handleCloseModal();
    };

    return (
        <>
            <div className="flex flex-col items-center justify-start bg-white min-h-screen">
                <div className="w-full flex-shrink-0">
                    <HeaderComponent />
                </div>

                <div className="flex flex-col items-center w-full max-w-6xl px-4">
                    <PageHeaderComponent title="AREA: DISEÑO DE FORMACIÓN - INDICADORES" />

                    <AddButtonComponent onClick={handleAddClick} />

                    {/* Aspectos Organizacionales */}
                    <div className="mb-6 w-full">
                        <AspectosOrganizacionales />
                    </div>

                    {/* Ciclos */}
                    <div className="w-full">
                        <Cycle cycle="Ciclo 1" />
                        <Cycle cycle="Ciclo 2" />
                        <Cycle cycle="Ciclo 3" />
                    </div>
                </div>
            </div>

            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title='Nuevo Indicador'
                primaryButtonText="AGREGAR"
                onSubmit={handleAddOrUpdate}
                size="medium"
            >
                <form className="space-y-4">
                    {/* Select de Recursos */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Recurso</label>
                        <select
                            value={newIndicator.resource}
                            onChange={(e) => setNewIndicator({ ...newIndicator, resource: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        >
                            <option value="">Selecciona un recurso</option>
                            <option value="Recurso 1">Recurso 1</option>
                            <option value="Recurso 2">Recurso 2</option>
                            <option value="Recurso 3">Recurso 3</option>
                        </select>
                    </div>

                    {/* Select de Contenidos */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Contenido</label>
                        <select
                            value={newIndicator.content}
                            onChange={(e) => setNewIndicator({ ...newIndicator, content: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        >
                            <option value="">Selecciona un contenido</option>
                            <option value="Contenido 1">Contenido 1</option>
                            <option value="Contenido 2">Contenido 2</option>
                            <option value="Contenido 3">Contenido 3</option>
                        </select>
                    </div>

                    {/* Nombre */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nombre del Indicador</label>
                        <input
                            type="text"
                            value={newIndicator.name}
                            onChange={(e) => setNewIndicator({ ...newIndicator, name: e.target.value })}
                            className="border border-gray-300 rounded-md p-2 w-full mt-2 focus:ring focus:ring-blue-200 focus:border-blue-500"
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
                    )}
                </form>
            </ModalComponent>
        </>
    );
};

export default IndicatorPage;

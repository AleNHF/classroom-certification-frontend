import { useState } from "react";
import HeaderComponent from "../../components/layout/HeaderComponent";
import AddButtonComponent from "../../components/ui/AddButtonComponent";
import ModalComponent from "../../components/ui/ModalComponent";
import PageHeaderComponent from "../../components/ui/PageHeader";
import useContent from "../../hooks/indicatorsConfiguration/useContent";
import useCycle from "../../hooks/indicatorsConfiguration/useCycle";
import useIndicator from "../../hooks/indicatorsConfiguration/useIndicator";
import useResource from "../../hooks/indicatorsConfiguration/useResource";

interface Indicator {
    name: string;
    resource: string;
    content: string;
}

// Tabla de los indicadores para cada ciclo
const Section = ({ title, indicators }: { title: string, indicators: Indicator[] }) => {
    return (
        <div className="border p-4 bg-gray-50 mb-4">
            <h2 className="font-bold text-xl mb-4">{title}</h2>
            <div className="grid grid-cols-3 bg-red-500 text-white font-semibold p-2 rounded-t-md">
                <span>Contenido</span>
                <span>Indicador</span>
            </div>
            {indicators.map((item, index) => (
                <div key={index} className="grid grid-cols-3 p-2 border-b last:border-b-0">
                    <span>{item.content}</span>
                    <span>{item.name}</span>
                </div>
            ))}
        </div>
    );
};

const Cycle = ({ cycle, indicators, cycleId }: { cycle: string, indicators: Indicator[], cycleId: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-4 bg-gray-200 hover:bg-gray-300 rounded-md mb-2 transition-all duration-300 ease-in-out"
            >
                {cycle}
            </button>

            {isOpen && (
                <>
                    <Section title={`Contenido: ${cycle}`} indicators={indicators} />
                </>
            )}
        </div>
    );
};

const IndicatorPage: React.FC = () => {
    const { indicatorList, loading: indicatorLoading, error: indicatorError } = useIndicator();
    const { cycleList } = useCycle();
    
    // Estados para el modal y los selects dependientes
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCycle, setSelectedCycle] = useState<string>('');
    const [selectedResource, setSelectedResource] = useState<string>('');
    const [selectedContent, setSelectedContent] = useState<string>('');

    // Hooks para manejar recursos y contenidos
    const { resourceList, fetchResourceList } = useResource(selectedCycle);
    const { contentList, fetchContentList } = useContent(selectedResource);

    // Maneja el cambio en el select de ciclo
    const handleCycleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cycleId = e.target.value;
        setSelectedCycle(cycleId);
        setSelectedResource(''); // Resetea el recurso cuando se selecciona un nuevo ciclo
        setSelectedContent('');  // Resetea el contenido
        await fetchResourceList(cycleId);
    };

    // Maneja el cambio en el select de recurso
    const handleResourceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const resourceId = e.target.value;
        setSelectedResource(resourceId);
        setSelectedContent('');  // Resetea el contenido
        await fetchContentList(resourceId);
    };

    // Maneja la apertura del modal
    const handleAddClick = () => {
        setIsModalOpen(true);
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

                    {/* Modal para agregar nuevo indicador */}
                    <ModalComponent
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="Agregar Nuevo Indicador"
                        primaryButtonText="Agregar"
                        size="medium"
                    >
                        <form className="space-y-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Ciclo</label>
                                <select
                                    value={selectedCycle}
                                    onChange={handleCycleChange}
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">Selecciona un ciclo</option>
                                    {cycleList.map((cycle) => (
                                        <option key={cycle.id} value={cycle.id}>
                                            {cycle.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedCycle && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Recurso</label>
                                    <select
                                        value={selectedResource}
                                        onChange={handleResourceChange}
                                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                    >
                                        <option value="">Selecciona un recurso</option>
                                        {resourceList.map((resource) => (
                                            <option key={resource.id} value={resource.id}>
                                                {resource.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {selectedResource && contentList.length > 0 && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Contenido</label>
                                    <select
                                        value={selectedContent}
                                        onChange={(e) => setSelectedContent(e.target.value)}
                                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                                    >
                                        <option value="">Selecciona un contenido</option>
                                        {contentList.map((content) => (
                                            <option key={content.id} value={content.id}>
                                                {content.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </form>
                    </ModalComponent>

                    {/* Lista de ciclos y sus indicadores */}
                    {cycleList.map((cycle: any) => (
                        <Cycle key={cycle.id} cycle={cycle.name} cycleId={cycle.id} indicators={indicatorList} />
                    ))}

                    {indicatorLoading && <p>Cargando indicadores...</p>}
                    {indicatorError && <p className="text-red-600">{indicatorError}</p>}
                </div>
            </div>
        </>
    );
};

export default IndicatorPage;

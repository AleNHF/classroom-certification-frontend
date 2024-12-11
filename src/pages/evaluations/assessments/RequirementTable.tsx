import { Requeriment } from "../../../types";

interface RequirementsTableProps {
    requirements: Requeriment[];
    onDeleteRequirement: (id: string) => void;
}

export const RequirementsTable: React.FC<RequirementsTableProps> = ({
    requirements,
    onDeleteRequirement,
}) => {
    return (
        <table className="w-full min-w-max table-auto text-left">
            <thead>
                <tr>
                    {/* <th className="border-b border-gray-300 pb-4 pt-10">Nombre</th> */}
                    <th className="border-b border-gray-300 pb-4 pt-10">Archivo</th>
                    <th className="border-b border-gray-300 pb-4 pt-10">Acciones</th>
                </tr>
            </thead> 
            <tbody>
                {requirements.map((req) => (
                    <tr key={req.id}>
                        {/* <td className="py-4 border-b border-gray-300">{req.name}</td> */}
                        <td className="py-4 border-b border-gray-300">
                            {req.url ? (
                                <a href={req.url} target="_blank" rel="noopener noreferrer">
                                    Ver Archivo
                                </a>
                            ) : (
                                req.originalFileName
                            )}
                        </td>
                        <td className="py-4 border-b border-gray-300">
                            <button
                                onClick={() => onDeleteRequirement(req.id!)}
                                className="text-red-500"
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

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
        <table className="w-full border mt-4">
            <thead>
                <tr>
                    <th className="border px-2 py-1">Nombre</th>
                    <th className="border px-2 py-1">URL</th>
                    <th className="border px-2 py-1">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {requirements.map((req) => (
                    <tr key={req.id}>
                        <td className="border px-2 py-1">{req.name}</td>
                        <td className="border px-2 py-1">{req.url}</td>
                        <td className="border px-2 py-1">
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

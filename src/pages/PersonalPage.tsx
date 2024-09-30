import React from 'react';

const PersonalPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Gestión de Personal Técnico</h1>
            {/* Aquí puedes agregar el contenido específico de PersonalPage */}
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-200 px-4 py-2">Nombre</th>
                        <th className="border border-gray-200 px-4 py-2">Cargo</th>
                        <th className="border border-gray-200 px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Ejemplo de filas, puedes mapear tus datos aquí */}
                    <tr>
                        <td className="border border-gray-200 px-4 py-2">Juan Carlos Soliz</td>
                        <td className="border border-gray-200 px-4 py-2">Integrador</td>
                        <td className="border border-gray-200 px-4 py-2">
                            <button className="bg-blue-500 text-white px-2 py-1 rounded">EDITAR</button>
                            <button className="bg-red-500 text-white px-2 py-1 rounded ml-2">ELIMINAR</button>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-gray-200 px-4 py-2">Pedro Perez</td>
                        <td className="border border-gray-200 px-4 py-2">Diseñador</td>
                        <td className="border border-gray-200 px-4 py-2">
                            <button className="bg-blue-500 text-white px-2 py-1 rounded">EDITAR</button>
                            <button className="bg-red-500 text-white px-2 py-1 rounded ml-2">ELIMINAR</button>
                        </td>
                    </tr>
                    <tr>
                        <td className="border border-gray-200 px-4 py-2">Juan Perez</td>
                        <td className="border border-gray-200 px-4 py-2">Planificador</td>
                        <td className="border border-gray-200 px-4 py-2">
                            <button className="bg-blue-500 text-white px-2 py-1 rounded">EDITAR</button>
                            <button className="bg-red-500 text-white px-2 py-1 rounded ml-2">ELIMINAR</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default PersonalPage;

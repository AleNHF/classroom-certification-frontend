import React from 'react';

export interface TableComponentProps {
    headers: string[];
    rows: Array<{ [key: string]: string | React.ReactNode }>;
}

const TableComponent: React.FC<TableComponentProps> = ({ headers, rows }) => {
    return (
        <table className="w-full min-w-max table-auto text-left">
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} className="border-b border-gray-300 pb-4 pt-10">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {Object.values(row).map((cell, cellIndex) => (
                            <td key={cellIndex} className="py-4 border-b border-gray-300">{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TableComponent;

import React from 'react';

type DataTableProps<T> = {
    columns: { key: keyof T; label: string }[];
    data: T[];
    rowKey: (row: T, idx: number) => string | number;
};

export function DataTable<T>({ columns, data, rowKey }: DataTableProps<T>) {
    return (
        <table className="min-w-full border border-gray-200 rounded">
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={String(col.key)} className="px-4 py-2 text-left bg-gray-50 font-semibold">
                            {col.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, idx) => (
                    <tr key={rowKey(row, idx)} className="border-t">
                        {columns.map((col) => (
                            <td key={String(col.key)} className="px-4 py-2">
                                {String(row[col.key])}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default DataTable;

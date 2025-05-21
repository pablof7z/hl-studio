import React from 'react';

type StatCardProps = {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
};

export function StatCard({ label, value, icon }: StatCardProps) {
    return (
        <div className="stat-card flex items-center gap-4 p-4 bg-white rounded shadow">
            {icon && <div className="stat-icon">{icon}</div>}
            <div>
                <div className="stat-value text-2xl font-bold">{value}</div>
                <div className="stat-label text-sm text-gray-500">{label}</div>
            </div>
        </div>
    );
}

export default StatCard;

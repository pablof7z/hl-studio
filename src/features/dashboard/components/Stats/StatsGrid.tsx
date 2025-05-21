import React from 'react';
import { StatCard } from './StatCard';

type Stat = {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
};

type StatsGridProps = {
    stats: Stat[];
};

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
                <StatCard key={stat.label + idx} label={stat.label} value={stat.value} icon={stat.icon} />
            ))}
        </div>
    );
}

export default StatsGrid;

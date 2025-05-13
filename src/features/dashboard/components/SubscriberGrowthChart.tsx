import React from "react";

type SubscriberGrowthChartProps = {
    data: { date: string; value: number }[];
    width?: number;
    height?: number;
};

export function SubscriberGrowthChart({
    data,
    width = 320,
    height = 80,
}: SubscriberGrowthChartProps) {
    // Simple SVG line chart (dumb, no business logic)
    if (data.length === 0) {
        return (
            <div className="subscriber-growth-chart text-gray-400 text-sm">
                No data available
            </div>
        );
    }

    const max = Math.max(...data.map((d) => d.value));
    const min = Math.min(...data.map((d) => d.value));
    const points = data
        .map((d, i) => {
            const x = (i / (data.length - 1)) * width;
            const y =
                height -
                ((d.value - min) / (max - min || 1)) * (height - 16) -
                8;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <svg
            className="subscriber-growth-chart"
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
        >
            <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                points={points}
            />
        </svg>
    );
}

export default SubscriberGrowthChart;
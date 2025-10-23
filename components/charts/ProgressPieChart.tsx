
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ProgressPieChartProps {
    completed: number;
    remaining: number;
}

const COLORS = ['#8884d8', '#4A5568']; // Purple for completed, Gray for remaining

const ProgressPieChart: React.FC<ProgressPieChartProps> = ({ completed, remaining }) => {
    const data = [
        { name: 'Completed', value: completed },
        { name: 'Remaining', value: remaining },
    ];

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(31, 41, 55, 0.8)', // bg-gray-800 with opacity
                        borderColor: '#4A5568',
                        borderRadius: '0.75rem',
                    }}
                />
                <Legend iconType="circle" />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default ProgressPieChart;

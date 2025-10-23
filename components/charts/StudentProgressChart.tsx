
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Student, LearningPath } from '../../types';

interface StudentProgressChartProps {
    students: Student[];
    learningPaths: LearningPath[];
}

const StudentProgressChart: React.FC<StudentProgressChartProps> = ({ students, learningPaths }) => {
    const data = students.map(student => {
        const path = learningPaths.find(p => p.id === student.assignedLearningPathId);
        if (!path) return { name: student.name, progress: 0 };
        
        const allTopics = Object.values(path.topics).flat();
        const completedTopics = allTopics.filter(t => t.completed);
        const progress = allTopics.length > 0 ? (completedTopics.length / allTopics.length) * 100 : 0;
        
        return { name: student.name, progress: Math.round(progress) };
    });

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" unit="%" />
                <Tooltip
                    cursor={{ fill: 'rgba(136, 132, 216, 0.1)' }}
                     contentStyle={{
                        backgroundColor: 'rgba(31, 41, 55, 0.8)',
                        borderColor: '#4A5568',
                        borderRadius: '0.75rem',
                    }}
                />
                <Legend />
                <Bar dataKey="progress" fill="#8884d8" name="Completion Progress" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default StudentProgressChart;
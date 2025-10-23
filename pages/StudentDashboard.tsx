
import React, { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { useAppContext } from '../context/AppContext';
import ProgressPieChart from '../components/charts/ProgressPieChart';
import { Student } from '../types';
import { ChevronDownIcon, CheckCircleIcon } from '../components/icons/Icons';

const LearningPathComponent: React.FC = () => {
    const { user, learningPaths, updateTopicCompletion } = useAppContext();
    const student = user as Student;
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

    const learningPath = useMemo(() => {
        return learningPaths.find(p => p.id === student?.assignedLearningPathId);
    }, [learningPaths, student]);

    if (!learningPath) {
        return <Card><p>No learning path assigned yet.</p></Card>;
    }

    const allTopics = Object.values(learningPath.topics).flat();
    const completedTopics = allTopics.filter(t => t.completed);
    const progress = allTopics.length > 0 ? (completedTopics.length / allTopics.length) * 100 : 0;

    const toggleCategory = (category: string) => {
        setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    return (
        <Card className="lg:col-span-2">
            <div className="mb-6">
                 <h2 className="text-2xl font-semibold text-white">Your Learning Path</h2>
                 <p className="text-lg text-gray-400">For: <span className="font-bold text-purple-400">{learningPath.jobTitle}</span> at <span className="font-bold text-blue-400">{learningPath.company}</span></p>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-4 mb-6">
                <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
             <p className="text-center text-gray-300 mb-6">{Math.round(progress)}% Complete</p>

            <div className="space-y-4">
                {Object.entries(learningPath.topics).map(([category, topics]) => (
                    <div key={category} className="bg-gray-700/50 rounded-lg p-4">
                        <button onClick={() => toggleCategory(category)}

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
                        <button onClick={() => toggleCategory(category)} className="w-full flex justify-between items-center text-left focus:outline-none">
                            <h3 className="text-xl font-semibold text-white">{category}</h3>
                            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openCategories[category] ? 'rotate-180' : ''}`} />
                        </button>
                        {openCategories[category] && (
                            <ul className="mt-4 space-y-3 pl-2 border-l-2 border-gray-600">
                                {topics.map((topic) => (
                                    <li key={topic.name} className="flex items-center justify-between pl-3">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`${category}-${topic.name}`}
                                                checked={topic.completed}
                                                onChange={(e) => student && updateTopicCompletion(student.id, category, topic.name, e.target.checked)}
                                                className="w-5 h-5 text-purple-500 bg-gray-600 border-gray-500 rounded focus:ring-purple-600 cursor-pointer"
                                            />
                                            <label htmlFor={`${category}-${topic.name}`} className={`ml-3 text-gray-300 cursor-pointer ${topic.completed ? 'line-through text-gray-500' : ''}`}>
                                                {topic.name}
                                            </label>
                                        </div>
                                        {topic.completed && <CheckCircleIcon className="w-6 h-6 text-green-400" />}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};

const StudentDashboard: React.FC = () => {
    const { user, learningPaths } = useAppContext();
    const student = user as Student;

    const { completedCount, totalCount } = useMemo(() => {
        const path = learningPaths.find(p => p.id === student?.assignedLearningPathId);
        if (!path) return { completedCount: 0, totalCount: 0 };

        const allTopics = Object.values(path.topics).flat();
        const completedTopics = allTopics.filter(t => t.completed);
        return { completedCount: completedTopics.length, totalCount: allTopics.length };
    }, [learningPaths, student]);
    
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:pl-64 p-6 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <LearningPathComponent />
                        <div className="lg:col-span-1 space-y-8">
                            <Card>
                                <h2 className="text-2xl font-semibold mb-4 text-white">Overall Progress</h2>
                                <ProgressPieChart completed={completedCount} remaining={totalCount - completedCount} />
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;

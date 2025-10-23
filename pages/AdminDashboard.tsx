
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { useAppContext } from '../context/AppContext';
import StudentProgressChart from '../components/charts/StudentProgressChart';
import { LearningCategory } from '../types';
import { ChevronDownIcon } from '../components/icons/Icons';

const AdminDashboard: React.FC = () => {
    const { students, learningPaths, generateAndAssignPath } = useAppContext();
    const [jobDescription, setJobDescription] = useState('');
    const [company, setCompany] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedPath, setGeneratedPath] = useState<LearningCategory | null>(null);

    const handleStudentSelection = (studentId: string) => {
        setSelectedStudentIds(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleGeneratePath = async () => {
        if (!jobDescription.trim() || !company.trim() || !jobTitle.trim() || selectedStudentIds.length === 0) {
            alert("Please fill all fields and select at least one student.");
            return;
        }
        setIsLoading(true);
        setGeneratedPath(null);
        try {
            await generateAndAssignPath(jobDescription, company, jobTitle, selectedStudentIds);
            alert('Learning path generated and assigned successfully!');
            // Here you could fetch the newly created path to display, or simply clear the form
            setJobDescription('');
            setCompany('');
            setJobTitle('');
            setSelectedStudentIds([]);
        } catch (error) {
            console.error(error);
            alert("An error occurred while generating the path.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:pl-64 p-6 sm:p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: JD Upload and Assignment */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card>
                                <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Generate Learning Path</h2>
                                <div className="space-y-4">
                                    <input type="text" placeholder="Company Name (e.g., Google)" value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-gray-700/50 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"/>
                                    <input type="text" placeholder="Job Title (e.g., Software Engineer)" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="w-full bg-gray-700/50 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"/>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste the Job Description here..."
                                        className="w-full h-48 bg-gray-700/50 p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    />
                                    <button
                                        onClick={handleGeneratePath}
                                        disabled={isLoading}
                                        className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Generating...' : 'Generate & Assign Path'}
                                    </button>
                                </div>
                            </Card>

                             <Card>
                                <h2 className="text-xl font-semibold mb-4">Student Progress Overview</h2>
                                <StudentProgressChart students={students} learningPaths={learningPaths} />
                            </Card>
                        </div>
                        
                        {/* Right Column: Student List */}
                        <div className="lg:col-span-1">
                             <Card className="max-h-[calc(100vh-10rem)] overflow-y-auto">
                                <h2 className="text-xl font-semibold mb-4">Assign to Students</h2>
                                <div className="space-y-3">
                                    {students.map(student => (
                                        <div key={student.id}
                                            className="flex items-center p-3 bg-gray-700/40 rounded-lg cursor-pointer"
                                            onClick={() => handleStudentSelection(student.id)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedStudentIds.includes(student.id)}
                                                readOnly
                                                className="w-5 h-5 text-purple-500 bg-gray-600 border-gray-500 rounded focus:ring-purple-600"
                                            />
                                            <div className="ml-3">
                                                <p className="font-medium text-white">{student.name}</p>
                                                <p className="text-sm text-gray-400">{student.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

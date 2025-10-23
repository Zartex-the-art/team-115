
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { UploadIcon, DocumentTextIcon, ChartBarIcon } from '../components/icons/Icons';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700/50 text-center transform hover:scale-105 transition-transform duration-300">
        <div className="flex justify-center items-center mb-4 w-12 h-12 mx-auto bg-purple-500/20 rounded-full">
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);

const LandingPage: React.FC = () => {
    const { login } = useAppContext();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 via-gray-900 to-purple-900/50">
            <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-4">
                    SmartLMS
                </h1>
                <p className="text-xl text-gray-300">AI-Powered Placement Readiness Platform</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mb-12">
                <FeatureCard 
                    icon={<UploadIcon />}
                    title="Upload JD"
                    description="Easily upload or paste job descriptions to get started."
                />
                <FeatureCard 
                    icon={<DocumentTextIcon />}
                    title="Generate Learning Path"
                    description="Our AI analyzes the JD to create a custom learning roadmap."
                />
                <FeatureCard 
                    icon={<ChartBarIcon />}
                    title="Track Progress"
                    description="Monitor student progress with intuitive analytics and reports."
                />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <button
                    onClick={() => login(UserRole.Admin)}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-200"
                >
                    Login as Admin
                </button>
                <button
                    onClick={() => login(UserRole.Student)}
                    className="px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-600 transform transition-transform duration-200 hover:scale-105"
                >
                    Login as Student
                </button>
            </div>
        </div>
    );
};

export default LandingPage;

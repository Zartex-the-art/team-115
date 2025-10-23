
import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { UserRole } from './types';

const AppContent: React.FC = () => {
    const { user } = useAppContext();

    if (!user) {
        return <LandingPage />;
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {user.role === UserRole.Admin && <AdminDashboard />}
            {user.role === UserRole.Student && <StudentDashboard />}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;

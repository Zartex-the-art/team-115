
import React, { useState } from 'react';
import { HomeIcon, ChartBarIcon, DocumentTextIcon, CogIcon, LogoutIcon, MenuIcon, XIcon } from './icons/Icons';
import { useAppContext } from '../context/AppContext';

interface SidebarProps {
    // Props can be added here if needed for different roles
}

const Sidebar: React.FC<SidebarProps> = () => {
    const { logout, user } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { icon: <HomeIcon />, label: "Dashboard" },
        { icon: <DocumentTextIcon />, label: "Learning Path" },
        { icon: <ChartBarIcon />, label: "Analytics" },
        { icon: <CogIcon />, label: "Settings" },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-gray-800/50 backdrop-blur-sm"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <XIcon /> : <MenuIcon />}
            </button>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full bg-gray-900/70 backdrop-blur-lg border-r border-gray-700/50 transition-transform duration-300 ease-in-out z-20 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-64`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-700/50">
                        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">SmartLMS</h1>
                        <p className="text-sm text-gray-400">Welcome, {user?.name}</p>
                    </div>

                    <nav className="flex-1 p-4">
                        <ul>
                            {navItems.map((item, index) => (
                                <li key={index} className="mb-2">
                                    <a href="#" className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-purple-500/10 hover:text-white transition-colors duration-200">
                                        {item.icon}
                                        <span className="ml-4 font-medium">{item.label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="p-4 border-t border-gray-700/50">
                        <button
                            onClick={logout}
                            className="flex items-center w-full p-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                        >
                            <LogoutIcon />
                            <span className="ml-4 font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

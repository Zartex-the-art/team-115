
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User, Student, LearningPath, UserRole, LearningTopic, LearningCategory } from '../types';
import { DUMMY_STUDENTS, DUMMY_LEARNING_PATHS } from '../constants';
import { generateLearningPathFromJD } from '../services/geminiService';

interface AppContextType {
    user: User | null;
    students: Student[];
    learningPaths: LearningPath[];
    login: (role: UserRole) => void;
    logout: () => void;
    generateAndAssignPath: (jobDescription: string, company: string, jobTitle: string, selectedStudentIds: string[]) => Promise<void>;
    updateTopicCompletion: (studentId: string, category: string, topicName: string, completed: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [students, setStudents] = useState<Student[]>(DUMMY_STUDENTS.map(s => ({ ...s, assignedLearningPathId: 'LP1' })));
    const [learningPaths, setLearningPaths] = useState<LearningPath[]>(DUMMY_LEARNING_PATHS);

    const login = (role: UserRole) => {
        if (role === UserRole.Admin) {
            setUser({ id: 'A1', name: 'Admin User', email: 'admin@smartlms.com', role: UserRole.Admin });
        } else {
            setUser(students[0]); // Log in as the first student for demo
        }
    };

    const logout = () => {
        setUser(null);
    };

    const generateAndAssignPath = useCallback(async (jobDescription: string, company: string, jobTitle: string, selectedStudentIds: string[]) => {
        const generatedTopics = await generateLearningPathFromJD(jobDescription);
        
        const newPath: LearningPath = {
            id: `LP${learningPaths.length + 1}`,
            company,
            jobTitle,
            topics: Object.keys(generatedTopics).reduce((acc: LearningCategory, key: string) => {
                acc[key] = (generatedTopics as any)[key].map((topicName: string) => ({ name: topicName, completed: false }));
                return acc;
            }, {})
        };

        setLearningPaths(prevPaths => [...prevPaths, newPath]);
        setStudents(prevStudents =>
            prevStudents.map(student =>
                selectedStudentIds.includes(student.id)
                    ? { ...student, assignedLearningPathId: newPath.id }
                    : student
            )
        );
    }, [learningPaths]);

    const updateTopicCompletion = (studentId: string, category: string, topicName: string, completed: boolean) => {
        const student = students.find(s => s.id === studentId);
        if (!student || !student.assignedLearningPathId) return;

        setLearningPaths(prevPaths => prevPaths.map(path => {
            if (path.id === student.assignedLearningPathId) {
                const newTopics = { ...path.topics };
                if (newTopics[category]) {
                    newTopics[category] = newTopics[category].map(topic =>
                        topic.name === topicName ? { ...topic, completed } : topic
                    );
                }
                return { ...path, topics: newTopics };
            }
            return path;
        }));
    };

    return (
        <AppContext.Provider value={{ user, students, learningPaths, login, logout, generateAndAssignPath, updateTopicCompletion }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
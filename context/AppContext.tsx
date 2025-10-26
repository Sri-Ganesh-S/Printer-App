import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { PrintJob, UserRole } from '../types';

interface AppContextType {
  role: UserRole | null;
  currentUser: string | null;
  login: (username: string, role: UserRole) => void;
  logout: () => void;
  jobs: PrintJob[];
  addJob: (job: Omit<PrintJob, 'id' | 'status' | 'createdAt' | 'studentId' | 'tokenNumber'>) => void;
  completeJob: (jobId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [jobs, setJobs] = useState<PrintJob[]>([]);

  const login = (username: string, role: UserRole) => {
    setCurrentUser(username);
    setRole(role);
  };

  const logout = () => {
    setCurrentUser(null);
    setRole(null);
  };

  const addJob = useCallback((jobData: Omit<PrintJob, 'id' | 'status' | 'createdAt' | 'studentId' | 'tokenNumber'>) => {
    if (!currentUser) return;
    const newJob: PrintJob = {
      ...jobData,
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: Date.now(),
      studentId: currentUser,
    };
    setJobs(prevJobs => [...prevJobs, newJob]);
  }, [currentUser]);

  const completeJob = useCallback((jobId: string) => {
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId ? { ...job, status: 'completed', tokenNumber: token } : job
      )
    );
  }, []);

  const value = { role, currentUser, login, logout, jobs, addJob, completeJob };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
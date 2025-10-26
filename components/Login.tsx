import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { PrinterIcon, UserIcon } from './common/Icons';

type LoginView = 'student' | 'printer';

export const Login: React.FC = () => {
  const { login } = useAppContext();
  const [activeView, setActiveView] = useState<LoginView>('student');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim(), UserRole.Student);
    } else {
        setError('Please enter a username.');
    }
  };

  const handlePrinterLogin = () => {
    login('printer', UserRole.Printer);
  };
  
  const getTabClass = (view: LoginView) =>
    `flex-1 py-3 text-center font-semibold border-b-4 transition-colors duration-200 ${
      activeView === view
        ? 'border-primary text-primary'
        : 'border-transparent text-textSecondary hover:text-textPrimary'
    }`;


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-primary p-3 rounded-full">
                <PrinterIcon className="w-8 h-8 text-onPrimary" />
            </div>
            <h1 className="text-4xl font-bold text-textPrimary tracking-tight">
                Printer App
            </h1>
        </div>
        <div className="bg-surface rounded-xl shadow-2xl overflow-hidden border">
          <div className="flex">
            <button onClick={() => setActiveView('student')} className={getTabClass('student')}>
              I'm a Student
            </button>
            <button onClick={() => setActiveView('printer')} className={getTabClass('printer')}>
              I'm the Printer
            </button>
          </div>

          <div className="p-8">
            {activeView === 'student' ? (
              <form onSubmit={handleStudentLogin} className="space-y-6">
                <h2 className="text-xl font-semibold text-center text-textPrimary">Student Login</h2>
                <div>
                  <label htmlFor="username" className="text-sm font-medium text-textSecondary">
                    Enter your name to continue
                  </label>
                  <div className="mt-2 relative">
                    <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => {
                          setUsername(e.target.value);
                          if(error) setError('');
                      }}
                      placeholder="e.g., Jane Doe"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                  </div>
                   {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-onPrimary font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-transform transform hover:scale-105"
                >
                  Login as Student
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                 <h2 className="text-xl font-semibold text-textPrimary">Printer Login</h2>
                 <p className="text-textSecondary">Access the print queue to manage all student jobs.</p>
                 <PrinterIcon className="w-16 h-16 text-primary/50 mx-auto"/>
                <button
                  onClick={handlePrinterLogin}
                  className="w-full bg-primary text-onPrimary font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-transform transform hover:scale-105"
                >
                  Access Print Queue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { LogOutIcon, PrinterIcon } from './Icons';

export const Header: React.FC = () => {
  const { currentUser, logout } = useAppContext();

  return (
    <header className="bg-surface shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-full">
            <PrinterIcon className="w-6 h-6 text-onPrimary" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-textPrimary tracking-tight">
            Printer App
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-textSecondary hidden sm:inline">
            Welcome, <span className="font-bold text-textPrimary capitalize">{currentUser}</span>
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-textPrimary bg-surface hover:bg-gray-100 border"
            aria-label="Logout"
          >
            <LogOutIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
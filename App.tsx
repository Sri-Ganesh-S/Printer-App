import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Header } from './components/common/Header';
import { StudentView } from './components/StudentView';
import { PrinterView } from './components/PrinterView';
import { UserRole } from './types';
import { Login } from './components/Login';

const AppContent: React.FC = () => {
    const { currentUser, role } = useAppContext();

    if (!currentUser) {
        return <Login />;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {role === UserRole.Student ? <StudentView /> : <PrinterView />}
            </main>
        </div>
    );
}


const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
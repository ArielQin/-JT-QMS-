import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { DataEntry } from './pages/DataEntry';
import { Traceability } from './pages/Traceability';
import { Inventory } from './pages/Inventory';
import { SecurityLogs } from './pages/SecurityLogs';
import { RiskAnalysis } from './pages/RiskAnalysis';
import { Login } from './pages/Login';
import { Menu } from 'lucide-react';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If not logged in, show Login page (this is handled in AppContent, but double check)
  if (!user) return <Login />;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden animate-fade-in">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center z-10">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-500 mr-4">
            <Menu size={24} />
          </button>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-sm">JT</span>
            </div>
            <span className="font-semibold text-slate-800">姣恬科技</span>
          </div>
        </header>

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <ProtectedLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/data-entry" element={<DataEntry />} />
          <Route path="/traceability" element={<Traceability />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/risk-analysis" element={<RiskAnalysis />} />
          <Route path="/security-logs" element={<SecurityLogs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ProtectedLayout>
    </Router>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

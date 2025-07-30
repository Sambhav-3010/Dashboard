import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardProvider, useDashboard } from './src/context/DashboardContext';
import Header from './src/Components/Header';
import Login from './src/Pages/Login';
import Dashboard from './src/Pages/Dashboard';

function AppContent() {
  const { state } = useDashboard();

  if (!state.isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <DashboardProvider>
      <AppContent />
    </DashboardProvider>
  );
}

export default App;
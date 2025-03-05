import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueueProvider } from './context/QueueContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PatientDashboard from './components/PatientDashboard';
import AdminPanel from './components/AdminPanel';
import LiveQueue from './components/LiveQueue';
import AnalyticsPage from './components/AnalyticsPage';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import InventoryManagement from './components/InventoryManagement';
import AIPredictions from './components/AIPredictions'; 
// Import the new component

function App() {
  return (
    <AuthProvider>
      <QueueProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Protected routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AdminPanel />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/patient-dashboard" 
                    element={
                      <ProtectedRoute>
                        <PatientDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/queue" 
                    element={
                      <ProtectedRoute>
                        <LiveQueue />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/analytics" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <AnalyticsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/inventory" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <InventoryManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/ai-predictions" 
                    element={
                      <ProtectedRoute requireAdmin={true}> {/* Protect for admins only */}
                        <AIPredictions />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Redirects */}
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </div>
            </main>
            <Footer />
          </div>
        </Router>
      </QueueProvider>
    </AuthProvider>
  );
}

export default App;
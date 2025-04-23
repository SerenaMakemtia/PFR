// src/App.jsx
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuth from './hooks/useAuth'

// Layouts
import AppLayout from './components/layout/AppLayout'
//import AuthLayout from './components/layout/AuthLayout'

// Pages d'authentification
import Login from './pages/auth/Login'
//import ForgotPassword from './pages/auth/ForgotPassword'
//import ResetPassword from './pages/auth/ResetPassword'

// Pages de l'application
import Dashboard from './pages/dashboard/Dashboard'
import PatientsListPage from './pages/patients/PatientsListPage'
//import PatientDetailsPage from './pages/patients/PatientDetailsPage'
import PatientFormPage from './pages/patients/PatientFormPage'

// Protéger les routes privées
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      {/* Routes d'authentification */}
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Navigate to="/login" />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>
      
      {/* Routes protégées de l'application */}
      <Route path="/" element={
        <PrivateRoute>
          <AppLayout />
        </PrivateRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="patients" element={<PatientsListPage />} />
        <Route path="patients/:id" element={<PatientDetailsPage />} />
        <Route path="patients/new" element={<PatientFormPage />} />
        <Route path="patients/:id/edit" element={<PatientFormPage />} />
        {/* Autres routes à ajouter selon les besoins */}
      </Route>
      
      {/* Route 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
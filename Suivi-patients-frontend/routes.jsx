// routes.jsx
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientsListPage from './pages/PatientsListPage';
import PatientDetailPage from './pages/PatientDetailPage';
import PatientFormPage from './pages/PatientFormPage';
import AppointmentsPage from './pages/AppointmentsPage';
import CalendarPage from './pages/CalendarPage';
import MedicalRecordPage from './pages/MedicalRecordPage';
import UserManagementPage from './pages/UserManagementPage';
import ProfilePage from './pages/ProfilePage';
import { useAuth } from './hooks/useAuth';

// Composant pour protéger les routes en fonction de l'authentification
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Vérification des rôles si nécessaire
  if (requiredRole && (!user.roles || !user.roles.includes(requiredRole))) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Routes pour les patients */}
        <Route path="patients">
          <Route index element={<PatientsListPage />} />
          <Route path="new" element={<PatientFormPage mode="create" />} />
          <Route path=":id" element={<PatientDetailPage />} />
          <Route path=":id/edit" element={<PatientFormPage mode="edit" />} />
        </Route>
        
        {/* Routes pour les rendez-vous */}
        <Route path="appointments">
          <Route index element={<AppointmentsPage />} />
          <Route path="calendar" element={<CalendarPage />} />
        </Route>
        
        {/* Routes pour les dossiers médicaux */}
        <Route path="medical-records">
          <Route path=":patientId" element={<MedicalRecordPage />} />
        </Route>
        
        {/* Routes pour la gestion des utilisateurs - seulement pour les admin */}
        <Route path="users" element={
          <ProtectedRoute requiredRole="admin">
            <UserManagementPage />
          </ProtectedRoute>
        } />
        
        {/* Route pour le profil utilisateur */}
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      
      {/* Redirection par défaut vers le tableau de bord */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes
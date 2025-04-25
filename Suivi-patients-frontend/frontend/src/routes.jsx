import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import PatientsListPage from './pages/patients/PatientsListPage';
import PatientDetailsPage from './pages/patients/PatientDetailsPage';
import PatientFormPage from './pages/patients/PatientFormPage';
import AppointmentsCalendarPage from './pages/appointments/AppointmentsCalendarPage';
import AppointmentFormPage from './pages/appointments/AppointmentFormPage';
import MedicalRecordsPage from './pages/medical-records/MedicalRecordsPage';
import UsersManagementPage from './pages/users/UsersManagementPage';
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';
import  useAuth  from './hooks/useAuth';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
        } />
        <Route path="/patients" element={
          isAuthenticated ? <PatientsListPage /> : <Navigate to="/login" />
        } />
        <Route path="/patients/:id" element={
          isAuthenticated ? <PatientDetailsPage /> : <Navigate to="/login" />
        } />
        <Route path="/patients/new" element={
          isAuthenticated ? <PatientFormPage /> : <Navigate to="/login" />
        } />
        <Route path="/patients/edit/:id" element={
          isAuthenticated ? <PatientFormPage /> : <Navigate to="/login" />
        } />
        <Route path="/appointments" element={
          isAuthenticated ? <AppointmentsCalendarPage /> : <Navigate to="/login" />
        } />
        <Route path="/appointments/new" element={
          isAuthenticated ? <AppointmentFormPage /> : <Navigate to="/login" />
        } />
        <Route path="/appointments/edit/:id" element={
          isAuthenticated ? <AppointmentFormPage /> : <Navigate to="/login" />
        } />
        <Route path="/medical-records" element={
          isAuthenticated ? <MedicalRecordsPage /> : <Navigate to="/login" />
        } />
        <Route path="/users" element={
          isAuthenticated ? <UsersManagementPage /> : <Navigate to="/login" />
        } />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
// contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      setLoading(false);
    } catch (error) {
      console.error('Authentication check failed:', error);
      setCurrentUser(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.login(username, password);
      setCurrentUser(user);
      setLoading(false);
      return user;
    } catch (error) {
      setError(error.message || 'Erreur lors de la connexion');
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await authService.forgotPassword(email);
      setLoading(false);
    } catch (error) {
      setError(error.message || 'Erreur lors de la demande de réinitialisation');
      setLoading(false);
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      await authService.resetPassword(token, newPassword);
      setLoading(false);
    } catch (error) {
      setError(error.message || 'Erreur lors de la réinitialisation du mot de passe');
      setLoading(false);
      throw error;
    }
  };
  const hasPermission = (requiredPermission) => {
    if (!currentUser || !currentUser.role) {
      return false;
    }
    
    const permissionsByRole = {
      admin: ['manage_users', 'manage_patients', 'manage_appointments', 'manage_medical_records', 'view_statistics'],
      doctor: ['view_patients', 'manage_appointments', 'manage_medical_records'],
      nurse: ['view_patients', 'view_appointments', 'view_medical_records', 'update_medical_records'],
      staff: ['view_patients', 'manage_appointments', 'view_medical_records']
    };
    
    const userPermissions = permissionsByRole[currentUser.role] || [];
    return userPermissions.includes(requiredPermission);
  };

  const checkRole = (roles) => {
    if (!currentUser || !currentUser.role) {
      return false;
    }
    
    if (Array.isArray(roles)) {
      return roles.includes(currentUser.role);
    }
    
    return currentUser.role === roles;
  };

  const authValues = {
    currentUser,
    loading,
    error,
    login,
    logout,
    forgotPassword,
    resetPassword,
    hasPermission,
    checkRole
  };

  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  );
};
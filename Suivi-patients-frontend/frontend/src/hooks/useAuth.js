// src/hooks/useAuth.js
import { useState, useEffect, useContext, createContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get('/api/user');
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Connexion
  const login = async (email, password) => {
    try {
      // CSRF protection pour Laravel Sanctum
      await api.get('/sanctum/csrf-cookie');
      
      // Tentative de connexion
      const response = await api.post('/api/login', { email, password });
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
      throw err;
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      await api.post('/api/logout');
      setUser(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de déconnexion');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export default function useAuth() {
  return useContext(AuthContext);
}
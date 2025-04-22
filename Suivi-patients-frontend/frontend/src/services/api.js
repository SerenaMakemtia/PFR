// src/services/api.js
import axios from 'axios';

// Création d'une instance axios avec la configuration par défaut
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true // Important pour que les cookies soient envoyés (Sanctum)
});

// Intercepteur pour gérer les erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Rediriger vers la page de connexion si 401 (non authentifié)
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    
    // Gestion des autres erreurs
    return Promise.reject(error);
  }
);

export default api;
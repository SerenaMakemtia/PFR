import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true // Important pour Laravel Sanctum
});

// Intercepteur de requête pour ajouter le token si disponible
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Gestion spécifique de l'erreur 401 (non autorisé)
    if (error.response && error.response.status === 401) {
      // Si une tentative de rafraîchissement du token a échoué, déconnexion
      if (error.config.url.includes('refresh')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      // Tentative de rafraîchissement du token
      try {
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        if (refreshResponse.data.token) {
          localStorage.setItem('token', refreshResponse.data.token);
          error.config.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
          return api(error.config);
        }
      } catch (refreshError) {
        // Si le rafraîchissement échoue, déconnexion
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    // Extraction des messages d'erreur de Laravel
    if (error.response && error.response.data) {
      if (error.response.data.message) {
        error.message = error.response.data.message;
      } else if (error.response.data.errors) {
        // Concaténer les messages d'erreur de validation
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(', ');
        error.message = errorMessages;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

// Fonction utilitaire pour gérer les requêtes paginées
export const fetchPaginatedData = async (endpoint, params = {}) => {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Une erreur est survenue lors de la récupération des données');
  }
};

// Fonction utilitaire pour télécharger des fichiers
export const downloadFile = async (endpoint, filename) => {
  try {
    const response = await api.get(endpoint, {
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    throw new Error(error.message || 'Une erreur est survenue lors du téléchargement du fichier');
  }
};

// Fonction utilitaire pour uploader des fichiers
export const uploadFile = async (endpoint, file, onProgress = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    
    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      };
    }
    
    const response = await api.post(endpoint, formData, config);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Une erreur est survenue lors de l\'upload du fichier');
  }
};
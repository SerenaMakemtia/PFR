import api from './api';

const BASE_URL = '/auth';

const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post(`${BASE_URL}/login`, credentials);
      if (response.data && response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  register: async (userData) => {
    try {
      const response = await api.post(`${BASE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post(`${BASE_URL}/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post(`${BASE_URL}/reset-password`, { token, newPassword });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  updateProfile: async (userId, userData) => {
    try {
      const response = await api.put(`${BASE_URL}/users/${userId}/profile`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (userId, passwordData) => {
    try {
      const response = await api.put(`${BASE_URL}/users/${userId}/password`, passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;
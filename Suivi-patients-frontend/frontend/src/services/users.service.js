import api from './api';

const BASE_URL = '/users';

const usersService = {
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post(BASE_URL, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUserRole: async (id, roleData) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}/role`, roleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserPermissions: async (id) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}/permissions`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUserPermissions: async (id, permissionsData) => {
    try {
      const response = await api.put(`${BASE_URL}/${id}/permissions`, permissionsData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default usersService;
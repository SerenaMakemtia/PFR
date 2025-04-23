// /services/patientService.js
import api from './api';

const BASE_URL = '/patients';

export const getAllPatients = async (params = {}) => {
  const response = await api.get(BASE_URL, { params });
  return response.data;
};

export const getPatientById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createPatient = async (patientData) => {
  const response = await api.post(BASE_URL, patientData);
  return response.data;
};

export const updatePatient = async (id, patientData) => {
  const response = await api.put(`${BASE_URL}/${id}`, patientData);
  return response.data;
};

export const deletePatient = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export const searchPatients = async (query) => {
  const response = await api.get(`${BASE_URL}/search`, { params: { query } });
  return response.data;
};
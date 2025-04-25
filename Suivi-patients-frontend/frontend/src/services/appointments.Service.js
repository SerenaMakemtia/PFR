import api from './api';

const BASE_URL = '/appointments';

export const getAllAppointments = async (params = {}) => {
  const response = await api.get(BASE_URL, { params });
  return response.data;
};

export const getAppointmentById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createAppointment = async (appointmentData) => {
  const response = await api.post(BASE_URL, appointmentData);
  return response.data;
};

export const updateAppointment = async (id, appointmentData) => {
  const response = await api.put(`${BASE_URL}/${id}`, appointmentData);
  return response.data;
};

export const deleteAppointment = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export const getAppointmentsByPatient = async (patientId) => {
  const response = await api.get(`${BASE_URL}/patient/${patientId}`);
  return response.data;
};

export const getAppointmentsByDoctor = async (doctorId) => {
  const response = await api.get(`${BASE_URL}/doctor/${doctorId}`);
  return response.data;
};

export const getAppointmentsByDateRange = async (startDate, endDate) => {
  const response = await api.get(`${BASE_URL}/range`, { 
    params: { 
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    } 
  });
  return response.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const response = await api.patch(`${BASE_URL}/${id}/status`, { status });
  return response.data;
};
const appointmentsService = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  getAppointmentsByDateRange,
  updateAppointmentStatus
};

export default appointmentsService;

import apiService from './apiService.js';

const API_BASE = '/api/v1/experiences';

export const getAllExperiences = async (params = {}) => {
  try {
    const response = await apiService.get(API_BASE, { params });
    // apiService returns response.data directly, which contains { success, message, data }
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching experiences:', error);
    throw error;
  }
};

export const getExperienceDetail = async (id) => {
  try {
    const response = await apiService.get(`${API_BASE}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching experience detail:', error);
    throw error;
  }
};

export const createExperience = async (data) => {
  try {
    const response = await apiService.post(API_BASE, data);
    return response.data;
  } catch (error) {
    console.error('Error creating experience:', error);
    throw error;
  }
};

export const updateExperience = async (id, data) => {
  try {
    const response = await apiService.put(`${API_BASE}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating experience:', error);
    throw error;
  }
};

export const deleteExperience = async (id) => {
  try {
    const response = await apiService.delete(`${API_BASE}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting experience:', error);
    throw error;
  }
};

export default {
  getAllExperiences,
  getExperienceDetail,
  createExperience,
  updateExperience,
  deleteExperience,
};

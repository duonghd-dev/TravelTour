/**
 * Experience Service
 * Xử lý tất cả API calls liên quan đến experiences
 */

import apiService from './apiService.js';

const API_BASE = '/api/v1/experiences';

/**
 * Lấy danh sách tất cả experiences
 * @param {Object} params - Query parameters (artisanId, status, etc.)
 * @returns {Promise} Response data
 */
export const getAllExperiences = async (params = {}) => {
  try {
    const response = await apiService.get(API_BASE, { params });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching experiences:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết một experience
 * @param {string} id - Experience ID
 * @returns {Promise} Experience detail
 */
export const getExperienceDetail = async (id) => {
  try {
    const response = await apiService.get(`${API_BASE}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching experience detail:', error);
    throw error;
  }
};

/**
 * Tạo experience mới (requires authentication)
 * @param {Object} data - Experience data
 * @returns {Promise} Created experience
 */
export const createExperience = async (data) => {
  try {
    const response = await apiService.post(API_BASE, data);
    return response.data;
  } catch (error) {
    console.error('Error creating experience:', error);
    throw error;
  }
};

/**
 * Cập nhật experience (requires authentication)
 * @param {string} id - Experience ID
 * @param {Object} data - Updated data
 * @returns {Promise} Updated experience
 */
export const updateExperience = async (id, data) => {
  try {
    const response = await apiService.put(`${API_BASE}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating experience:', error);
    throw error;
  }
};

/**
 * Xóa experience (requires authentication)
 * @param {string} id - Experience ID
 * @returns {Promise} Delete response
 */
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

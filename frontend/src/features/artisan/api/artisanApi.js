import axiosInstance from '@/services/axiosInstance';

const API_BASE = '/api/v1/artisans';

export const artisanApi = {
  getAllArtisans: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.craft) params.append('craft', filters.craft);
      if (filters.province) params.append('province', filters.province);
      if (filters.isVerified !== undefined)
        params.append('isVerified', filters.isVerified);

      const response = await axiosInstance.get(
        `${API_BASE}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getArtisanDetail: async (artisanId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/${artisanId}`);
      return response?.data?.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getArtisanStats: async (artisanId) => {
    try {
      const response = await axiosInstance.get(
        `${API_BASE}/${artisanId}/stats`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  searchArtisans: async (keyword, filters = {}) => {
    try {
      const params = new URLSearchParams({ keyword });
      if (filters.province) params.append('province', filters.province);

      const response = await axiosInstance.get(
        `${API_BASE}/search?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getMyProfile: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/me/profile`);
      return response?.data?.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createProfile: async (data) => {
    try {
      const response = await axiosInstance.post(API_BASE, data);
      return response?.data?.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await axiosInstance.put(API_BASE, data);
      return response?.data?.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

import axiosInstance from '@/services/axiosInstance';

const API_BASE = '/api/v1/artisans';

export const artisanApi = {
  /**
   * Lấy danh sách tất cả nghệ nhân
   */
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

  /**
   * Lấy chi tiết nghệ nhân theo ID
   */
  getArtisanDetail: async (artisanId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/${artisanId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy thống kê hoạt động
   */
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

  /**
   * Tìm kiếm nghệ nhân
   */
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

  /**
   * Lấy hồ sơ nghệ nhân của chính mình
   */
  getMyProfile: async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/me/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Tạo hồ sơ nghệ nhân
   */
  createProfile: async (data) => {
    try {
      const response = await axiosInstance.post(API_BASE, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Cập nhật hồ sơ nghệ nhân
   */
  updateProfile: async (data) => {
    try {
      const response = await axiosInstance.put(API_BASE, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

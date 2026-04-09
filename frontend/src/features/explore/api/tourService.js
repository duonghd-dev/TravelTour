import axiosInstance from '../../../services/axiosInstance.js';

const BASE_URL = '/api/v1/tours';

export const tourService = {
  getAllTours: async (filters = {}) => {
    try {
      const {
        search,
        region,
        location,
        minPrice,
        maxPrice,
        duration,
        page = 1,
        limit = 10,
      } = filters;

      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (region) params.append('region', region);
      if (location) params.append('location', location);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (duration) params.append('duration', duration);
      params.append('page', page);
      params.append('limit', limit);

      const response = await axiosInstance.get(
        `${BASE_URL}?${params.toString()}`
      );
      return response?.data?.data || [];
    } catch (error) {
      console.error('Error fetching tours:', error);
      return [];
    }
  },

  getTourDetail: async (id) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/${id}`);
      return response?.data?.data;
    } catch (error) {
      console.error('Error fetching tour detail:', error);
      return null;
    }
  },

  searchTours: async (query) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/search?q=${query}`);
      return response?.data?.data || [];
    } catch (error) {
      console.error('Error searching tours:', error);
      return [];
    }
  },

  getByRegion: async (region) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/region/${region}`);
      return response?.data?.data || [];
    } catch (error) {
      console.error('Error fetching tours by region:', error);
      return [];
    }
  },

  getByDuration: async (days) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/duration/${days}`);
      return response?.data?.data || [];
    } catch (error) {
      console.error('Error fetching tours by duration:', error);
      return [];
    }
  },

  createTour: async (data) => {
    try {
      const response = await axiosInstance.post(BASE_URL, data);
      return response?.data?.data;
    } catch (error) {
      console.error('Error creating tour:', error);
      throw error;
    }
  },

  updateTour: async (id, data) => {
    try {
      const response = await axiosInstance.patch(`${BASE_URL}/${id}`, data);
      return response?.data?.data;
    } catch (error) {
      console.error('Error updating tour:', error);
      throw error;
    }
  },

  deleteTour: async (id) => {
    try {
      await axiosInstance.delete(`${BASE_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting tour:', error);
      throw error;
    }
  },
};

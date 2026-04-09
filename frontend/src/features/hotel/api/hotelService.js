import axiosInstance from '../../../services/axiosInstance.js';

const BASE_URL = '/api/v1/hotels';

export const hotelService = {
  getAllHotels: async (filters = {}) => {
    try {
      const {
        search,
        category,
        location,
        minPrice,
        maxPrice,
        page = 1,
        limit = 10,
      } = filters;

      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (location) params.append('location', location);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      params.append('page', page);
      params.append('limit', limit);

      const response = await axiosInstance.get(
        `${BASE_URL}?${params.toString()}`
      );
      return response?.data?.data || [];
    } catch (error) {
      console.error('Error fetching hotels:', error);
      return [];
    }
  },

  getHotelDetail: async (id) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/${id}`);
      return response?.data?.data;
    } catch (error) {
      console.error('Error fetching hotel detail:', error);
      return null;
    }
  },

  searchHotels: async (query) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/search?q=${query}`);
      return response?.data?.data || [];
    } catch (error) {
      console.error('Error searching hotels:', error);
      return [];
    }
  },

  getByCategory: async (category) => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/category/${category}`
      );
      return response?.data?.data || [];
    } catch (error) {
      console.error('Error fetching hotels by category:', error);
      return [];
    }
  },

  createHotel: async (data) => {
    try {
      const response = await axiosInstance.post(BASE_URL, data);
      return response?.data?.data;
    } catch (error) {
      console.error('Error creating hotel:', error);
      throw error;
    }
  },

  updateHotel: async (id, data) => {
    try {
      const response = await axiosInstance.patch(`${BASE_URL}/${id}`, data);
      return response?.data?.data;
    } catch (error) {
      console.error('Error updating hotel:', error);
      throw error;
    }
  },

  deleteHotel: async (id) => {
    try {
      await axiosInstance.delete(`${BASE_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting hotel:', error);
      throw error;
    }
  },
};

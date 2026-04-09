import apiService from '../../../services/api/apiService.js';


const handleApiError = (error, fallbackMessage = 'API request failed') => {
  console.error('[Profile API Error]', {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
  });

  const errorMessage =
    error.response?.data?.message || error.message || fallbackMessage;

  return {
    message: errorMessage,
    status: error.response?.status || 500,
    error: error.response?.data || error,
  };
};

export const profileApi = {
  
  getProfile: async () => {
    try {
      return await apiService.get('/api/v1/users/profile');
    } catch (error) {
      const err = handleApiError(error, 'Failed to fetch profile');
      throw new Error(err.message);
    }
  },

  
  updateProfile: async (profileData) => {
    try {
      return await apiService.put('/api/v1/users/profile', profileData);
    } catch (error) {
      const err = handleApiError(error, 'Failed to update profile');
      throw new Error(err.message);
    }
  },

  
  getHeritageJourneys: async () => {
    try {
      return await apiService.get('/api/v1/users/heritage-journeys');
    } catch (error) {
      const err = handleApiError(error, 'Failed to fetch heritage journeys');
      throw new Error(err.message);
    }
  },

  
  getFavorites: async () => {
    try {
      return await apiService.get('/api/v1/users/favorites');
    } catch (error) {
      const err = handleApiError(error, 'Failed to fetch favorites');
      throw new Error(err.message);
    }
  },

  
  addFavorite: async (itemId, itemType) => {
    try {
      return await apiService.post('/api/v1/users/favorites', {
        itemId,
        itemType,
      });
    } catch (error) {
      const err = handleApiError(error, 'Failed to add to favorites');
      throw new Error(err.message);
    }
  },

  
  removeFavorite: async (favoriteId) => {
    try {
      return await apiService.delete(`/api/v1/users/favorites/${favoriteId}`);
    } catch (error) {
      const err = handleApiError(error, 'Failed to remove favorite');
      throw new Error(err.message);
    }
  },
};

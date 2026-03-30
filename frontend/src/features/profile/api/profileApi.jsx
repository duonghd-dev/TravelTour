import apiService from '../../../services/api/apiService.js';

// Helper function to handle API errors
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
  // Get user profile
  getProfile: async () => {
    try {
      return await apiService.get('/api/v1/users/profile');
    } catch (error) {
      const err = handleApiError(error, 'Failed to fetch profile');
      throw new Error(err.message);
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      return await apiService.put('/api/v1/users/profile', profileData);
    } catch (error) {
      const err = handleApiError(error, 'Failed to update profile');
      throw new Error(err.message);
    }
  },

  // Get user's heritage journeys
  getHeritageJourneys: async () => {
    try {
      return await apiService.get('/api/v1/users/heritage-journeys');
    } catch (error) {
      const err = handleApiError(error, 'Failed to fetch heritage journeys');
      throw new Error(err.message);
    }
  },

  // Get user's favorites
  getFavorites: async () => {
    try {
      return await apiService.get('/api/v1/users/favorites');
    } catch (error) {
      const err = handleApiError(error, 'Failed to fetch favorites');
      throw new Error(err.message);
    }
  },

  // Get activity log
  getActivityLog: async () => {
    try {
      return await apiService.get('/api/v1/users/activity-log');
    } catch (error) {
      const err = handleApiError(error, 'Failed to fetch activity log');
      throw new Error(err.message);
    }
  },

  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    try {
      return await apiService.put('/api/v1/users/password', {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      const err = handleApiError(error, 'Failed to update password');
      throw new Error(err.message);
    }
  },

  // Enable/Disable two-factor auth
  updateTwoFactorAuth: async (enabled) => {
    try {
      return await apiService.put('/api/v1/users/two-factor-auth', { enabled });
    } catch (error) {
      const err = handleApiError(error, 'Failed to update 2FA settings');
      throw new Error(err.message);
    }
  },

  // Remove from favorites
  removeFavorite: async (favoriteId) => {
    try {
      return await apiService.delete(`/api/v1/users/favorites/${favoriteId}`);
    } catch (error) {
      const err = handleApiError(error, 'Failed to remove favorite');
      throw new Error(err.message);
    }
  },
};

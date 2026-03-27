import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Get JWT token from localStorage
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Create axios instance with token in headers
 */
const getApiHeaders = () => {
  const token = getToken();
  return {
    authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

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
      const response = await axios.get(`${API_BASE_URL}/v1/users/profile`, {
        headers: getApiHeaders(),
      });
      return response.data;
    } catch (error) {
      const err = handleApiError(error, 'Failed to fetch profile');
      throw new Error(err.message);
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/v1/users/profile`,
        profileData,
        {
          headers: getApiHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      const err = handleApiError(error, 'Failed to update profile');
      throw new Error(err.message);
    }
  },

  // Get user's heritage journeys
  getHeritageJourneys: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/v1/users/heritage-journeys`,
        {
          headers: getApiHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      const err = handleApiError(error, 'Failed to fetch heritage journeys');
      throw new Error(err.message);
    }
  },

  // Get user's favorites
  getFavorites: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/v1/users/favorites`, {
        headers: getApiHeaders(),
      });
      return response.data;
    } catch (error) {
      const err = handleApiError(error, 'Failed to fetch favorites');
      throw new Error(err.message);
    }
  },

  // Get activity log
  getActivityLog: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/v1/users/activity-log`,
        {
          headers: getApiHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      const err = handleApiError(error, 'Failed to fetch activity log');
      throw new Error(err.message);
    }
  },

  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/v1/users/password`,
        { currentPassword, newPassword },
        {
          headers: getApiHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      const err = handleApiError(error, 'Failed to update password');
      throw new Error(err.message);
    }
  },

  // Enable/Disable two-factor auth
  updateTwoFactorAuth: async (enabled) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/v1/users/two-factor-auth`,
        { enabled },
        {
          headers: getApiHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      const err = handleApiError(error, 'Failed to update 2FA settings');
      throw new Error(err.message);
    }
  },

  // Remove from favorites
  removeFavorite: async (favoriteId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/v1/users/favorites/${favoriteId}`,
        {
          headers: getApiHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      const err = handleApiError(error, 'Failed to remove favorite');
      throw new Error(err.message);
    }
  },
};

/**
 * API Service Wrapper
 * Wrapper cho axios instance để handle errors chuẩn nhất
 *
 * Usage:
 *   apiService.get('/users')
 *   apiService.post('/register', data)
 *   apiService.put('/users/1', data)
 *   apiService.delete('/users/1')
 */

import axiosInstance from '../axiosInstance.js';

class ApiService {
  /**
   * GET request
   */
  async get(endpoint, config = {}) {
    try {
      const response = await axiosInstance.get(endpoint, config);
      return this._handleResponse(response);
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}, config = {}) {
    try {
      const response = await axiosInstance.post(endpoint, data, config);
      return this._handleResponse(response);
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}, config = {}) {
    try {
      const response = await axiosInstance.put(endpoint, data, config);
      return this._handleResponse(response);
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}, config = {}) {
    try {
      const response = await axiosInstance.patch(endpoint, data, config);
      return this._handleResponse(response);
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete(endpoint, config = {}) {
    try {
      const response = await axiosInstance.delete(endpoint, config);
      return this._handleResponse(response);
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Private: Handle successful response
   */
  _handleResponse(response) {
    // Return data directly if response has success flag
    if ('success' in response.data) {
      return response.data;
    }
    // Otherwise return response data
    return response.data;
  }

  /**
   * Private: Handle error response
   */
  _handleError(error) {
    const errorData = {
      message: 'An error occurred',
      status: null,
      code: null,
      details: null,
    };

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      errorData.status = status;

      // Try to extract message from different possible response formats
      if (typeof data === 'string') {
        // Plain text response (e.g., from rate limiter)
        errorData.message = data;
      } else if (data?.message) {
        // JSON response with message field
        errorData.message = data.message;
      } else if (data?.error) {
        // Alternative: error field
        errorData.message = data.error;
      } else {
        // Fallback to axios error message
        errorData.message = error.message;
      }

      errorData.code = data?.code || null;
      errorData.details = data?.errors || data?.details || null;

      // Log error for debugging
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error - Status:', status);
        console.error('API Error - Message:', errorData.message);
        console.error('API Error - Code:', errorData.code);
        console.error('API Error - Details:', errorData.details);
        console.error('API Error - Full Response:', data);
      }
    } else if (error.request) {
      // Request made but no response
      errorData.message =
        'No response from server. Please check your connection.';
    } else {
      // Error in request setup
      errorData.message = error.message;
    }

    return Promise.reject(errorData);
  }
}

export default new ApiService();

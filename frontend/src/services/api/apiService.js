

import axiosInstance from '../axiosInstance.js';

class ApiService {
  
  async get(endpoint, config = {}) {
    try {
      const response = await axiosInstance.get(endpoint, config);
      return this._handleResponse(response);
    } catch (error) {
      throw this._handleError(error);
    }
  }

  
  async post(endpoint, data = {}, config = {}) {
    try {
      const response = await axiosInstance.post(endpoint, data, config);
      return this._handleResponse(response);
    } catch (error) {
      throw this._handleError(error);
    }
  }

  
  async put(endpoint, data = {}, config = {}) {
    try {
      const response = await axiosInstance.put(endpoint, data, config);
      return this._handleResponse(response);
    } catch (error) {
      throw this._handleError(error);
    }
  }

  
  async patch(endpoint, data = {}, config = {}) {
    try {
      const response = await axiosInstance.patch(endpoint, data, config);
      return this._handleResponse(response);
    } catch (error) {
      throw this._handleError(error);
    }
  }

  
  async delete(endpoint, config = {}) {
    try {
      const response = await axiosInstance.delete(endpoint, config);
      return this._handleResponse(response);
    } catch (error) {
      throw this._handleError(error);
    }
  }

  
  _handleResponse(response) {
    
    if ('success' in response.data) {
      return response.data;
    }
    
    return response.data;
  }

  
  _handleError(error) {
    const errorData = {
      message: 'An error occurred',
      status: null,
      code: null,
      details: null,
    };

    if (error.response) {
      
      const { status, data } = error.response;

      errorData.status = status;

      
      if (typeof data === 'string') {
        
        errorData.message = data;
      } else if (data?.message) {
        
        errorData.message = data.message;
      } else if (data?.error) {
        
        errorData.message = data.error;
      } else {
        
        errorData.message = error.message;
      }

      errorData.code = data?.code || null;
      errorData.details = data?.errors || data?.details || null;

      
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error - Status:', status);
        console.error('API Error - Message:', errorData.message);
        console.error('API Error - Code:', errorData.code);
        console.error('API Error - Details:', errorData.details);
        console.error('API Error - Full Response:', data);
      }
    } else if (error.request) {
      
      errorData.message =
        'No response from server. Please check your connection.';
    } else {
      
      errorData.message = error.message;
    }

    return Promise.reject(errorData);
  }
}

export default new ApiService();

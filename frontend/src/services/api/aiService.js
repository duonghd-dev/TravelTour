

import axiosInstance from '../axiosInstance.js';

class AIService {
  
  async getAISuggestion(message) {
    try {
      const response = await axiosInstance.post('/api/v1/ai/suggest', {
        message,
      });

      if (response.data?.success) {
        return response.data.data.suggestion;
      }

      throw new Error(response.data?.message || 'Lỗi lấy tư vấn AI');
    } catch (error) {
      console.error('[AIService] Error:', error);
      throw error;
    }
  }

  
  async checkAIHealth() {
    try {
      const response = await axiosInstance.get('/api/v1/ai/health');
      return response.data?.success || false;
    } catch (error) {
      console.error('[AIService] Health check failed:', error);
      return false;
    }
  }
}


export default new AIService();

/**
 * AI Service
 * Handles Gemini AI suggestion API calls
 */

import axiosInstance from '../axiosInstance.js';

class AIService {
  /**
   * Lấy tư vấn từ AI dựa vào câu hỏi của user
   * @param {string} message - Câu hỏi hoặc yêu cầu từ user
   * @returns {Promise<Object>} - Phản hồi từ AI
   */
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

  /**
   * Kiểm tra trạng thái Groq API
   * @returns {Promise<boolean>} - True nếu API sẵn sàng
   */
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

// Singleton instance
export default new AIService();

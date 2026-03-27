import axiosInstance from '@/services/axiosInstance';

const API_BASE = '/v1/chat';
const USER_API_BASE = '/v1/users';

export const chatApi = {
  // Conversations
  getOrCreateConversation: async (otherUserId) => {
    try {
      const response = await axiosInstance.post(`${API_BASE}/conversations`, {
        otherUserId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserConversations: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/conversations`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markConversationAsRead: async (conversationId) => {
    try {
      const response = await axiosInstance.patch(
        `${API_BASE}/conversations/${conversationId}/read`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Messages
  sendMessage: async (conversationId, content, attachments = []) => {
    try {
      const response = await axiosInstance.post(`${API_BASE}/messages`, {
        conversationId,
        content,
        attachments,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMessages: async (conversationId, page = 1, limit = 20) => {
    try {
      const response = await axiosInstance.get(
        `${API_BASE}/conversations/${conversationId}/messages`,
        { params: { page, limit } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markAsRead: async (messageId) => {
    try {
      const response = await axiosInstance.patch(
        `${API_BASE}/messages/${messageId}/read`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteMessage: async (messageId) => {
    try {
      const response = await axiosInstance.delete(
        `${API_BASE}/messages/${messageId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchMessages: async (conversationId, keyword) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}/messages/search`, {
        params: { conversationId, keyword },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Users
  getAdminUser: async () => {
    try {
      // Endpoint để lấy admin/staff user cho customer support chat (không require admin role)
      const response = await axiosInstance.get(
        `${USER_API_BASE}/support/admin`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

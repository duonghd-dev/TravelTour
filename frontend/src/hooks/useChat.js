import { useState, useCallback, useRef, useEffect } from 'react';
import { useSocket } from '@/contexts';
import { chatApi } from '@/features/chat/api';

export const useChat = (conversationId, currentUser = null) => {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeoutRef = useRef(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  // Load messages
  const loadMessages = useCallback(
    async (page = 1) => {
      if (!conversationId) return;

      setLoading(true);
      try {
        const response = await chatApi.getMessages(conversationId, page);

        // Backend đã filter messages theo role, không cần filter ở frontend
        setMessages(response.data || []);
        setPagination(response.pagination);
      } catch (error) {
        console.error('[useChat] Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    },
    [conversationId]
  );

  // Load messages when conversation changes (API call, doesn't need socket)
  useEffect(() => {
    if (!conversationId) return;
    loadMessages();

    // Polling fallback: reload messages every 2 seconds if socket is not connected
    if (!isConnected) {
      const pollInterval = setInterval(() => {
        loadMessages(1);
      }, 2000);
      return () => {
        clearInterval(pollInterval);
      };
    }
  }, [conversationId, isConnected]);

  // Reload messages when socket reconnects (isConnected changes from false to true)
  const previousIsConnectedRef = useRef(false);

  useEffect(() => {
    // Only reload if reconnecting (isConnected was false, now true)
    if (isConnected && !previousIsConnectedRef.current && conversationId) {
      previousIsConnectedRef.current = true;
      // Small delay to ensure socket is fully reconnected
      const timer = setTimeout(() => {
        loadMessages(1);
      }, 100);
      return () => clearTimeout(timer);
    }

    if (!isConnected) {
      previousIsConnectedRef.current = false;
    }
  }, [isConnected, conversationId]);

  // Setup socket listeners and join conversation room
  useEffect(() => {
    if (!socket || !isConnected || !conversationId) {
      return;
    }

    // Setup message handlers first
    const handleMessageReceived = (message) => {
      // Validate message belongs to current conversation
      if (message.conversationId !== conversationId) {
        return;
      }

      // Prevent duplicate messages (message might already be added from API response)
      setMessages((prev) => {
        const messageExists = prev.some((msg) => msg._id === message._id);
        if (messageExists) {
          return prev;
        }
        return [...prev, message];
      });

      // Auto mark as read
      socket.emit('message:read', {
        conversationId,
        messageId: message._id,
      });
    };

    const handleTypingActive = ({
      conversationId: eventConvId,
      typingUsers: users,
    }) => {
      // Chỉ update typing nếu event từ conversation hiện tại
      if (eventConvId !== conversationId) {
        return;
      }

      if (!users || !Array.isArray(users)) {
        console.error('[useChat] typingUsers is not an array:', users);
        return;
      }
      // typingUsers là array của objects {userId, userName, role}
      // Giữ nguyên objects để filter ở MessageList
      setTypingUsers(users);
    };

    const handleTypingInactive = ({
      conversationId: eventConvId,
      typingUsers: users,
    }) => {
      // Chỉ update typing nếu event từ conversation hiện tại
      if (eventConvId !== conversationId) {
        return;
      }
      // typingUsers là array của objects {userId, userName, role}
      // Giữ nguyên objects để filter ở MessageList
      setTypingUsers(users);
    };

    const handleMessageRead = ({ messageId, userId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                readBy: [...(msg.readBy || []), { userId, readAt: new Date() }],
              }
            : msg
        )
      );
    };

    // Attach listeners first
    socket.on('message:received', handleMessageReceived);
    socket.on('typing:active', handleTypingActive);
    socket.on('typing:inactive', handleTypingInactive);
    socket.on('message:marked-read', handleMessageRead);

    // Then join room
    socket.emit('conversation:join', conversationId);

    return () => {
      socket.off('message:received', handleMessageReceived);
      socket.off('typing:active', handleTypingActive);
      socket.off('typing:inactive', handleTypingInactive);
      socket.off('message:marked-read', handleMessageRead);
      socket.emit('conversation:leave', conversationId);
    };
  }, [socket, isConnected, conversationId]);

  // Send message
  const sendMessage = useCallback(
    async (content, attachments = []) => {
      if (!conversationId || !content.trim()) return;

      setSending(true);
      try {
        const response = await chatApi.sendMessage(
          conversationId,
          content,
          attachments
        );

        // Message will be received via socket broadcast from backend
        // Add immediately to show to sender
        setMessages((prev) => [...prev, response.data]);
        return response.data;
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      } finally {
        setSending(false);
      }
    },
    [conversationId]
  );

  // Handle typing
  const handleTyping = useCallback(() => {
    if (!socket || !conversationId) {
      return;
    }

    socket.emit('typing:start', conversationId);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop', conversationId);
    }, 3000);
  }, [socket, conversationId]);

  // Mark conversation as read
  const markAsRead = useCallback(async () => {
    if (!conversationId) return;

    try {
      await chatApi.markConversationAsRead(conversationId);
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  }, [conversationId]);

  // Delete message
  const deleteMessage = useCallback(async (messageId) => {
    try {
      await chatApi.deleteMessage(messageId);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, content: '[Message deleted]', attachments: [] }
            : msg
        )
      );
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }, []);

  // Search messages
  const searchMessages = useCallback(
    async (keyword) => {
      if (!conversationId) return;

      try {
        const response = await chatApi.searchMessages(conversationId, keyword);
        return response.data;
      } catch (error) {
        console.error('Error searching messages:', error);
        return [];
      }
    },
    [conversationId]
  );

  return {
    messages,
    loading,
    sending,
    typingUsers,
    pagination,
    loadMessages,
    sendMessage,
    handleTyping,
    markAsRead,
    deleteMessage,
    searchMessages,
  };
};

import { useState, useCallback, useRef, useEffect } from 'react';
import { useSocket } from '@/contexts';
import { chatApi } from '@/features/chat/api';

export const useChat = (conversationId) => {
  const { socket, isConnected } = useSocket();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  const typingTimeoutRef = useRef(null);

  // =========================
  // LOAD MESSAGES
  // =========================
  const loadMessages = useCallback(
    async (page = 1) => {
      if (!conversationId) return;

      setLoading(true);
      try {
        const res = await chatApi.getMessages(conversationId, page);
        setMessages(res.data || []);
        setPagination(res.pagination);
      } catch (err) {
        console.error('[useChat] loadMessages:', err);
      } finally {
        setLoading(false);
      }
    },
    [conversationId]
  );

  // Load lần đầu
  useEffect(() => {
    if (conversationId) {
      loadMessages();
    }
  }, [conversationId, loadMessages]);

  // Polling khi mất socket
  useEffect(() => {
    if (!conversationId || isConnected) return;

    const interval = setInterval(() => {
      loadMessages(1);
    }, 3000);

    return () => clearInterval(interval);
  }, [conversationId, isConnected, loadMessages]);

  // =========================
  // SOCKET
  // =========================
  useEffect(() => {
    if (!socket || !isConnected || !conversationId) return;

    const addMessage = (message) => {
      if (message.conversationId !== conversationId) return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    const updateTyping = ({ conversationId: cid, typingUsers }) => {
      if (cid !== conversationId) return;
      if (!Array.isArray(typingUsers)) return;
      setTypingUsers(typingUsers);
    };

    const updateRead = ({ messageId, userId }) => {
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

    socket.on('message:received', addMessage);
    socket.on('typing:active', updateTyping);
    socket.on('typing:inactive', updateTyping);
    socket.on('message:marked-read', updateRead);

    socket.emit('conversation:join', conversationId);

    return () => {
      socket.off('message:received', addMessage);
      socket.off('typing:active', updateTyping);
      socket.off('typing:inactive', updateTyping);
      socket.off('message:marked-read', updateRead);
      socket.emit('conversation:leave', conversationId);
    };
  }, [socket, isConnected, conversationId]);

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = useCallback(
    async (content, attachments = []) => {
      if (!conversationId || !content.trim()) return;

      setSending(true);
      try {
        const res = await chatApi.sendMessage(
          conversationId,
          content,
          attachments
        );

        // Optimistic update
        setMessages((prev) => {
          if (prev.some((m) => m._id === res.data._id)) return prev;
          return [...prev, res.data];
        });

        return res.data;
      } catch (err) {
        console.error('[useChat] sendMessage:', err);
        throw err;
      } finally {
        setSending(false);
      }
    },
    [conversationId]
  );

  // =========================
  // TYPING
  // =========================
  const handleTyping = useCallback(() => {
    if (!socket || !conversationId) return;

    socket.emit('typing:start', conversationId);

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop', conversationId);
    }, 2000);
  }, [socket, conversationId]);

  useEffect(() => {
    return () => clearTimeout(typingTimeoutRef.current);
  }, []);

  // =========================
  // ACTIONS
  // =========================
  const markAsRead = useCallback(async () => {
    if (!conversationId) return;
    try {
      await chatApi.markConversationAsRead(conversationId);
    } catch (err) {
      console.error(err);
    }
  }, [conversationId]);

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
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  const searchMessages = useCallback(
    async (keyword) => {
      if (!conversationId) return [];

      try {
        const res = await chatApi.searchMessages(conversationId, keyword);
        return res.data;
      } catch (err) {
        console.error(err);
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

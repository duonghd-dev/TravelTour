import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks';
import { useChatContext } from '@/contexts';
import { chatApi } from '../api';
import ChatWindow from './ChatWindow';
import './ChatMessenger.scss';

/**
 * Chat Messenger component cho Admin
 * Chỉ render floating chat windows (button/dropdown đã ở AdminHeader)
 */
const ChatMessenger = () => {
  const { user } = useAuth();
  const { openConversations } = useChatContext();
  const [conversationMap, setConversationMap] = useState({});

  // Load conversations and build map
  const loadConversations = async () => {
    try {
      const response = await chatApi.getUserConversations();
      const convs = response.data || [];

      // Build map for floating windows
      const map = {};
      convs.forEach((conv) => {
        map[conv._id] = conv;
      });
      setConversationMap(map);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  // Load conversations on mount
  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'staff') {
      loadConversations();
    }
  }, [user]);

  // Auto-refresh conversations periodically
  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'staff') return;

    const interval = setInterval(() => {
      loadConversations();
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  if (!user || !['admin', 'staff'].includes(user.role)) {
    return null;
  }

  return (
    <div className="chat-windows-container">
      {openConversations.map((conversationId) => {
        const conversation = conversationMap[conversationId];
        if (!conversation) return null;

        return (
          <ChatWindow
            key={conversationId}
            conversationId={conversationId}
            conversation={conversation}
          />
        );
      })}
    </div>
  );
};

export default ChatMessenger;

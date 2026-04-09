import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks';
import { useChatContext } from '@/contexts';
import { chatApi } from '../api';
import ChatWindow from './ChatWindow';
import './ChatMessenger.scss';


const ChatMessenger = () => {
  const { user } = useAuth();
  const { openConversations } = useChatContext();
  const [conversationMap, setConversationMap] = useState({});

  
  const loadConversations = async () => {
    try {
      const response = await chatApi.getUserConversations();
      const convs = response.data || [];

      
      const map = {};
      convs.forEach((conv) => {
        map[conv._id] = conv;
      });
      setConversationMap(map);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  
  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'staff') {
      loadConversations();
    }
  }, [user]);

  
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

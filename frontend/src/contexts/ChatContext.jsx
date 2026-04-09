import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [openConversations, setOpenConversations] = useState(() => {
    
    try {
      const saved = localStorage.getItem('openConversations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  
  useEffect(() => {
    localStorage.setItem(
      'openConversations',
      JSON.stringify(openConversations)
    );
  }, [openConversations]);

  const openChat = useCallback((conversation) => {
    setOpenConversations((prev) => {
      
      if (prev.includes(conversation._id)) {
        return prev;
      }
      return [...prev, conversation._id];
    });
  }, []);

  const closeChat = useCallback((conversationId) => {
    setOpenConversations((prev) => prev.filter((id) => id !== conversationId));
  }, []);

  const toggleChat = useCallback((conversationId) => {
    setOpenConversations((prev) => {
      if (prev.includes(conversationId)) {
        return prev.filter((id) => id !== conversationId);
      }
      return [...prev, conversationId];
    });
  }, []);

  const updateConversations = useCallback((convs) => {
    setConversations(convs);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        openConversations,
        openChat,
        closeChat,
        toggleChat,
        updateConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};

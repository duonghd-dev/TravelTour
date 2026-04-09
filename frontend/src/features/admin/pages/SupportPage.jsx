import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/hooks/useAuth';
import { useChatContext } from '@/contexts';
import { chatApi } from '@/features/chat/api';
import { useChat } from '@/hooks/useChat';
import MessageList from '@/features/chat/components/MessageList';
import MessageInput from '@/features/chat/components/MessageInput';
import './SupportPage.scss';

const SupportPage = () => {
  const { user } = useAuth();

  const { conversations, openChat, updateConversations } = useChatContext();

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [activeTab, setActiveTab] = useState('recent');

  const {
    messages,
    loading: messagesLoading,
    sending,
    sendMessage,
    handleTyping,
  } = useChat(selectedConversation?._id, user);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoadingConvs(true);

      const response = await chatApi.getUserConversations();
      const convs = response.data || [];

      updateConversations(convs);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoadingConvs(false);
    }
  };

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
      openChat(conversations[0]._id);
    }
  }, [conversations, selectedConversation]);

  const filteredConversations = conversations
    .filter((conv) => {
      const otherUserName = `${conv.otherParticipant?.firstName || ''} ${
        conv.otherParticipant?.lastName || ''
      }`.toLowerCase();

      return otherUserName.includes(searchTerm.toLowerCase());
    })
    .filter((conv) => {
      if (activeTab === 'unread') return conv.unreadCount > 0;
      return true;
    });

  const hasUnreadConversations = conversations.some(
    (conv) => conv.unreadCount > 0
  );

  const handleMarkAllAsRead = async () => {
    try {
      const unreadConvs = conversations.filter((c) => c.unreadCount > 0);

      await Promise.all(
        unreadConvs.map((conv) => chatApi.markConversationAsRead(conv._id))
      );

      const updatedConvs = conversations.map((conv) => ({
        ...conv,
        unreadCount: 0,
      }));

      updateConversations(updatedConvs);
    } catch (error) {
      console.error('Error marking conversations as read:', error);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    openChat(conversation._id);

    if (conversation.unreadCount > 0) {
      try {
        chatApi.markConversationAsRead(conversation._id);

        const updatedConvs = conversations.map((conv) =>
          conv._id === conversation._id ? { ...conv, unreadCount: 0 } : conv
        );

        updateConversations(updatedConvs);
      } catch (error) {
        console.error('Error marking conversation as read:', error);
      }
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedConversation) return;
    await sendMessage(content);
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;

    return new Date(date).toLocaleDateString('vi-VN');
  };

  return (
    <div className="support-page">
      {}
      <div className="support-sidebar">
        <div className="sidebar-header">
          <h2>Messages</h2>

          {hasUnreadConversations && (
            <button className="mark-read-btn" onClick={handleMarkAllAsRead}>
              Mark as read
            </button>
          )}
        </div>

        {}
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm đoạn chat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
        </div>

        {}
        <div className="conversations-tabs">
          <button
            className={`tab ${activeTab === 'recent' ? 'active' : ''}`}
            onClick={() => setActiveTab('recent')}
          >
            Gần đây
          </button>

          <button
            className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Chưa đọc
          </button>
        </div>

        {}
        <div className="conversations-list">
          {loadingConvs ? (
            <div className="loading-state">Loading...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="empty-state">
              <p>No conversations</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv._id}
                className={`conversation-item ${
                  selectedConversation?._id === conv._id ? 'active' : ''
                }`}
                onClick={() => handleSelectConversation(conv)}
              >
                <div className="conversation-avatar">
                  {conv.otherParticipant?.firstName?.charAt(0).toUpperCase() ||
                    'U'}
                  {conv.otherParticipant?.lastName?.charAt(0).toUpperCase() ||
                    ''}
                </div>

                <div className="conversation-content">
                  <div className="conversation-header">
                    <div className="conversation-name">
                      {conv.otherParticipant?.firstName}{' '}
                      {conv.otherParticipant?.lastName}
                    </div>

                    <span className="conversation-time">
                      {getTimeAgo(conv.lastMessageAt)}
                    </span>
                  </div>

                  <div className="conversation-preview-wrapper">
                    <p className="conversation-preview">
                      {typeof conv.lastMessage?.content === 'string'
                        ? conv.lastMessage.content.substring(0, 50)
                        : 'No messages yet'}
                    </p>

                    {conv.unreadCount > 0 && (
                      <span className="unread-badge">{conv.unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {}
      <div className="support-chat">
        {selectedConversation ? (
          <>
            <div className="chat-header">
              <h3>
                {selectedConversation.otherParticipant?.firstName}{' '}
                {selectedConversation.otherParticipant?.lastName}
              </h3>
            </div>

            <MessageList
              messages={messages}
              currentUserId={user?.id}
              loading={messagesLoading}
              typingUsers={[]}
              onDeleteMessage={() => {}}
            />

            <MessageInput
              onSend={handleSendMessage}
              disabled={sending}
              onTyping={handleTyping}
              currentUser={user}
              conversationId={selectedConversation?._id}
            />
          </>
        ) : (
          <div className="no-conversation-selected">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportPage;

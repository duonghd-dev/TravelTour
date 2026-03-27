import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChatContext } from '@/contexts';
import { chatApi } from '@/features/chat/api';
import { useChat } from '@/hooks/useChat';
import MessageList from '@/features/chat/components/MessageList';
import MessageInput from '@/features/chat/components/MessageInput';
import './SupportPage.scss';

/**
 * Admin Support Page
 * Conversation management interface for admin/staff to support customers and artisans
 * 2-column layout: Conversations list (left) + Chat detail (right)
 */
const SupportPage = () => {
  const { user } = useAuth();
  const {
    conversations,
    openConversations,
    openChat,
    closeChat,
    updateConversations,
  } = useChatContext();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [activeTab, setActiveTab] = useState('recent'); // recent | unread

  // Get messages for selected conversation
  const {
    messages,
    loading: messagesLoading,
    sending,
    sendMessage,
    handleTyping,
  } = useChat(selectedConversation?._id, user);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
      openChat(conversations[0]._id);
    }
  }, [conversations]);

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

  const filteredConversations = conversations
    .filter((conv) => {
      const otherUserName = `${conv.otherParticipant?.firstName || ''} ${
        conv.otherParticipant?.lastName || ''
      }`.toLowerCase();
      return otherUserName.includes(searchTerm.toLowerCase());
    })
    .filter((conv) => {
      if (activeTab === 'unread') return conv.unreadCount > 0;
      return true; // recent tab shows all
    });

  const hasUnreadConversations = conversations.some(
    (conv) => conv.unreadCount > 0
  );

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all unread conversations as read
      const unreadConvs = conversations.filter((c) => c.unreadCount > 0);
      await Promise.all(
        unreadConvs.map((conv) => chatApi.markConversationAsRead(conv._id))
      );
      // Update conversations list - set all unreadCount to 0
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

    // Mark as read if conversation has unread messages
    if (conversation.unreadCount > 0) {
      try {
        chatApi.markConversationAsRead(conversation._id);
        // Update conversations list - set unreadCount to 0
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
      {/* Conversations Sidebar */}
      <div className="support-sidebar">
        <div className="sidebar-header">
          <h2>Messages</h2>
          {hasUnreadConversations && (
            <button className="mark-read-btn" onClick={handleMarkAllAsRead}>
              Mark as read
            </button>
          )}
        </div>

        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm đoạn chat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Tabs */}
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
            Đánh dấu đã đọc
          </button>
        </div>

        {/* Conversations List */}
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
                      {conv.lastMessage?.content?.substring(0, 50) ||
                        'No messages yet'}
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

      {/* Chat Area */}
      <div className="support-chat">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="header-left">
                <div className="avatar-small">
                  {selectedConversation.otherParticipant?.firstName
                    ?.charAt(0)
                    .toUpperCase() || 'U'}
                  {selectedConversation.otherParticipant?.lastName
                    ?.charAt(0)
                    .toUpperCase() || ''}
                </div>
                <div className="header-info">
                  <h3>
                    {selectedConversation.otherParticipant?.firstName}{' '}
                    {selectedConversation.otherParticipant?.lastName}
                  </h3>
                  <p className="header-role">
                    {selectedConversation.otherParticipant?.role === 'artisan'
                      ? 'ARTISAN'
                      : 'CUSTOMER'}
                  </p>
                </div>
              </div>
              <div className="header-actions">
                <button className="action-btn" title="Call">
                  ☎️
                </button>
                <button className="action-btn" title="More options">
                  ⋮
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <MessageList
              messages={messages}
              currentUserId={user?.id}
              loading={messagesLoading}
              typingUsers={[]}
              onDeleteMessage={() => {}}
            />

            {/* Input Area */}
            <MessageInput
              onSend={handleSendMessage}
              disabled={sending}
              onTyping={handleTyping}
              currentUser={user}
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

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks';
import { useChatContext } from '@/contexts';
import { chatApi } from '../api';
import { useChat } from '@/hooks/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ConversationList from './ConversationList';
import './ChatBox.scss';

const ChatBox = () => {
  const { user } = useAuth();

  const { updateConversations } = useChatContext();
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [activeView, setActiveView] = useState('conversations'); // 'conversations' | 'chat'
  const [adminUser, setAdminUser] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  // useChat hook for selected conversation
  const {
    messages,
    loading: messagesLoading,
    sending,
    typingUsers,
    sendMessage,
    handleTyping,
    deleteMessage,
    markAsRead,
  } = useChat(activeConversation?._id, user);

  // Load admin user for customer support chat
  const loadAdminUser = async () => {
    setLoadingAdmin(true);
    try {
      const response = await chatApi.getAdminUser();

      if (response.success && response.data) {
        setAdminUser(response.data);
      } else {
        console.error(
          '[ChatBox] Failed to load admin user:',
          response?.message
        );
      }
    } catch (error) {
      console.error('[ChatBox] Error loading admin user:', error);
    } finally {
      setLoadingAdmin(false);
    }
  };

  // Load conversations
  const loadConversations = async () => {
    setLoadingConvs(true);
    try {
      const response = await chatApi.getUserConversations();
      const convs = response.data || [];
      setConversations(convs);
      updateConversations(convs);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoadingConvs(false);
    }
  };

  // Auto-start chat with admin if user is customer
  const startAdminChat = async () => {
    if (!adminUser) {
      return;
    }

    try {
      const response = await chatApi.getOrCreateConversation(adminUser._id);

      if (response.success) {
        setActiveConversation(response.data);
        setActiveView('chat');
      }
    } catch (error) {
      console.error('[ChatBox] Error starting chat with admin:', error);
    }
  };

  // Load conversations on open
  useEffect(() => {
    if (isOpen) {
      // If customer or artisan, load admin and start chat
      if (['customer', 'artisan'].includes(user?.role)) {
        if (!adminUser) {
          loadAdminUser();
        }
      } else {
        // For non-customers/artisans, load conversations
        loadConversations();
      }
    }
  }, [isOpen]);

  // Auto-start admin chat when admin user is loaded (for customers/artisans)
  useEffect(() => {
    if (adminUser && ['customer', 'artisan'].includes(user?.role) && isOpen) {
      startAdminChat();
    }
  }, [adminUser]);

  // Switch to chat view when activeConversation is set
  useEffect(() => {
    if (activeConversation) {
      setActiveView('chat');
    }
  }, [activeConversation]);

  // Mark as read when viewing conversation
  useEffect(() => {
    if (activeConversation) {
      markAsRead();
    }
  }, [activeConversation, markAsRead]);

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
  };

  const handleSendMessage = async (content, attachments) => {
    try {
      await sendMessage(content, attachments);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleBackToConversations = () => {
    setActiveView('conversations');
    setActiveConversation(null);
  };

  const unreadCount = conversations.reduce(
    (sum, conv) => sum + (conv.unreadCount || 0),
    0
  );

  if (!user) return null;

  return (
    <div className="chatbox-widget">
      {/* Floating Button */}
      <button
        className={`chatbox-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Mở chat"
      >
        💬
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {/* Chatbox Window */}
      {isOpen && (
        <div className="chatbox-window">
          {['customer', 'artisan'].includes(user?.role) ? (
            // Customer/Artisan: Show chat with admin (auto-start)
            <>
              {!activeConversation || loadingAdmin ? (
                <div
                  className="chatbox-header"
                  style={{ textAlign: 'center', padding: '20px' }}
                >
                  <h3>Đang kết nối với hỗ trợ...</h3>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    Vui lòng chờ
                  </p>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="chatbox-header">
                    <h3>
                      {activeConversation?.otherParticipant?.firstName}{' '}
                      {activeConversation?.otherParticipant?.lastName}
                    </h3>
                    <button
                      className="close-btn"
                      onClick={() => setIsOpen(false)}
                      title="Đóng"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Messages */}
                  <MessageList
                    messages={messages}
                    typingUsers={typingUsers}
                    currentUserId={user?.id}
                    loading={messagesLoading}
                    onDeleteMessage={deleteMessage}
                  />

                  {/* Message Input */}
                  <MessageInput
                    onSend={handleSendMessage}
                    disabled={sending}
                    onTyping={handleTyping}
                    currentUser={user}
                    conversationId={activeConversation?._id}
                    adminUser={adminUser}
                  />
                </>
              )}
            </>
          ) : (
            // Non-customer: Show conversation list
            <>
              {activeView === 'conversations' ? (
                <>
                  <div className="chatbox-header">
                    <h3>Tin nhắn</h3>
                    <button
                      className="close-btn"
                      onClick={() => setIsOpen(false)}
                      title="Đóng"
                    >
                      ✕
                    </button>
                  </div>

                  <ConversationList
                    conversations={conversations}
                    loading={loadingConvs}
                    onSelectConversation={handleSelectConversation}
                    onRefresh={loadConversations}
                  />
                </>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="chatbox-header">
                    <button
                      className="back-btn"
                      onClick={handleBackToConversations}
                      title="Quay lại"
                    >
                      ← Quay lại
                    </button>
                    <h3>
                      {activeConversation?.otherParticipant?.firstName}{' '}
                      {activeConversation?.otherParticipant?.lastName}
                    </h3>
                    <button
                      className="close-btn"
                      onClick={() => setIsOpen(false)}
                      title="Đóng"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Messages */}
                  <MessageList
                    messages={messages}
                    typingUsers={typingUsers}
                    currentUserId={user?.id}
                    loading={messagesLoading}
                    onDeleteMessage={deleteMessage}
                  />

                  {/* Message Input */}
                  <MessageInput
                    onSend={handleSendMessage}
                    disabled={sending}
                    onTyping={handleTyping}
                    currentUser={user}
                    conversationId={activeConversation?._id}
                  />
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBox;

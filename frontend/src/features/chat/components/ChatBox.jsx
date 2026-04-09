import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComments,
  faTimes,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
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
  const [activeView, setActiveView] = useState('conversations');
  const [adminUser, setAdminUser] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

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

  useEffect(() => {
    if (isOpen) {
      if (['customer', 'artisan'].includes(user?.role)) {
        if (!adminUser) {
          loadAdminUser();
        }
      } else {
        loadConversations();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (adminUser && ['customer', 'artisan'].includes(user?.role) && isOpen) {
      startAdminChat();
    }
  }, [adminUser]);

  useEffect(() => {
    if (activeConversation) {
      setActiveView('chat');
    }
  }, [activeConversation]);

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
      {}
      <button
        className={`chatbox-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Mở chat"
      >
        <FontAwesomeIcon icon={faComments} />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {}
      {isOpen && (
        <div className="chatbox-window">
          {['customer', 'artisan'].includes(user?.role) ? (
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
                  {}
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
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>

                  {}
                  <MessageList
                    messages={messages}
                    typingUsers={typingUsers}
                    currentUserId={user?.id}
                    loading={messagesLoading}
                    onDeleteMessage={deleteMessage}
                  />

                  {}
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
                      <FontAwesomeIcon icon={faTimes} />
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
                  {}
                  <div className="chatbox-header">
                    <button
                      className="back-btn"
                      onClick={handleBackToConversations}
                      title="Quay lại"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
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
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>

                  {}
                  <MessageList
                    messages={messages}
                    typingUsers={typingUsers}
                    currentUserId={user?.id}
                    loading={messagesLoading}
                    onDeleteMessage={deleteMessage}
                  />

                  {}
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

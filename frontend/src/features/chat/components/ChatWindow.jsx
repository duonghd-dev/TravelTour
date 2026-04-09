import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/hooks';
import { useChatContext } from '@/contexts';
import { chatApi } from '../api';
import { useChat } from '@/hooks/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './ChatWindow.scss';

const ChatWindow = ({ conversationId, conversation }) => {
  const { user } = useAuth();
  const { closeChat } = useChatContext();
  const [isMinimized, setIsMinimized] = useState(false);

  const {
    messages,
    loading: messagesLoading,
    sending,
    typingUsers,
    sendMessage,
    handleTyping,
    deleteMessage,
  } = useChat(conversationId, user);

  useEffect(() => {
    if (conversationId && conversation?.unreadCount > 0) {
      chatApi
        .markConversationAsRead(conversationId)
        .catch((error) =>
          console.error('Error marking conversation as read:', error)
        );
    }
  }, [conversationId, conversation?.unreadCount]);

  const handleSendMessage = async (content, attachments) => {
    try {
      await sendMessage(content, attachments);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const otherParticipant = conversation?.otherParticipant;
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className={`chat-window ${isMinimized ? 'minimized' : ''}`}>
      {}
      <div className="chat-window__header">
        <div className="chat-window__header-left">
          <div className="chat-window__avatar">
            {getInitials(
              otherParticipant?.firstName,
              otherParticipant?.lastName
            )}
          </div>
          <div className="chat-window__header-info">
            <div className="chat-window__name">
              {otherParticipant?.firstName} {otherParticipant?.lastName}
            </div>
            <div className="chat-window__status">Đang hoạt động</div>
          </div>
        </div>
        <div className="chat-window__actions">
          <button
            className="chat-window__btn chat-window__btn--minimize"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Mở rộng' : 'Thu gọn'}
          >
            −
          </button>
          <button
            className="chat-window__btn chat-window__btn--close"
            onClick={() => closeChat(conversationId)}
            title="Đóng cuộc trò chuyện"
            aria-label="Close chat"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
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
          />
        </>
      )}
    </div>
  );
};

export default ChatWindow;

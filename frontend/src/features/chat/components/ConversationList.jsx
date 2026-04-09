import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglass } from '@fortawesome/free-solid-svg-icons';
import './ConversationList.scss';

const ConversationList = ({
  conversations,
  loading,
  onSelectConversation,
  onRefresh,
}) => {
  return (
    <div className="conversation-list">
      {loading && (
        <div className="list-loading">
          <div className="spinner">
            <FontAwesomeIcon icon={faHourglass} />
          </div>
          <p>Đang tải...</p>
        </div>
      )}

      {!loading && conversations.length === 0 && (
        <div className="list-empty">
          <p>Chưa có cuộc trò chuyện nào</p>
        </div>
      )}

      {conversations.map((conversation) => (
        <div
          key={conversation._id}
          className={`conversation-item ${conversation.unreadCount > 0 ? 'unread' : ''}`}
          onClick={() => onSelectConversation(conversation)}
        >
          <div className="conv-avatar">
            {conversation.otherParticipant?.avatar || (
              <span className="avatar-placeholder">
                {conversation.otherParticipant?.firstName.charAt(0)}
              </span>
            )}
          </div>

          <div className="conv-info">
            <div className="conv-name">
              {conversation.otherParticipant?.firstName}{' '}
              {conversation.otherParticipant?.lastName}
            </div>

            <div className="conv-last-message">
              {conversation.lastMessage?.isDeleted
                ? '[Tin nhắn đã xóa]'
                : conversation.lastMessage?.content ||
                  conversation.lastMessage?.attachments?.[0]?.name ||
                  '[Không có tin nhắn]'}
            </div>
          </div>

          {conversation.unreadCount > 0 && (
            <div className="unread-badge">{conversation.unreadCount}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConversationList;

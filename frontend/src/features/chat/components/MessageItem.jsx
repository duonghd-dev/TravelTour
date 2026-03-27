import React from 'react';
import { formatDate } from '@/utils';
import './MessageItem.scss';

const MessageItem = ({ message, isOwn, onDelete, currentUserId }) => {
  const handleDelete = () => {
    if (confirm('Xóa tin nhắn?')) {
      onDelete(message._id);
    }
  };

  return (
    <div className={`message-item ${isOwn ? 'own' : 'other'}`}>
      {!isOwn && message.sender && (
        <div className="message-avatar">
          {message.sender.avatar ? (
            <img src={message.sender.avatar} alt={message.sender.firstName} />
          ) : (
            <span className="avatar-placeholder">
              {message.sender.firstName.charAt(0)}
            </span>
          )}
        </div>
      )}

      <div className="message-content">
        {!isOwn && message.sender && (
          <div className="sender-info">
            {message.sender.firstName} {message.sender.lastName}
          </div>
        )}

        <div className="message-bubble">
          {message.content && (
            <p className="message-text">
              {message.content}
              {message.isEdited && (
                <span className="edited-label">(đã chỉnh sửa)</span>
              )}
            </p>
          )}

          {message.attachments && message.attachments.length > 0 && (
            <div className="message-attachments">
              {message.attachments.map((attachment, idx) => (
                <div key={idx} className="attachment">
                  {attachment.type === 'image' ? (
                    <img src={attachment.url} alt={attachment.name} />
                  ) : (
                    <a href={attachment.url} download={attachment.name}>
                      📎 {attachment.name}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="message-meta">
          <span className="message-time">
            {formatDate(new Date(message.createdAt), 'HH:mm')}
          </span>

          {isOwn && message.readBy && message.readBy.length > 1 && (
            <span className="read-indicator" title="Đã xem">
              ✓✓
            </span>
          )}

          {isOwn && (
            <button className="delete-btn" onClick={handleDelete} title="Xóa">
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;

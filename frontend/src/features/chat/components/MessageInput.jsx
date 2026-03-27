import React, { useState, useRef } from 'react';
import './MessageInput.scss';

const MessageInput = ({ onSend, disabled = false, onTyping, currentUser }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const getInitials = (firstName, lastName) => {
    const initials =
      `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    return initials || 'U'; // Fallback to 'U' if no initials
  };

  const handleSend = () => {
    if (!message.trim() && attachments.length === 0) return;

    onSend(message, attachments);
    setMessage('');
    setAttachments([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    // Trigger typing indicator
    if (onTyping) {
      onTyping();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachments((prev) => [
          ...prev,
          {
            url: event.target.result,
            type: file.type.startsWith('image') ? 'image' : 'file',
            name: file.name,
            size: file.size,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="message-input">
      {attachments.length > 0 && (
        <div className="attachments-preview">
          {attachments.map((attachment, idx) => (
            <div key={idx} className="attachment-item">
              {attachment.type === 'image' ? (
                <img src={attachment.url} alt={attachment.name} />
              ) : (
                <div className="file-preview">📎 {attachment.name}</div>
              )}
              <button
                className="remove-btn"
                onClick={() => removeAttachment(idx)}
                type="button"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="input-wrapper">
        <div className="input-avatar">
          {getInitials(currentUser?.firstName, currentUser?.lastName)}
        </div>

        <div className="input-group">
          <textarea
            className="message-textarea"
            placeholder="Nhập tin nhắn..."
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
          />
          <button className="emoji-btn" title="Emoji" disabled={disabled}>
            😊
          </button>
        </div>

        <button
          className="send-btn"
          onClick={handleSend}
          disabled={disabled || (!message.trim() && attachments.length === 0)}
          title="Gửi"
        >
          ➤
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
      />
    </div>
  );
};

export default MessageInput;

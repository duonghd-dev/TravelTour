import React from 'react';
import { useStartChat } from '../hooks/useStartChat';
import './MessageButton.scss';

/**
 * Component button để nhắn tin cho một user
 * @param {string} userId - ID của user muốn nhắn tin
 * @param {string} userName - Tên của user (dùng cho toast message)
 * @param {boolean} full - Nếu true, nút sẽ full width
 * @param {string} variant - Style variant (primary, secondary, outline)
 */
const MessageButton = ({
  userId,
  userName = 'User',
  full = false,
  variant = 'primary',
  children = '💬 Nhắn tin',
  className = '',
  ...props
}) => {
  const { startChat } = useStartChat();

  const handleClick = async () => {
    await startChat(userId, userName);
  };

  return (
    <button
      className={`message-btn message-btn--${variant} ${full ? 'message-btn--full' : ''} ${className}`}
      onClick={handleClick}
      title={`Nhắn tin cho ${userName}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default MessageButton;

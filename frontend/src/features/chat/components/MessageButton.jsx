import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { useStartChat } from '../hooks/useStartChat';
import './MessageButton.scss';

const MessageButton = ({
  userId,
  userName = 'User',
  full = false,
  variant = 'primary',
  children = (
    <>
      <FontAwesomeIcon icon={faComments} /> Nhắn tin
    </>
  ),
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

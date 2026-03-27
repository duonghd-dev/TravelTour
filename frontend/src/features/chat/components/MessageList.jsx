import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import './MessageList.scss';

const MessageList = ({
  messages,
  typingUsers,
  currentUserId,
  loading,
  onDeleteMessage,
}) => {
  const messageListRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);

  // Filter typingUsers to exclude current user
  const otherUsersTyping = typingUsers.filter(
    (typingUser) =>
      typingUser &&
      typingUser.userId &&
      typingUser.userId.toString() !== currentUserId?.toString()
  );

  const scrollToBottom = () => {
    if (!messageListRef.current) return;
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  };

  // Check if user is at bottom of list
  const isUserAtBottom = () => {
    if (!messageListRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
    return scrollHeight - scrollTop - clientHeight < 100; // 100px threshold
  };

  // Handle scroll event - disable auto-scroll if user scrolls up
  const handleScroll = () => {
    shouldAutoScrollRef.current = isUserAtBottom();
  };

  useEffect(() => {
    // Only auto-scroll if user is at bottom or when new message from current user
    const lastMessage = messages[messages.length - 1];
    const isLastMessageFromCurrentUser =
      lastMessage?.sender?._id?.toString() === currentUserId?.toString();

    if (shouldAutoScrollRef.current || isLastMessageFromCurrentUser) {
      setTimeout(scrollToBottom, 0);
    }
  }, [messages, otherUsersTyping, currentUserId]);

  return (
    <div className="message-list" ref={messageListRef} onScroll={handleScroll}>
      {loading && (
        <div className="message-list-loading">
          <div className="spinner">⏳</div>
          <p>Đang tải tin nhắn...</p>
        </div>
      )}

      {messages.length === 0 && !loading && (
        <div className="message-list-empty">
          <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
        </div>
      )}

      {messages.map((message) => {
        const senderId = message?.sender?._id?.toString();
        const userId = currentUserId?.toString();
        const isMessageOwn = senderId && userId ? senderId === userId : false;

        return (
          <MessageItem
            key={message._id}
            message={message}
            currentUserId={currentUserId}
            isOwn={isMessageOwn}
            onDelete={onDeleteMessage}
          />
        );
      })}

      {otherUsersTyping.length > 0 && (
        <div className="typing-indicator">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="typing-text">
            {otherUsersTyping.length === 1
              ? `${otherUsersTyping[0].userName} đang nhập tin nhắn`
              : `${otherUsersTyping.map((u) => u.userName).join(', ')} đang nhập tin nhắn`}
            ...
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageList;

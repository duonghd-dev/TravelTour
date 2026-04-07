import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useChatContext } from '@/contexts';
import { chatApi } from '@/features/chat/api';
import ChatMessenger from '@/features/chat/components/ChatMessenger';
import './AdminHeader.scss';
import {
  notificationIcon,
  messengerIcon,
  searchLogo,
} from '@assets/icons/svgs';

const AdminHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { conversations, openChat, closeChat, updateConversations } =
    useChatContext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const messageRef = useRef(null);

  // Load conversations from API
  const loadConversations = async () => {
    try {
      setLoadingConvs(true);
      const response = await chatApi.getUserConversations();
      const convs = response.data || [];
      updateConversations(convs);
    } catch (error) {
      console.error('Error loading conversations in AdminHeader:', error);
    } finally {
      setLoadingConvs(false);
    }
  };

  // Load conversations on mount
  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'staff') {
      loadConversations();
    }
  }, [user]);

  // Auto-refresh conversations periodically
  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'staff') return;

    const interval = setInterval(() => {
      loadConversations();
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  // Helper function để format thời gian
  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút`;
    if (diffHours < 24) return `${diffHours} giờ`;
    if (diffDays < 7) return `${diffDays} ngày`;

    return new Date(date).toLocaleDateString('vi-VN');
  };

  // Mock data
  const notifications = [
    { id: 1, message: 'New user registration', time: '5 minutes ago' },
    { id: 2, message: 'New booking received', time: '15 minutes ago' },
    { id: 3, message: 'Payment verified', time: '1 hour ago' },
    { id: 4, message: 'System update completed', time: '2 hours ago' },
    { id: 5, message: 'New report submitted', time: '3 hours ago' },
  ];

  // Tính unread message count từ conversations
  const messageCount = conversations.reduce(
    (sum, conv) => sum + (conv.unreadCount || 0),
    0
  );

  // Format messages từ conversations
  const messages = conversations.slice(0, 10).map((conv) => ({
    id: conv._id,
    conversationId: conv._id,
    sender:
      `${conv.otherParticipant?.firstName || ''} ${conv.otherParticipant?.lastName || ''}`.trim(),
    preview:
      typeof conv.lastMessage?.content === 'string'
        ? conv.lastMessage.content.substring(0, 50)
        : 'No messages yet',
    time: conv.lastMessageAt ? getTimeAgo(conv.lastMessageAt) : 'N/A',
    unreadCount: conv.unreadCount || 0,
  }));

  const notificationCount = 5; // Mock notification count

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setIsMessageOpen(false);
      }
    };

    if (isProfileOpen || isNotificationOpen || isMessageOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen, isNotificationOpen, isMessageOpen]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  // Get user display name
  const displayName = user
    ? `${user.firstName ? user.firstName + ' ' : ''}${user.lastName || ''}`.trim() ||
      user.email
    : null;

  // Get user role display
  const userRole = user?.role || 'User';
  const roleDisplay = userRole.charAt(0).toUpperCase() + userRole.slice(1);

  const initials = displayName
    ? displayName
        .split(' ')
        .map((n) => n.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Handle search logic here
    }
  };

  return (
    <>
      <header className="admin-header">
        <div className="admin-header__container">
          {/* Search Bar */}
          <div className="admin-header__search-wrapper">
            <form className="admin-header__search" onSubmit={handleSearch}>
              <input
                type="text"
                className="admin-header__search-input"
                placeholder="Search users, artisans, bookings..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button
                type="submit"
                className="admin-header__search-btn"
                aria-label="Search"
              >
                <img src={searchLogo} alt="Search" />
              </button>
            </form>
          </div>

          {/* Auth Section */}
          <div className="admin-header__auth">
            {/* Notification Button */}
            <div className="admin-header__notification" ref={notificationRef}>
              <button
                className="admin-header__notification-btn"
                title="Notifications"
                aria-label="Notifications"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <img src={notificationIcon} alt="Notifications" />
                {notificationCount > 0 && (
                  <span className="admin-header__badge">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="admin-header__notification-menu">
                  <div className="admin-header__dropdown-header">
                    <h3>Notifications</h3>
                    <button
                      className="admin-header__clear-btn"
                      onClick={() => {}}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="admin-header__dropdown-content">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="admin-header__notification-item"
                      >
                        <p className="admin-header__notification-message">
                          {notif.message}
                        </p>
                        <span className="admin-header__notification-time">
                          {notif.time}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="admin-header__dropdown-footer">
                    <Link
                      to="/admin/notifications"
                      className="admin-header__view-all"
                    >
                      View All Notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Message Button */}
            <div className="admin-header__message" ref={messageRef}>
              <button
                className="admin-header__message-btn"
                title="Messages"
                aria-label="Messages"
                onClick={() => setIsMessageOpen(!isMessageOpen)}
              >
                <img src={messengerIcon} alt="Messages" />
                {messageCount > 0 && (
                  <span className="admin-header__badge">{messageCount}</span>
                )}
              </button>

              {/* Message Dropdown */}
              {isMessageOpen && (
                <div className="admin-header__message-menu">
                  <div className="admin-header__dropdown-header">
                    <h3>Messages</h3>
                    <button
                      className="admin-header__clear-btn"
                      onClick={async () => {
                        try {
                          // Mark all unread conversations as read
                          const unreadConvs = conversations.filter(
                            (c) => c.unreadCount > 0
                          );
                          await Promise.all(
                            unreadConvs.map((conv) =>
                              chatApi.markConversationAsRead(conv._id)
                            )
                          );
                          // Update conversations list - set all unreadCount to 0
                          const updatedConvs = conversations.map((conv) => ({
                            ...conv,
                            unreadCount: 0,
                          }));
                          updateConversations(updatedConvs);
                        } catch (error) {
                          console.error(
                            'Error marking conversations as read:',
                            error
                          );
                        }
                      }}
                    >
                      Mark as read
                    </button>
                  </div>

                  {/* Message Search */}
                  <div className="admin-header__message-search">
                    <input
                      type="text"
                      placeholder="Tìm kiếm đoạn chat..."
                      className="admin-header__message-search-input"
                    />
                  </div>

                  <div className="admin-header__message-tabs">
                    <button className="admin-header__message-tab admin-header__message-tab--active">
                      Gần đây
                    </button>
                    <button className="admin-header__message-tab">
                      Đánh dấu đã đọc
                    </button>
                  </div>

                  <div className="admin-header__dropdown-content">
                    {loadingConvs ? (
                      <div className="admin-header__message-loading">
                        Đang tải...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="admin-header__message-empty">
                        Chưa có tin nhắn nào
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className="admin-header__message-item"
                          onClick={async () => {
                            const conversation = conversations.find(
                              (c) => c._id === msg.conversationId
                            );
                            if (conversation && conversation.unreadCount > 0) {
                              try {
                                // Mark conversation as read
                                await chatApi.markConversationAsRead(
                                  conversation._id
                                );
                                // Update conversations list with unreadCount = 0
                                const updatedConvs = conversations.map(
                                  (conv) =>
                                    conv._id === conversation._id
                                      ? { ...conv, unreadCount: 0 }
                                      : conv
                                );
                                updateConversations(updatedConvs);
                              } catch (error) {
                                console.error(
                                  'Error marking conversation as read:',
                                  error
                                );
                              }
                            }
                            openChat(conversation);
                            setIsMessageOpen(false);
                          }}
                        >
                          <div className="admin-header__message-avatar">
                            {msg.sender
                              ?.split(' ')
                              .map((n) => n.charAt(0))
                              .join('')
                              .toUpperCase()
                              .slice(0, 2) || 'U'}
                          </div>
                          <div className="admin-header__message-body">
                            <div className="admin-header__message-header">
                              <div className="admin-header__message-sender">
                                {msg.sender || 'Unknown'}
                              </div>
                              <span className="admin-header__message-time">
                                {msg.time} trước
                              </span>
                            </div>
                            <p className="admin-header__message-preview">
                              {msg.preview}
                            </p>
                            {msg.unreadCount > 0 && (
                              <span className="admin-header__message-badge">
                                {msg.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="admin-header__dropdown-footer">
                    <Link
                      to="/admin/messages"
                      className="admin-header__view-all"
                    >
                      Xem tất cả tin nhắn
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <div className="admin-header__profile" ref={profileRef}>
                <button
                  className="admin-header__profile-btn"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  title={displayName}
                >
                  <span className="admin-header__profile-avatar">
                    {initials}
                  </span>

                  <div className="admin-header__profile-info">
                    <span className="admin-header__user-name">
                      {displayName}
                    </span>
                    <span className="admin-header__user-role">
                      {roleDisplay}
                    </span>
                  </div>
                  <span
                    className={`admin-header__dropdown-arrow ${
                      isProfileOpen ? 'open' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="admin-header__profile-menu">
                    <div className="admin-header__profile-header">
                      <span className="admin-header__menu-user-info">
                        <strong>{displayName}</strong>
                        <small>{roleDisplay}</small>
                      </span>
                    </div>
                    <div className="admin-header__profile-divider"></div>
                    <Link to="/" className="admin-header__profile-link">
                      Van Hoa Trinh
                    </Link>
                    <Link to="/profile" className="admin-header__profile-link">
                      My Profile
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="admin-header__profile-link"
                    >
                      Admin Settings
                    </Link>
                    <div className="admin-header__profile-divider"></div>
                    <button
                      className="admin-header__profile-link admin-header__profile-logout"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="admin-header__auth-links">
                <Link to="/login" className="admin-header__login-btn">
                  Sign In
                </Link>
                <Link to="/register" className="admin-header__register-btn">
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Chat Messenger with floating windows */}
      {user && (user.role === 'admin' || user.role === 'staff') && (
        <ChatMessenger />
      )}
    </>
  );
};

export default AdminHeader;

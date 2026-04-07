import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/images/Logo.png';
import maleAvatarImg from '@/assets/images/avatarDefault/maleAvatar.png';
import femaleAvatarImg from '@/assets/images/avatarDefault/femaleAvatar.png';
import { HEADER_NAV_LINKS } from './constant';
import './Header.scss';
import menuIcon from '@/assets/icons/svgs/menu.svg';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Ref for profile dropdown
  const profileRef = useRef(null);

  // Handle click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  // Check if current path matches link path
  const isActiveLink = (linkPath) => {
    if (linkPath === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(linkPath);
  };

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

  // Get user gender display

  const getAvatarUrl = (avatar, gender) => {
    // If avatar is a data URL (base64), use it directly
    if (avatar && avatar.startsWith('data:')) {
      return avatar;
    }
    // If avatar is a path string (e.g., 'assets/images/avatarDefault/maleAvatar.png')
    if (avatar && typeof avatar === 'string') {
      return `/${avatar}`;
    }
    // If avatar is null or empty, use default by gender
    if (gender === 'male') return maleAvatarImg;
    if (gender === 'female') return femaleAvatarImg;
    return maleAvatarImg; // Default to male avatar
  };

  const initials = displayName
    ? displayName
        .split(' ')
        .map((n) => n.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo and Brand */}
        <Link to="/" className="header__brand">
          <div className="header__logo">
            <img
              src={logo}
              alt="Van Hoá Trinh Logo"
              className="header__logo-img"
            />
          </div>
          <h1 className="header__title">Van Hoá Trinh</h1>
        </Link>

        {/* Navigation Menu */}
        <nav className={`header__nav ${isMenuOpen ? 'open' : ''}`}>
          {HEADER_NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`header__nav-link ${isActiveLink(link.path) ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger + Auth Wrapper */}
        <div className="header__mobile-wrapper">
          {/* Menu Icon Button */}
          <button
            className="header__menu-icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <img src={menuIcon} alt="Menu" className="header__menu-icon-img" />
          </button>

          {/* Auth Section */}
          <div className="header__auth">
            {user ? (
              <div className="header__profile" ref={profileRef}>
                <button
                  className="header__profile-btn"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  title={displayName}
                >
                  <div className="header__profile-info">
                    <span className="header__user-name">{displayName}</span>
                    <span className="header__user-role">{roleDisplay}</span>
                  </div>
                  <div className="header__profile-avatar">
                    <img
                      src={getAvatarUrl(user.avatar, user.gender)}
                      alt={displayName}
                      className="header__avatar-img"
                      onError={(e) => {
                        e.target.src = maleAvatarImg;
                      }}
                    />
                  </div>
                  <span
                    className={`header__dropdown-arrow ${isProfileOpen ? 'open' : ''}`}
                  >
                    ▼
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="header__profile-menu">
                    <div className="header__profile-header">
                      <span className="header__menu-user-info">
                        <strong>{displayName}</strong>
                        <small>{roleDisplay}</small>
                      </span>
                    </div>
                    <div className="header__profile-divider"></div>

                    {user.role === 'admin' && (
                      <Link to="/admin" className="header__profile-link">
                        Admin Dashboard
                      </Link>
                    )}
                    <Link to="/profile" className="header__profile-link">
                      My Profile
                    </Link>
                    <Link to="/bookings" className="header__profile-link">
                      My Bookings
                    </Link>
                    <Link to="/settings" className="header__profile-link">
                      Settings
                    </Link>
                    <div className="header__profile-divider"></div>
                    <button
                      className="header__profile-link header__profile-logout"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="header__auth-links">
                <Link to="/login" className="header__login-btn">
                  Sign In
                </Link>
                <Link to="/register" className="header__register-btn">
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="header__overlay"
          onClick={() => setIsMenuOpen(false)}
          role="presentation"
        />
      )}
    </header>
  );
};

export default Header;

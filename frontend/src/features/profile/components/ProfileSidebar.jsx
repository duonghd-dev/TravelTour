import { useState } from 'react';
import { Link } from 'react-router-dom';
import maleAvatarImg from '@/assets/images/avatarDefault/maleAvatar.png';
import femaleAvatarImg from '@/assets/images/avatarDefault/femaleAvatar.png';
import styles from './ProfileSidebar.module.scss';

const getAvatarUrl = (avatar, gender) => {
  // If avatar is a data URL (base64), use it directly
  if (avatar && avatar.startsWith('data:')) {
    return avatar;
  }
  // If avatar is a valid string path, use it with / prefix
  if (avatar && typeof avatar === 'string' && avatar.length > 0) {
    return `/${avatar}`;
  }
  // If avatar is null or empty, use default by gender
  if (gender === 'male') return maleAvatarImg;
  if (gender === 'female') return femaleAvatarImg;
  return maleAvatarImg; // Default to male avatar
};

// Fallback avatar based on gender
const getDefaultAvatarByGender = (gender) => {
  if (gender === 'male') return maleAvatarImg;
  if (gender === 'female') return femaleAvatarImg;
  return maleAvatarImg;
};

const ProfileSidebar = ({ user, activeSection, onSectionChange }) => {
  const [avatarError, setAvatarError] = useState(false);

  // Handle image load error - fallback to default avatar
  const handleAvatarError = () => {
    setAvatarError(true);
  };

  // Get avatar source
  const avatarSrc = avatarError
    ? getDefaultAvatarByGender(user?.gender)
    : getAvatarUrl(user?.avatar, user?.gender);

  return (
    <div className={styles.sidebar}>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.avatarContainer}>
          <img
            src={avatarSrc}
            alt={user?.firstName}
            className={styles.avatar}
            onError={handleAvatarError}
          />
          <div className={styles.badge}>✓</div>
        </div>
        <h2 className={styles.name}>
          {user?.firstName} {user?.lastName}
        </h2>
        <p className={styles.subtitle}>
          {user?.gender ? `${user.gender.toUpperCase()} • ` : ''}
          {user?.title || 'CULTURAL_EXPLORER'} • MEMBER SINCE{' '}
          {new Date(user?.createdAt).getFullYear()}
        </p>
        <div className={styles.statusBadges}>
          <span className={`${styles.badge} ${styles.verified}`}>VERIFIED</span>
          <span className={`${styles.badge} ${styles.active}`}>
            STATUS: ACTIVE
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className={styles.menu}>
        <button
          className={`${styles.menuItem} ${activeSection === 'personal' ? styles.active : ''}`}
          onClick={() => onSectionChange('personal')}
        >
          <span className={styles.icon}>👤</span>
          Personal Information
        </button>
        <button
          className={`${styles.menuItem} ${activeSection === 'journeys' ? styles.active : ''}`}
          onClick={() => onSectionChange('journeys')}
        >
          <span className={styles.icon}>✈️</span>
          My Heritage Journeys
        </button>
        <button
          className={`${styles.menuItem} ${activeSection === 'favorites' ? styles.active : ''}`}
          onClick={() => onSectionChange('favorites')}
        >
          <span className={styles.icon}>❤️</span>
          My Favorites
        </button>
        <button
          className={`${styles.menuItem} ${activeSection === 'security' ? styles.active : ''}`}
          onClick={() => onSectionChange('security')}
        >
          <span className={styles.icon}>🔒</span>
          Security Settings
        </button>
      </nav>

      {/* Activity Log */}
      <div className={styles.activityLog}>
        <h3 className={styles.activityTitle}>Activity Log</h3>
        <div className={styles.logItems}>
          {user?.activityLog?.slice(0, 3).map((activity, idx) => (
            <div key={idx} className={styles.logItem}>
              <span className={styles.logDot}></span>
              <div className={styles.logContent}>
                <p className={styles.logText}>{activity.action}</p>
                <p className={styles.logTime}>
                  {new Date(activity.timestamp).toLocaleDateString()} •{' '}
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button className={styles.viewAllLink}>VIEW FULL AUDIT TRAIL</button>
      </div>
    </div>
  );
};

export default ProfileSidebar;

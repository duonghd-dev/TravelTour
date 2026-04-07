import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts';
import { profileApi } from '../api/profileApi';
import ProfileSidebar from '../components/ProfileSidebar';
import PersonalInformationSection from '../components/PersonalInformationSection';
import MyHeritageJourneysSection from '../components/MyHeritageJourneysSection';
import MyBookingsSection from '../components/MyBookingsSection';
import SecuritySettingsSection from '../components/SecuritySettingsSection';
import MyFavoritesSection from '../components/MyFavoritesSection';
import styles from './ProfilePage.module.scss';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [profileData, setProfileData] = useState(null);
  const [activeSection, setActiveSection] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadProfileData();
  }, [isAuthenticated, navigate]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Nếu đã có user từ context, dùng nó trước
      if (user) {
        setProfileData(user);
        setLoading(false);
        return;
      }

      // Nếu không, fetch từ backend
      const data = await profileApi.getProfile();
      const userData = data.data || user;

      if (userData) {
        setProfileData(userData);
      } else {
        setError('Không thể tải dữ liệu profile');
        toast.error('Không thể tải dữ liệu profile');
      }
    } catch (err) {
      const errorMessage = err.message || 'Lỗi khi tải profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading your profile...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className={styles.errorContainer}>
        <h2>Unable to Load Profile</h2>
        <p>We couldn't load your profile data. Please try again.</p>
        <button onClick={() => loadProfileData()}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <ProfileSidebar
            user={profileData}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {activeSection === 'personal' && (
            <PersonalInformationSection user={profileData} />
          )}
          {activeSection === 'journeys' && <MyHeritageJourneysSection />}
          {activeSection === 'bookings' && <MyBookingsSection />}
          {activeSection === 'security' && (
            <SecuritySettingsSection
              user={profileData}
              onProfileUpdate={loadProfileData}
            />
          )}
          {activeSection === 'favorites' && <MyFavoritesSection />}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;

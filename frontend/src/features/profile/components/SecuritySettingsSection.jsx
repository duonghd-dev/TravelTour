import { useState, useEffect } from 'react';
import { profileApi } from '../api/profileApi';
import { useToast } from '@/contexts';
import styles from './SecuritySettingsSection.module.scss';


const SecuritySettingsSection = ({ user, onProfileUpdate }) => {
  const toast = useToast();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    user?.twoFactorEnabled || false
  );
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    setTwoFactorEnabled(user?.twoFactorEnabled || false);
  }, [user?.twoFactorEnabled]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('Mật khẩu không khớp');
      return;
    }

    setLoading(true);
    try {
      const result = await profileApi.updatePassword(
        passwords.current,
        passwords.new
      );
      toast.success(result.message || 'Cập nhật mật khẩu thành công!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      const errorMessage = error.message || 'Cập nhật mật khẩu thất bại';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    
    if (loading) return;

    const newState = !twoFactorEnabled;

    
    setTwoFactorEnabled(newState);
    setLoading(true);

    try {
      const result = await profileApi.updateTwoFactorAuth(newState);

      toast.success(
        result.message ||
          `Xác thực 2 lớp ${newState ? 'đã bật' : 'đã tắt'} thành công!`
      );

      
      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (error) {
      
      setTwoFactorEnabled(!newState);

      const errorMessage =
        typeof error === 'string'
          ? error
          : error?.message || 'Cập nhật 2FA thất bại';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Security Settings</h2>
      <p className={styles.sectionSubtitle}>Protect your account and privacy</p>

      {}
      <div className={styles.subsectionDivider}>
        <h3 className={styles.subsectionTitle}>Change Password</h3>

        <form onSubmit={handleUpdatePassword} className={styles.form}>
          <div className={styles.passwordContainer}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Current Password</label>
              <input
                type="password"
                name="current"
                value={passwords.current}
                onChange={handlePasswordChange}
                className={styles.input}
                placeholder="Enter your current password"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>New Password</label>
              <input
                type="password"
                name="new"
                value={passwords.new}
                onChange={handlePasswordChange}
                className={styles.input}
                placeholder="Enter new password"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirm"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              className={styles.input}
              placeholder="Confirm new password"
              required
            />
            {passwords.new &&
              passwords.confirm &&
              passwords.new !== passwords.confirm && (
                <p className={styles.errorText}>Passwords do not match</p>
              )}
          </div>

          <div className={styles.actionButtons}>
            <button
              type="submit"
              disabled={
                loading ||
                (passwords.new &&
                  passwords.confirm &&
                  passwords.new !== passwords.confirm)
              }
              className={styles.submitButton}
            >
              {loading && <span className={styles.loadingSpinner}></span>}
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {}
      <div className={styles.subsectionDivider}>
        <h3 className={styles.subsectionTitle}>Two-Factor Authentication</h3>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
          {twoFactorEnabled
            ? 'Two-factor authentication is currently enabled. Your account is protected.'
            : 'Add an extra layer of security to your account with two-factor authentication.'}
        </p>

        <div className={styles.twoFactorContainer}>
          <div className={styles.twoFactorInfo}>
            <h4 className={styles.twoFactorTitle}>
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </h4>
            <p className={styles.twoFactorDesc}>
              {twoFactorEnabled
                ? 'You will be asked for a verification code when logging in.'
                : 'Enable to require a verification code when logging in.'}
            </p>
          </div>
          <div className={styles.twoFactorButtonWrapper}>
            {loading && <span className={styles.loadingIndicator}></span>}
            <button
              type="button"
              onClick={handleToggleTwoFactor}
              disabled={loading}
              className={`${styles.toggleSwitch} ${twoFactorEnabled ? styles.enabled : ''}`}
              title={
                loading
                  ? 'Updating...'
                  : `Click to ${twoFactorEnabled ? 'disable' : 'enable'} 2FA`
              }
              aria-label={`Two-factor authentication ${twoFactorEnabled ? 'enabled' : 'disabled'}`}
              aria-pressed={twoFactorEnabled}
            >
              <span className={styles.slider} />
            </button>
          </div>
        </div>
      </div>

      {}
      <div className={styles.subsectionDivider}>
        <h3 className={styles.subsectionTitle}>Last Login</h3>

        <div className={styles.lastLogin}>
          <p className={styles.lastLoginLabel}>Last Activity</p>
          <p className={styles.lastLoginTime}>
            {user?.lastLogin
              ? new Date(user.lastLogin).toLocaleString()
              : 'First time logging in'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsSection;

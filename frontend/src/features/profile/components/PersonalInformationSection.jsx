import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { profileApi } from '../api/profileApi';
import { useToast } from '@/contexts';
import maleAvatarImg from '@/assets/images/avatarDefault/maleAvatar.png';
import femaleAvatarImg from '@/assets/images/avatarDefault/femaleAvatar.png';
import styles from './PersonalInformationSection.module.scss';

const getAvatarUrl = (avatar, gender) => {
  if (avatar && avatar.startsWith('data:')) {
    return avatar;
  }

  if (avatar && typeof avatar === 'string') {
    return `/${avatar}`;
  }

  if (gender === 'male') return maleAvatarImg;
  if (gender === 'female') return femaleAvatarImg;
  return maleAvatarImg;
};

const getDefaultAvatar = (gender) => {
  if (gender === 'male') return maleAvatarImg;
  if (gender === 'female') return femaleAvatarImg;
  return maleAvatarImg;
};

const PersonalInformationSection = ({ user }) => {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    avatar: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        avatar: user.avatar || '',
        gender: user.gender || '',
      });
      setAvatarPreview(getAvatarUrl(user?.avatar, user?.gender));
    }
  }, [user]);

  useEffect(() => {
    if (!formData.avatar) {
      setAvatarPreview(getDefaultAvatar(formData.gender));
    }
  }, [formData.gender]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const maxSize = 500;
          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

          setAvatarPreview(compressedBase64);
          setFormData((prev) => ({
            ...prev,
            avatar: compressedBase64,
          }));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({
      ...prev,
      avatar: '',
    }));
    setAvatarPreview(getDefaultAvatar(formData.gender));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearEmail = () => {
    setFormData((prev) => ({
      ...prev,
      email: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await profileApi.updateProfile(formData);
      toast.success(result.message || 'Cập nhật thông tin cá nhân thành công!');
    } catch (error) {
      const errorMessage = error.message || 'Cập nhật thông tin thất bại';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Personal Information</h2>
      <p className={styles.sectionSubtitle}>Update your profile details</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {}
        <div className={styles.avatarSection}>
          <label className={styles.label}>AVATAR</label>
          <div className={styles.avatarUploadContainer}>
            <img
              src={avatarPreview}
              alt="Avatar preview"
              className={styles.avatarPreview}
            />
            <div className={styles.avatarActions}>
              <button
                type="button"
                className={styles.uploadButton}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Photo
              </button>
              {formData.avatar && (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={handleRemoveAvatar}
                >
                  Remove
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        {}
        <div className={styles.twoColumnGroup}>
          {}
          <div className={styles.formGroup}>
            <label className={styles.label}>FIRST NAME</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your first name"
            />
          </div>

          {}
          <div className={styles.formGroup}>
            <label className={styles.label}>LAST NAME</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your last name"
            />
          </div>
        </div>

        {}
        <div className={styles.formGroup}>
          <label className={styles.label}>GENDER</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {}
        <div className={styles.formGroup}>
          <label className={styles.label}>EMAIL ADDRESS</label>
          <div className={styles.inputContainer}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your email address"
            />
            {formData.email && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClearEmail}
                title="Clear email"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        </div>

        {}
        <div className={styles.formGroup}>
          <label className={styles.label}>PHONE NUMBER</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter your phone number"
          />
        </div>

        {}
        <div className={styles.actionButtons}>
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading && <span className={styles.loadingSpinner}></span>}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="reset"
            className={styles.clearButton}
            onClick={() => {
              setFormData({
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                phoneNumber: user?.phoneNumber || '',
                avatar: user?.avatar || '',
                gender: user?.gender || '',
              });
              setAvatarPreview(user?.avatar || getDefaultAvatar(user?.gender));
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInformationSection;

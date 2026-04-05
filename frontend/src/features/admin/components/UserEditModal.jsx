import { useState, useEffect, useRef } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import { fetchUserById, updateUser } from '../api';
import ArtisanFieldsForm from './ArtisanFieldsForm';
import maleAvatarImg from '@/assets/images/avatarDefault/maleAvatar.png';
import femaleAvatarImg from '@/assets/images/avatarDefault/femaleAvatar.png';
import './UserEditModal.scss';

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

const getDefaultAvatar = (gender) => {
  if (gender === 'male') return maleAvatarImg;
  if (gender === 'female') return femaleAvatarImg;
  return maleAvatarImg; // Default to male avatar
};

const UserEditModal = ({ isOpen, onClose, onSuccess, userId }) => {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
    gender: '',
    role: 'customer',
    isActive: false,
  });
  const [artisanData, setArtisanData] = useState({
    category: '',
    craft: '',
    slogan: '',
    storytelling: '',
    experienceYears: 0,
    skills: [],
    province: '',
    village: '',
    location: {
      type: 'Point',
      coordinates: [0, 0],
    },
    workshopLocation: {
      address: '',
      description: '',
    },
    isVerified: false,
    title: '',
    certifyingOrganization: '',
    proofImages: [],
  });

  useEffect(() => {
    if (isOpen && userId) {
      loadUser();
    }
  }, [isOpen, userId]);

  const loadUser = async () => {
    setFetching(true);
    setError('');
    try {
      const response = await fetchUserById(userId);
      const user = response.data || response;
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        gender: user.gender || '',
        role: user.role || 'customer',
        isActive: user.isActive !== undefined ? user.isActive : false,
      });

      // Load artisan data if role is artisan
      if ((user.role || 'customer') === 'artisan' && user.artisanInfo) {
        const artisan = user.artisanInfo;
        setArtisanData({
          category: artisan.category || '',
          craft: artisan.craft || '',
          slogan: artisan.slogan || '',
          storytelling: artisan.storytelling || '',
          experienceYears: artisan.experienceYears || 0,
          skills: artisan.skills || [],
          province: artisan.province || '',
          village: artisan.village || '',
          location: artisan.location || {
            type: 'Point',
            coordinates: [0, 0],
          },
          workshopLocation: artisan.workshopLocation || {
            address: '',
            description: '',
          },
          isVerified: artisan.isVerified || false,
          title: artisan.title || '',
          certifyingOrganization: artisan.certifyingOrganization || '',
          proofImages: artisan.proofImages || [],
        });
      }

      setAvatarPreview(getAvatarUrl(user.avatar, user.gender));
    } catch (err) {
      setError('Failed to load user: ' + (err.message || 'Unknown error'));
      toast.error('Failed to load user information', 4000);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleArtisanDataChange = (newArtisanData) => {
    setArtisanData(newArtisanData);
  };

  // Update avatar preview when gender changes
  useEffect(() => {
    if (!formData.avatar) {
      setAvatarPreview(getDefaultAvatar(formData.gender));
    }
  }, [formData.gender]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result,
        }));
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

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    // Validate artisan fields if role is artisan
    if (formData.role === 'artisan') {
      if (!artisanData.category?.trim()) {
        setError('Category is required for artisan');
        return false;
      }
      if (!artisanData.craft?.trim()) {
        setError('Craft is required for artisan');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    try {
      const updateData = {
        ...formData,
        ...(formData.role === 'artisan' && { artisanInfo: artisanData }),
      };

      await updateUser(userId, updateData);

      // Show success toast
      toast.success(`Cập nhật thông tin thành công!`, 4000);

      // Call onSuccess callback to refresh users list
      if (onSuccess) {
        onSuccess();
      }

      handleClose();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || 'Failed to update user';
      setError(errorMsg);
      toast.error(errorMsg, 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      avatar: '',
      gender: '',
      role: 'customer',
      isActive: false,
    });
    setAvatarPreview('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  if (fetching) {
    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Update User Profile</h2>
            <button className="modal-close" onClick={handleClose}>
              ✕
            </button>
          </div>
          <div className="loading-state">
            <p>Loading user information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Update User Profile</h2>
          <p>
            Modify the account details and access permissions for this member.
          </p>
          <button className="modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">FIRST NAME</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">LAST NAME</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">EMAIL ADDRESS</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@heritage.com"
              disabled={true}
            />
            <small style={{ color: '#999' }}>Email cannot be changed</small>
          </div>

          <div className="form-group">
            <label htmlFor="phone">PHONE NUMBER</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">GENDER</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>AVATAR</label>
            <div className="avatar-edit-container">
              <img
                src={avatarPreview}
                alt="Avatar"
                className="avatar-preview-edit"
              />
              <div className="avatar-actions">
                <button
                  type="button"
                  className="btn-avatar-upload"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  Upload Photo
                </button>
                {formData.avatar && (
                  <button
                    type="button"
                    className="btn-avatar-remove"
                    onClick={handleRemoveAvatar}
                    disabled={loading}
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

          <div className="form-group">
            <label htmlFor="role">ASSIGNED ROLE</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="customer">Tourist</option>
              <option value="artisan">Artisan</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Artisan Fields - Show only when role is artisan */}
          {formData.role === 'artisan' && (
            <ArtisanFieldsForm
              artisanData={artisanData}
              onArtisanDataChange={handleArtisanDataChange}
              loading={loading}
            />
          )}

          <div className="form-group checkbox-group">
            <label htmlFor="isActive">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                disabled={loading}
              />
              <span>
                <strong>Active Status</strong>
                <small>
                  Allow this user to log in and interact with the platform.
                </small>
              </span>
            </label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-save" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;

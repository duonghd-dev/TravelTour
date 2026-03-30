import { useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  ARTISAN_CATEGORIES,
  ARTISAN_CRAFTS,
  ARTISAN_TITLES,
  PROVINCES,
  COMMON_SKILLS,
} from '../constants/artisanConstants';
import './ArtisanFieldsForm.scss';

const ArtisanFieldsForm = ({ artisanData, onArtisanDataChange, loading }) => {
  const avatarInputRef = useRef(null);
  const proofImagesRef = useRef(null);
  const [customCategory, setCustomCategory] = useState('');
  const [customCraft, setCustomCraft] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [selectedSkills, setSelectedSkills] = useState(
    artisanData.skills || []
  );
  const [skillInput, setSkillInput] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(artisanData.avatar || '');
  const [proofImagesPreviews, setProofImagesPreviews] = useState(
    artisanData.proofImages?.map((img) => ({
      url: img,
      isNew: false,
    })) || []
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onArtisanDataChange({
      ...artisanData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'other') {
      setCustomCategory('');
    }
    onArtisanDataChange({
      ...artisanData,
      category: value === 'other' ? customCategory : value,
    });
  };

  const handleCustomCategoryChange = (e) => {
    const value = e.target.value;
    setCustomCategory(value);
    onArtisanDataChange({
      ...artisanData,
      category: value,
    });
  };

  const handleCraftChange = (e) => {
    const value = e.target.value;
    if (value === 'other') {
      setCustomCraft('');
    }
    onArtisanDataChange({
      ...artisanData,
      craft: value === 'other' ? customCraft : value,
    });
  };

  const handleCustomCraftChange = (e) => {
    const value = e.target.value;
    setCustomCraft(value);
    onArtisanDataChange({
      ...artisanData,
      craft: value,
    });
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value === 'other') {
      setCustomTitle('');
    }
    onArtisanDataChange({
      ...artisanData,
      title: value === 'other' ? customTitle : value,
    });
  };

  const handleCustomTitleChange = (e) => {
    const value = e.target.value;
    setCustomTitle(value);
    onArtisanDataChange({
      ...artisanData,
      title: value,
    });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        onArtisanDataChange({
          ...artisanData,
          avatar: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProofImagesUpload = (e) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProofImagesPreviews((prev) => [
            ...prev,
            {
              url: reader.result,
              isNew: true,
            },
          ]);
          onArtisanDataChange({
            ...artisanData,
            proofImages: [...(artisanData.proofImages || []), reader.result],
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeProofImage = (index) => {
    const newPreviews = proofImagesPreviews.filter((_, i) => i !== index);
    const newImages = artisanData.proofImages.filter((_, i) => i !== index);
    setProofImagesPreviews(newPreviews);
    onArtisanDataChange({
      ...artisanData,
      proofImages: newImages,
    });
  };

  const addSkill = () => {
    if (skillInput.trim() && !selectedSkills.includes(skillInput.trim())) {
      const newSkills = [...selectedSkills, skillInput.trim()];
      setSelectedSkills(newSkills);
      setSkillInput('');
      onArtisanDataChange({
        ...artisanData,
        skills: newSkills,
      });
    }
  };

  const removeSkill = (skill) => {
    const newSkills = selectedSkills.filter((s) => s !== skill);
    setSelectedSkills(newSkills);
    onArtisanDataChange({
      ...artisanData,
      skills: newSkills,
    });
  };

  const toggleSkillSelection = (skill) => {
    if (selectedSkills.includes(skill)) {
      removeSkill(skill);
    } else {
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills);
      onArtisanDataChange({
        ...artisanData,
        skills: newSkills,
      });
    }
  };

  const handleCoordinateChange = (axis, value) => {
    const coordinates = [...(artisanData.location?.coordinates || [0, 0])];
    coordinates[axis === 'lng' ? 0 : 1] = parseFloat(value) || 0;
    onArtisanDataChange({
      ...artisanData,
      location: {
        type: 'Point',
        coordinates,
      },
    });
  };

  const lat = artisanData.location?.coordinates?.[1] || '';
  const lng = artisanData.location?.coordinates?.[0] || '';

  const craftsForCategory =
    ARTISAN_CRAFTS[
      artisanData.category === 'other' ? '' : artisanData.category
    ] || [];

  const categoryValue = ARTISAN_CATEGORIES.find(
    (c) => c.value === artisanData.category
  )?.value;
  const isCategoryOther = categoryValue === 'other' || !categoryValue;

  const craftValue = craftsForCategory.find((c) => c === artisanData.craft);
  const isCraftOther = !craftValue && artisanData.craft;

  const titleValue = ARTISAN_TITLES.find((t) => t === artisanData.title);
  const isTitleOther = !titleValue && artisanData.title;

  return (
    <div className="artisan-fields-form">
      <h3 className="section-title">📚 THÔNG TIN NGHỀ CỦA ARTISAN</h3>

      {/* Avatar Upload */}
      <div className="form-group">
        <label>ẢNH ĐẠI DIỆN</label>
        <div className="avatar-upload-container">
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar preview"
              className="avatar-preview"
            />
          )}
          <button
            type="button"
            className="btn-upload"
            onClick={() => avatarInputRef.current?.click()}
            disabled={loading}
          >
            {avatarPreview ? 'Thay đổi ảnh' : 'Tải lên ảnh'}
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            style={{ display: 'none' }}
          />
          {avatarPreview && (
            <button
              type="button"
              className="btn-remove"
              onClick={() => {
                setAvatarPreview('');
                onArtisanDataChange({
                  ...artisanData,
                  avatar: '',
                });
              }}
              disabled={loading}
            >
              Xóa ảnh
            </button>
          )}
        </div>
      </div>

      {/* Category & Craft */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">NHÓM NGÀNH NGHỀ (Category) *</label>
          <select
            id="category"
            value={isCategoryOther ? 'other' : artisanData.category}
            onChange={handleCategoryChange}
            disabled={loading}
          >
            <option value="">-- Chọn ngành nghề --</option>
            {ARTISAN_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {isCategoryOther && (
            <input
              type="text"
              value={customCategory}
              onChange={handleCustomCategoryChange}
              placeholder="Nhập ngành nghề khác"
              disabled={loading}
            />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="craft">NGHỀ CỤ THỂ (Craft) *</label>
          {craftsForCategory.length > 0 ? (
            <>
              <select
                id="craft"
                value={isCraftOther ? 'other' : artisanData.craft}
                onChange={handleCraftChange}
                disabled={loading}
              >
                <option value="">-- Chọn nghề --</option>
                {craftsForCategory.map((craft) => (
                  <option key={craft} value={craft}>
                    {craft}
                  </option>
                ))}
              </select>
              {isCraftOther && (
                <input
                  type="text"
                  value={customCraft}
                  onChange={handleCustomCraftChange}
                  placeholder="Nhập nghề khác"
                  disabled={loading}
                />
              )}
            </>
          ) : (
            <input
              type="text"
              value={customCraft}
              onChange={handleCustomCraftChange}
              placeholder="Nhập nghề cụ thể"
              disabled={loading}
            />
          )}
        </div>
      </div>

      {/* Bio & Storytelling */}
      <div className="form-group">
        <label htmlFor="bio">MÔ TẢ NGHỀ (Bio)</label>
        <ReactQuill
          id="bio"
          value={artisanData.bio || ''}
          onChange={(value) =>
            onArtisanDataChange({
              ...artisanData,
              bio: value,
            })
          }
          placeholder="Mô tả ngắn gọn về kỹ năng và kinh nghiệm"
          readOnly={loading}
          modules={{
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
          }}
          theme="snow"
        />
      </div>

      <div className="form-group">
        <label htmlFor="storytelling">
          CÂU CHUYỆN NGHỀ (Storytelling) 👉 QUAN TRỌNG
        </label>
        <ReactQuill
          id="storytelling"
          value={artisanData.storytelling || ''}
          onChange={(value) =>
            onArtisanDataChange({
              ...artisanData,
              storytelling: value,
            })
          }
          placeholder="Câu chuyện về hành trình, đam mê, giá trị của thợ nghề (rất quan trọng cho du lịch)"
          readOnly={loading}
          modules={{
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
          }}
          theme="snow"
          style={{ minHeight: '200px' }}
        />
      </div>

      {/* Experience & Title */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="experienceYears">SỐ NĂM KINH NGHIỆM</label>
          <input
            type="number"
            id="experienceYears"
            name="experienceYears"
            value={artisanData.experienceYears || ''}
            onChange={handleChange}
            min="0"
            placeholder="VD: 15"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">DANH HIỆU (Title)</label>
          <select
            id="title"
            value={isTitleOther ? 'other' : artisanData.title}
            onChange={handleTitleChange}
            disabled={loading}
          >
            <option value="">-- Chọn danh hiệu --</option>
            {ARTISAN_TITLES.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
          {isTitleOther && (
            <input
              type="text"
              value={customTitle}
              onChange={handleCustomTitleChange}
              placeholder="Nhập danh hiệu khác"
              disabled={loading}
            />
          )}
        </div>
      </div>

      {/* Skills Selection */}
      <div className="form-group">
        <label>KỸ NĂNG / KỸ THUẬT</label>
        <div className="skills-selector">
          <div className="skills-list">
            {COMMON_SKILLS.map((skill) => (
              <button
                key={skill}
                type="button"
                className={`skill-tag ${selectedSkills.includes(skill) ? 'active' : ''}`}
                onClick={() => toggleSkillSelection(skill)}
                disabled={loading}
              >
                {skill}
                {selectedSkills.includes(skill) && ' ✓'}
              </button>
            ))}
          </div>
          <div className="skill-input-group">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Thêm kỹ năng khác"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              disabled={loading}
            />
            <button
              type="button"
              className="btn-add-skill"
              onClick={addSkill}
              disabled={loading}
            >
              Thêm
            </button>
          </div>
        </div>
      </div>

      {/* Location Information */}
      <h3 className="section-title">📍 THÔNG TIN ĐỊA ĐIỂM</h3>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="province">TỈNH / THÀNH PHỐ</label>
          <select
            id="province"
            name="province"
            value={artisanData.province || ''}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">-- Chọn tỉnh thành --</option>
            {PROVINCES.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="village">LÀNG NGHỀ (Village)</label>
          <input
            type="text"
            id="village"
            name="village"
            value={artisanData.village || ''}
            onChange={handleChange}
            placeholder="VD: Bát Tràng, Thanh Hà, Hội An"
            disabled={loading}
          />
        </div>
      </div>

      {/* Coordinates */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="latitude">VĨ ĐỘ (Latitude)</label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            value={lat}
            onChange={(e) => handleCoordinateChange('lat', e.target.value)}
            step="0.0001"
            placeholder="VD: 21.0285"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="longitude">KINH ĐỘ (Longitude)</label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            value={lng}
            onChange={(e) => handleCoordinateChange('lng', e.target.value)}
            step="0.0001"
            placeholder="VD: 105.8542"
            disabled={loading}
          />
        </div>
      </div>

      {/* Workshop Location */}
      <div className="form-group">
        <label htmlFor="workshopAddress">ĐỊA CHỈ KHÔNG GIAN TRẢI NGHIỆM</label>
        <input
          type="text"
          id="workshopAddress"
          name="workshopAddress"
          value={artisanData.workshopLocation?.address || ''}
          onChange={(e) =>
            onArtisanDataChange({
              ...artisanData,
              workshopLocation: {
                ...(artisanData.workshopLocation || {}),
                address: e.target.value,
              },
            })
          }
          placeholder="VD: 123 Ngõ Gốc, Hà Nội"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="workshopDescription">
          MÔ TẢ KHÔNG GIAN TRẢI NGHIỆM
        </label>
        <ReactQuill
          id="workshopDescription"
          value={artisanData.workshopLocation?.description || ''}
          onChange={(value) =>
            onArtisanDataChange({
              ...artisanData,
              workshopLocation: {
                ...(artisanData.workshopLocation || {}),
                description: value,
              },
            })
          }
          placeholder="Mô tả về không gian, tiện ích, giờ mở cửa, v.v."
          readOnly={loading}
          theme="snow"
          modules={{
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
          }}
        />
      </div>

      {/* Verification & Certification */}
      <h3 className="section-title">✅ THÔNG TIN XÁC MINH & CHỨNG NHẬN</h3>

      <div className="form-group checkbox-group">
        <label htmlFor="isVerified">
          <input
            type="checkbox"
            id="isVerified"
            name="isVerified"
            checked={artisanData.isVerified || false}
            onChange={handleChange}
            disabled={loading}
          />
          <span>Đã Xác Minh</span>
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="certifyingOrganization">TỔ CHỨC CẤP CHỨNG NHẬN</label>
        <input
          type="text"
          id="certifyingOrganization"
          name="certifyingOrganization"
          value={artisanData.certifyingOrganization || ''}
          onChange={handleChange}
          placeholder="VD: Sở Văn hóa, Thể thao và Du lịch"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>HÌNH ẢNH CHỨNG MINH</label>
        <div className="proof-images-container">
          <div className="proof-images-list">
            {proofImagesPreviews.map((img, index) => (
              <div key={index} className="proof-image-item">
                <img src={img.url} alt={`Proof ${index}`} />
                <button
                  type="button"
                  className="btn-remove-image"
                  onClick={() => removeProofImage(index)}
                  disabled={loading}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn-upload-proof"
            onClick={() => proofImagesRef.current?.click()}
            disabled={loading}
          >
            + Thêm hình ảnh
          </button>
          <input
            ref={proofImagesRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleProofImagesUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtisanFieldsForm;

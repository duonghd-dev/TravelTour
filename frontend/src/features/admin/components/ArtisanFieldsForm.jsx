import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import './ArtisanFieldsForm.scss';

const ARTISAN_CATEGORIES = [
  'Gốm sứ',
  'Thêu',
  'Lụa',
  'Nón lá',
  'Sơn mài',
  'Đồ gỗ',
  'Thủ công mỹ nghệ',
];

const PROVINCES = [
  'Hà Nội',
  'Hải Phòng',
  'Đà Nẵng',
  'Hồ Chí Minh',
  'Huế',
  'Hội An',
];

const SKILLS_BY_CATEGORY = {
  'Gốm sứ': [
    'Nặn gốm trên bánh xe quay',
    'Vẽ men truyền thống',
    'Nung gốm lò truyền thống',
    'Thiết kế hoạ tiết',
    'Phối màu men',
    'Nung lửa kiểm soát nhiệt độ',
    'Vệ sinh & đánh bóng',
    'Tạo mẫu gốm',
  ],
  Thêu: [
    'Thêu tay cơ bản',
    'Thêu ren sang trọng',
    'Thêu bề mặt 3D',
    'Thiết kế hoa văn',
    'Chọn và phối màu chỉ',
    'Hướng dẫn học viên',
    'Thêu điểm',
    'Thêu nổi',
  ],
  Lụa: [
    'Dệt lụa trên máy truyền thống',
    'Nhuộm màu tự nhiên',
    'Thiết kế họa tiết lụa',
    'Xử lý lụa sau dệt',
    'Kiểm soát chất lượng',
    'Tư vấn khách hàng',
    'Nuôi tằm',
    'Cuộn tơ tằm',
  ],
  'Nón lá': [
    'Làm nón lá từ đầu đến cuối',
    'Vẽ hoa văn truyền thống trên nón',
    'Bện nón với kỹ thuật cao',
    'Chọn lá nón chất lượng tốt',
    'Xử lý lá nón sấy nung',
    'Phối hợp màu sắc',
    'Lắp khung nón',
    'Bện viền nón',
  ],
  'Sơn mài': [
    'Chuẩn bị bề mặt',
    'Tuyệt sơn mài truyền thống',
    'Kỹ thuật sơn múng',
    'Tỉnh khắc họa tiết',
    'Sơn màu truyền thống',
    'Đánh bóng sơn mài',
    'Vẽ họa tiết ',
    'Xử lý lửa',
  ],
  'Đồ gỗ': [
    'Chọn và phân loại gỗ',
    'Cưa & vạt gỗ',
    'Chạm khắc gỗ',
    'Thiết kế sản phẩm',
    'Đánh bóng & hoàn thiện',
    'Sơn mà bảo vệ gỗ',
    'Kỹ thuật nối gỗ',
    'Tạo chi tiết decorative',
  ],
  'Thủ công mỹ nghệ': [
    'Tạo mẫu handmade',
    'Kỹ thuật cơ bản',
    'Thiết kế sáng tạo',
    'Sử dụng công cụ thủ công',
    'Hoàn thiện sản phẩm',
    'Hướng dẫn khác hàng',
    'Bảo quản & bảo dưỡng',
    'Áp dụng kỹ thuật mới',
  ],
};

const STORYTELLING_TEMPLATES = [
  {
    id: 'intro',
    label: 'Giới thiệu',
    placeholder: 'Mô tả ngắn về bạn và ngành nghề',
  },
  {
    id: 'journey',
    label: 'Hành trình',
    placeholder: 'Kể về hành trình của bạn trong nghề',
  },
  {
    id: 'techniques',
    label: 'Kỹ thuật',
    placeholder: 'Mô tả kỹ thuật và truyền thống bạn sử dụng',
  },
  {
    id: 'passion',
    label: 'Đam mê',
    placeholder: 'Chia sẻ đam mê của bạn dành cho nghề thủ công',
  },
  {
    id: 'vision',
    label: 'Tầm nhìn',
    placeholder: 'Tầm nhìn của bạn cho tương lai của nghề',
  },
];

const ArtisanFieldsForm = ({ artisanData, onArtisanDataChange, loading }) => {
  const parseStorytellingHTML = (html) => {
    const sections = {};
    if (!html) return sections;

    return sections;
  };

  const [skills, setSkills] = useState(artisanData.skills || []);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newProofImageUrl, setNewProofImageUrl] = useState('');
  const [storytelSections, setStorytelSections] = useState(
    artisanData.storytelling
      ? parseStorytellingHTML(artisanData.storytelling)
      : {}
  );

  useEffect(() => {
    setSkills(artisanData.skills || []);
  }, [artisanData.skills]);

  useEffect(() => {
    if (
      artisanData.storytelling &&
      Object.keys(storytelSections).length === 0
    ) {
      const parsed = parseStorytellingHTML(artisanData.storytelling);
      setStorytelSections(parsed);
    }
  }, [artisanData.storytelling]);

  useEffect(() => {
    if (!artisanData.category) return;

    const validSkills = skills.filter((s) =>
      SKILLS_BY_CATEGORY[artisanData.category]?.includes(s)
    );

    if (validSkills.length !== skills.length && validSkills.length > 0) {
      setSkills(validSkills);
    }
  }, [artisanData.category]);

  const generateStorytellingHTML = (sections) => {
    if (!sections || Object.keys(sections).length === 0) return '';

    let html = '<h2>Câu Chuyện Di Sản</h2>\n';
    STORYTELLING_TEMPLATES.forEach((template) => {
      if (sections[template.id]?.trim()) {
        html += `<h4>${template.label}</h4>\n`;
        html += `<p>${sections[template.id]}</p>\n`;
      }
    });
    return html;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newData = {
      ...artisanData,
      [name]: type === 'checkbox' ? checked : value,
    };
    onArtisanDataChange(newData);
  };

  const handleNestedChange = (parentKey, childKey, value) => {
    const newData = {
      ...artisanData,
      [parentKey]: {
        ...artisanData[parentKey],
        [childKey]: value,
      },
    };
    onArtisanDataChange(newData);
  };

  const handleLocationChange = (index, value) => {
    const newCoords = [...artisanData.location.coordinates];
    newCoords[index] = parseFloat(value);
    const newData = {
      ...artisanData,
      location: {
        ...artisanData.location,
        coordinates: newCoords,
      },
    };
    onArtisanDataChange(newData);
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = skills.filter((s) => s !== skillToRemove);
    setSkills(updatedSkills);
    const newData = {
      ...artisanData,
      skills: updatedSkills,
    };
    onArtisanDataChange(newData);
  };

  const toggleSkill = (skill) => {
    let updatedSkills;
    if (skills.includes(skill)) {
      updatedSkills = skills.filter((s) => s !== skill);
    } else {
      updatedSkills = [...skills, skill];
    }
    setSkills(updatedSkills);
    const newData = {
      ...artisanData,
      skills: updatedSkills,
    };
    onArtisanDataChange(newData);
  };

  const availableSkills = SKILLS_BY_CATEGORY[artisanData.category] || [];

  const addImageFromUrl = () => {
    if (newImageUrl.trim()) {
      const updatedImages = [...(artisanData.images || []), newImageUrl];
      onArtisanDataChange({
        ...artisanData,
        images: updatedImages,
      });
      setNewImageUrl('');
    }
  };

  const addProofImageFromUrl = () => {
    if (newProofImageUrl.trim()) {
      const updatedProofImages = [
        ...(artisanData.proofImages || []),
        newProofImageUrl,
      ];
      onArtisanDataChange({
        ...artisanData,
        proofImages: updatedProofImages,
      });
      setNewProofImageUrl('');
    }
  };

  const handleImageUpload = (e, fieldName) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      onArtisanDataChange({
        ...artisanData,
        [fieldName]: [...(artisanData[fieldName] || []), ...fileArray],
      });
    }
  };

  const removeImage = (fieldName, index) => {
    onArtisanDataChange({
      ...artisanData,
      [fieldName]: artisanData[fieldName].filter((_, i) => i !== index),
    });
  };

  const handleStorytelingSectionChange = (sectionId, value) => {
    const updatedSections = { ...storytelSections, [sectionId]: value };
    setStorytelSections(updatedSections);
    const html = generateStorytellingHTML(updatedSections);
    onArtisanDataChange({
      ...artisanData,
      storytelling: html,
    });
  };

  return (
    <div className="artisan-fields-form">
      <h3 className="form-section-title">Thông Tin Nghệ Nhân</h3>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">CATEGORY *</label>
          <select
            id="category"
            name="category"
            value={artisanData.category}
            onChange={handleInputChange}
            disabled={loading}
            required
          >
            <option value="">Chọn danh mục</option>
            {ARTISAN_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="craft">CRAFT *</label>
          <input
            type="text"
            id="craft"
            name="craft"
            value={artisanData.craft}
            onChange={handleInputChange}
            placeholder="e.g. Làm gốm trắng"
            disabled={loading}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="title">TITLE</label>
          <input
            type="text"
            id="title"
            name="title"
            value={artisanData.title}
            onChange={handleInputChange}
            placeholder="e.g. Nghệ nhân Gốm Bát Tràng"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="experienceYears">EXPERIENCE (YEARS)</label>
          <input
            type="number"
            id="experienceYears"
            name="experienceYears"
            value={artisanData.experienceYears}
            onChange={handleInputChange}
            min="0"
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="slogan">SLOGAN / CÂU ĐỀ CƯ</label>
        <textarea
          id="slogan"
          name="slogan"
          value={artisanData.slogan}
          onChange={handleInputChange}
          placeholder="Một câu slogan ngắn gúc thể hiện đặc trưng, tôn chỉ của bạn (tối đa 500 ký tự)"
          rows="2"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>STORYTELLING - CÂU CHUYỆN DI SẢN</label>
        <p className="form-hint">
          Nhập nội dung cho mỗi phần câu chuyện. Hệ thống sẽ tự động tạo HTML.
        </p>

        <div className="storytelling-editor">
          {STORYTELLING_TEMPLATES.map((template) => (
            <div key={template.id} className="storytelling-section">
              <label htmlFor={`story-${template.id}`}>
                <FontAwesomeIcon icon={faBook} className="section-icon" />
                {template.label}
              </label>
              <textarea
                id={`story-${template.id}`}
                value={storytelSections[template.id] || ''}
                onChange={(e) =>
                  handleStorytelingSectionChange(template.id, e.target.value)
                }
                placeholder={template.placeholder}
                rows="4"
                disabled={loading}
              />
              <div className="section-hint">
                {(storytelSections[template.id] || '').length} ký tự
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>KỸ NĂNG</label>
        <p className="form-hint">
          Chọn các kỹ năng phù hợp với ngành nghề của bạn
        </p>

        <div className="skills-dropdown-wrapper">
          <button
            type="button"
            className="skills-dropdown-btn"
            onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
            disabled={loading || availableSkills.length === 0}
          >
            <span>
              {skills.length > 0
                ? `${skills.length} kỹ năng được chọn`
                : 'Chọn kỹ năng'}
            </span>
            <ChevronDown size={18} />
          </button>

          {showSkillsDropdown && availableSkills.length > 0 && (
            <div className="skills-dropdown-menu">
              {availableSkills.map((skill, idx) => (
                <label key={idx} className="skill-checkbox">
                  <input
                    type="checkbox"
                    checked={skills.includes(skill)}
                    onChange={() => toggleSkill(skill)}
                    disabled={loading}
                  />
                  <span className="skill-label">{skill}</span>
                </label>
              ))}
            </div>
          )}

          {availableSkills.length === 0 && (
            <p
              className="form-hint"
              style={{ color: '#d9534f', marginTop: '8px' }}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} /> Vui lòng chọn
              CATEGORY trước
            </p>
          )}
        </div>

        {skills.length > 0 && (
          <div className="skills-list">
            {skills.map((skill) => (
              <div key={skill} className="skill-item">
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  disabled={loading}
                  className="btn-remove"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="province">PROVINCE</label>
          <select
            id="province"
            name="province"
            value={artisanData.province}
            onChange={handleInputChange}
            disabled={loading}
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {PROVINCES.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="village">VILLAGE</label>
          <input
            type="text"
            id="village"
            name="village"
            value={artisanData.village}
            onChange={handleInputChange}
            placeholder="e.g. Bát Tràng"
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="longitude">LONGITUDE</label>
          <input
            type="number"
            id="longitude"
            value={artisanData.location?.coordinates?.[0] || 0}
            onChange={(e) => handleLocationChange(0, e.target.value)}
            step="0.00001"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="latitude">LATITUDE</label>
          <input
            type="number"
            id="latitude"
            value={artisanData.location?.coordinates?.[1] || 0}
            onChange={(e) => handleLocationChange(1, e.target.value)}
            step="0.00001"
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="workshopAddress">WORKSHOP ADDRESS</label>
        <input
          type="text"
          id="workshopAddress"
          value={artisanData.workshopLocation?.address || ''}
          onChange={(e) =>
            handleNestedChange('workshopLocation', 'address', e.target.value)
          }
          placeholder="e.g. 123 Ngõ Gốm, Bát Tràng, Gia Lâm, Hà Nội"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="workshopDesc">WORKSHOP DESCRIPTION (Mô Tả Xưởng)</label>
        <p className="form-hint">
          Mô tả về xưởng: trang thiết bị, quy mô, tính chất công việc, lịch hoạt
          động, v.v.
          <br />
          Ví dụ: "Xưởng gốm truyền thống với lò nung cổ còn hoạt động, máy dệt
          thủ công, phòng trưng bày sản phẩm"
        </p>
        <textarea
          id="workshopDesc"
          value={artisanData.workshopLocation?.description || ''}
          onChange={(e) =>
            handleNestedChange(
              'workshopLocation',
              'description',
              e.target.value
            )
          }
          placeholder="Mô tả chi tiết: trang thiết bị, hoạt động chính, lịch mở cửa, v.v."
          rows="3"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="certifyingOrganization">CERTIFYING ORGANIZATION</label>
        <input
          type="text"
          id="certifyingOrganization"
          name="certifyingOrganization"
          value={artisanData.certifyingOrganization}
          onChange={handleInputChange}
          placeholder="e.g. Hội Nghề thêu Hà Nội"
          disabled={loading}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="generation">GENERATION</label>
          <input
            type="number"
            id="generation"
            name="generation"
            value={artisanData.generation}
            onChange={handleInputChange}
            min="1"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isVerified"
              checked={artisanData.isVerified}
              onChange={handleInputChange}
              disabled={loading}
            />
            <span>IS VERIFIED</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="proofImages">PROOF IMAGES</label>
        <div className="image-url-input">
          <input
            type="text"
            value={newProofImageUrl}
            onChange={(e) => setNewProofImageUrl(e.target.value)}
            placeholder="Nhập URL hình ảnh chứng minh (vd: https://...)"
            disabled={loading}
            onKeyPress={(e) =>
              e.key === 'Enter' && (e.preventDefault(), addProofImageFromUrl())
            }
          />
          <button
            type="button"
            onClick={addProofImageFromUrl}
            disabled={loading || !newProofImageUrl.trim()}
            className="btn-add-image"
          >
            Thêm URL
          </button>
        </div>
        <input
          type="file"
          id="proofImages"
          multiple
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'proofImages')}
          disabled={loading}
        />
        <div className="image-preview">
          {artisanData.proofImages?.map((img, idx) => (
            <div key={idx} className="image-item">
              <img
                src={img}
                alt={`Proof ${idx + 1}`}
                onError={(e) => (e.target.style.display = 'none')}
              />
              <button
                type="button"
                onClick={() => removeImage('proofImages', idx)}
                disabled={loading}
                className="btn-remove-image"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="images">WORKSHOP IMAGES</label>
        <div className="image-url-input">
          <input
            type="text"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Nhập URL hình ảnh xưởng (vd: https://...)"
            disabled={loading}
            onKeyPress={(e) =>
              e.key === 'Enter' && (e.preventDefault(), addImageFromUrl())
            }
          />
          <button
            type="button"
            onClick={addImageFromUrl}
            disabled={loading || !newImageUrl.trim()}
            className="btn-add-image"
          >
            Thêm URL
          </button>
        </div>
        <input
          type="file"
          id="images"
          multiple
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'images')}
          disabled={loading}
        />
        <div className="image-preview">
          {artisanData.images?.map((img, idx) => (
            <div key={idx} className="image-item">
              <img
                src={img}
                alt={`Workshop ${idx + 1}`}
                onError={(e) => (e.target.style.display = 'none')}
              />
              <button
                type="button"
                onClick={() => removeImage('images', idx)}
                disabled={loading}
                className="btn-remove-image"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtisanFieldsForm;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Star, MapPin, Clock, Users, Heart } from 'lucide-react';
import { getAllExperiences } from '../../../services/api/experienceService.js';
import { profileApi } from '@/features/profile/api/profileApi';
import { useToast } from '@/contexts';
import './ExperiencesPage.scss';

const ExperienceCard = ({
  experience,
  fromCheckout = false,
  currentItems = [],
}) => {
  const navigate = useNavigate();
  const { showWarning } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await profileApi.getFavorites();
        const favorites = response.data || [];

        const favorite = favorites.find(
          (fav) =>
            fav.itemId.toString() === experience._id &&
            fav.itemType === 'experience'
        );

        if (favorite) {
          setIsFavorite(true);
          setFavoriteId(favorite._id);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    if (experience._id) {
      checkFavoriteStatus();
    }
  }, [experience._id]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    try {
      setLoading(true);

      if (isFavorite && favoriteId) {
        await profileApi.removeFavorite(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        const response = await profileApi.addFavorite(
          experience._id,
          'experience'
        );
        if (response.success) {
          setIsFavorite(true);

          const favorites = response.data || [];
          const newFavorite = favorites.find(
            (fav) =>
              fav.itemId.toString() === experience._id &&
              fav.itemType === 'experience'
          );
          if (newFavorite) {
            setFavoriteId(newFavorite._id);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/experiences/${experience._id}`);
  };

  const handleBookNow = (e) => {
    e.stopPropagation();

    if (fromCheckout && currentItems && currentItems.length > 0) {
      const hasTour = currentItems.some((item) => item.itemType === 'tour');

      if (hasTour) {
        showWarning(
          'Tour đã bao gồm lịch trình đầy đủ. Bạn không thể thêm trải nghiệm khác!',
          5000
        );
        return;
      }
    }

    const bookingData = {
      itemId: experience._id,
      itemType: 'experience',
      itemName: experience.title,
      price: experience.price,
    };

    if (fromCheckout) {
      navigate('/checkout', {
        state: {
          bookingData,
          addToCart: true,
          currentItems: currentItems,
        },
      });
    } else {
      navigate('/checkout', {
        state: {
          bookingData,
        },
      });
    }
  };

  const rating = experience.ratingAverage || 4.5;
  const reviewCount = experience.totalReviews || 0;
  const artisanName =
    experience.artisanId?.title || experience.artisanId?.craft || 'Nghệ nhân';

  return (
    <div className="experience-card group" onClick={handleCardClick}>
      {}
      <div className="experience-card__image-wrapper">
        <img
          src={experience.images?.[0] || 'https://via.placeholder.com/600'}
          alt={experience.title}
          className="experience-card__image"
        />

        {experience.badge && (
          <div className="experience-card__badge">{experience.badge}</div>
        )}

        <button
          onClick={handleFavoriteClick}
          disabled={loading}
          className={`experience-card__favorite ${isFavorite ? 'active' : ''}`}
        >
          <Heart className="icon" />
        </button>

        {rating && (
          <div className="experience-card__rating">
            <Star className="icon" />
            <span className="score">{rating}</span>
            {reviewCount > 0 && <span className="count">({reviewCount})</span>}
          </div>
        )}
      </div>

      {}
      <div className="experience-card__content">
        <div className="experience-card__artisan">Bởi {artisanName}</div>

        <h3 className="experience-card__title">{experience.title}</h3>

        <div className="experience-card__meta">
          <div className="meta-item">
            <MapPin className="icon" />
            {experience.location || 'Chưa xác định'}
          </div>
          <div className="meta-item">
            <Clock className="icon" />
            {experience.duration?.value || '1'}{' '}
            {experience.duration?.unit === 'day'
              ? 'Ngày'
              : experience.duration?.unit === 'hour'
                ? 'Giờ'
                : 'Buổi'}
          </div>
          <div className="meta-item">
            <Users className="icon" />
            Tối đa {experience.maxGuests || 1} khách
          </div>
        </div>

        {experience.timeSlots && experience.timeSlots.length > 0 && (
          <div className="experience-card__timeslots">
            {experience.timeSlots
              .filter((slot) => {
                // Lọc bỏ các time slot không hợp lệ
                const time = typeof slot === 'string' ? slot : slot?.time;
                return time && typeof time === 'string' && time.trim() !== '';
              })
              .map((slot, index) => (
                <span key={index} className="slot">
                  {typeof slot === 'string' ? slot : slot.time}
                </span>
              ))}
          </div>
        )}

        {experience.quote && (
          <p className="experience-card__quote">"{experience.quote}"</p>
        )}

        <p className="experience-card__desc">{experience.description}</p>

        {}
        <div className="experience-card__footer">
          <div className="experience-card__price">
            <span className="label">Giá từ</span>
            <div className="value">
              {new Intl.NumberFormat('vi-VN').format(experience.price)} đ
              <span className="unit">/người</span>
            </div>
          </div>
          <button className="experience-card__book-btn" onClick={handleBookNow}>
            Đặt Chỗ Ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ExperiencesPage() {
  const location = useLocation();
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fromCheckout = location.state?.fromCheckout || false;
  const currentItems = location.state?.currentItems || [];

  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [maxDuration, setMaxDuration] = useState(14);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [displayCount, setDisplayCount] = useState(6);

  const categories = [
    'Tất cả',
    'Thủ công mỹ nghệ',
    'Ẩm thực truyền thống',
    'Cảnh quan & Nông nghiệp',
  ];
  const regions = [
    'Miền Bắc',
    'Miền Trung',
    'Tây Nguyên',
    'Đồng bằng sông Cửu Long',
  ];

  useEffect(() => {
    const fetchExperiences = async () => {
      setIsLoading(true);
      try {
        const data = await getAllExperiences();
        setExperiences(data);
        setFilteredExperiences(data);
      } catch (error) {
        console.error('Lỗi khi tải trải nghiệm:', error);
        setExperiences([]);
        setFilteredExperiences([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  useEffect(() => {
    let result = [...experiences];

    if (activeCategory !== 'Tất cả') {
      result = result.filter((exp) => {
        // Map craft to category
        const craftToCategoryMap = {
          'Thêu tay truyền thống': 'Thủ công mỹ nghệ',
          'Dệt lụa tơ tằm': 'Thủ công mỹ nghệ',
          'Làm nón lá truyền thống': 'Thủ công mỹ nghệ',
          'Sơn mài truyền thống': 'Thủ công mỹ nghệ',
          'Làm gốm trắng': 'Thủ công mỹ nghệ',
        };
        const artisanCraft = exp.artisanId?.craft;
        const category = craftToCategoryMap[artisanCraft] || 'Thủ công mỹ nghệ';
        return category === activeCategory;
      });
    }

    if (selectedRegions.length > 0) {
      result = result.filter((exp) => {
        const location = exp.location;
        return selectedRegions.some((region) => location?.includes(region));
      });
    }

    result = result.filter((exp) => {
      const isHours = exp.duration?.unit === 'hour';
      const durationInDays = isHours ? 1 : exp.duration?.value || 1;
      return durationInDays <= maxDuration;
    });

    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (exp) =>
          exp.title?.toLowerCase().includes(lowerQuery) ||
          exp.description?.toLowerCase().includes(lowerQuery) ||
          exp.artisanId?.title?.toLowerCase().includes(lowerQuery)
      );
    }

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0));
    }

    setFilteredExperiences(result);
    setDisplayCount(6);
  }, [
    experiences,
    activeCategory,
    selectedRegions,
    maxDuration,
    searchQuery,
    sortBy,
  ]);

  const handleRegionChange = (region) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  return (
    <div className="experiences-page">
      {}
      <header className="experiences-page__header">
        <h1 className="experiences-page__title">Hành Trình Tinh Hoa</h1>
        <p className="experiences-page__subtitle">
          Kết nối với linh hồn Việt Nam qua những trải nghiệm đắm chìm được dẫn
          dắt bởi các nghệ nhân bậc thầy, nông dân bền vững và những người giữ
          gìn lịch sử truyền miệng.
        </p>
      </header>

      {}
      <div className="experiences-page__body">
        {}
        <aside className="experiences-page__sidebar">
          <div className="filter-block">
            <h3 className="filter-block__title">Danh mục</h3>
            <div className="filter-block__tags">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`filter-block__tag ${activeCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <h3 className="filter-block__title">Vùng miền</h3>
            <div className="filter-block__checkboxes">
              {regions.map((region) => (
                <label key={region} className="filter-block__checkbox-label">
                  <div className="filter-block__custom-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedRegions.includes(region)}
                      onChange={() => handleRegionChange(region)}
                    />
                    <div className="filter-block__checkbox-mark"></div>
                  </div>
                  <span className="filter-block__checkbox-text">{region}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <h3 className="filter-block__title">Thời lượng tối đa</h3>
            <div className="filter-block__slider-wrap">
              <input
                type="range"
                min="1"
                max="14"
                value={maxDuration}
                onChange={(e) => setMaxDuration(Number(e.target.value))}
                className="filter-block__slider"
              />
              <div className="filter-block__slider-labels">
                <span>1 Ngày</span>
                <span>14 Ngày</span>
              </div>
              <div className="filter-block__slider-current">
                Đang chọn: Lên đến <strong>{maxDuration}</strong> ngày
              </div>
            </div>
          </div>
        </aside>

        {}
        <main className="experiences-page__main">
          <div className="experiences-page__toolbar">
            <div className="experiences-page__search">
              <Search className="icon" />
              <input
                type="text"
                placeholder="Tìm kiếm trải nghiệm, nghệ nhân..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="experiences-page__actions">
              <span className="experiences-page__results-count">
                {filteredExperiences.length} KẾT QUẢ
              </span>
              <div className="experiences-page__sort">
                <span>Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">Phù hợp nhất</option>
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="price_asc">Giá: Thấp đến Cao</option>
                  <option value="price_desc">Giá: Cao đến Thấp</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="experiences-page__loading">
              <div className="spinner"></div>
            </div>
          ) : filteredExperiences.length > 0 ? (
            <>
              <div className="experiences-page__grid">
                {filteredExperiences.slice(0, displayCount).map((exp) => (
                  <ExperienceCard
                    key={exp._id}
                    experience={exp}
                    fromCheckout={fromCheckout}
                    currentItems={currentItems}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="experiences-page__empty">
              <MapPin className="icon" />
              <h3>Không tìm thấy kết quả</h3>
              <p>
                Vui lòng thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('Tất cả');
                  setSelectedRegions([]);
                  setMaxDuration(14);
                }}
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

          {displayCount < filteredExperiences.length && (
            <div className="experiences-page__loadmore">
              <button
                className=""
                onClick={() => setDisplayCount((prev) => prev + 6)}
              >
                Tải thêm trải nghiệm ({displayCount} /{' '}
                {filteredExperiences.length})
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

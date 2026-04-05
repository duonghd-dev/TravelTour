import React, { useState, useEffect } from 'react';
import { Search, Star, MapPin, Clock, Users, Heart } from 'lucide-react';

const STYLES = `
.experiences-page { background-color: #fdf6f0; min-height: 100vh; font-family: system-ui, -apple-system, sans-serif; color: #4a2c1a; }
.experiences-page__header { max-width: 1152px; margin: 0 auto; padding: 4rem 1.5rem; text-align: center; }
@media (min-width: 768px) { .experiences-page__header { text-align: left; padding: 5rem 1.5rem; } }
.experiences-page__title { font-size: 2.25rem; font-weight: 800; color: #7a3e1a; margin-bottom: 1rem; letter-spacing: -0.025em; }
@media (min-width: 768px) { .experiences-page__title { font-size: 3rem; } }
.experiences-page__subtitle { font-size: 1.125rem; color: #7a5c3e; max-width: 42rem; line-height: 1.625; }
@media (min-width: 768px) { .experiences-page__subtitle { font-size: 1.25rem; } }
.experiences-page__body { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem 5rem; display: flex; flex-direction: column; gap: 2.5rem; align-items: flex-start; }
@media (min-width: 1024px) { .experiences-page__body { flex-direction: row; } }
.experiences-page__sidebar { width: 100%; display: flex; flex-direction: column; gap: 2.5rem; flex-shrink: 0; }
@media (min-width: 1024px) { .experiences-page__sidebar { width: 18rem; } }
.filter-block__title { font-size: 1.125rem; font-weight: 700; color: #7a3e1a; margin-bottom: 1rem; border-bottom: 1px solid #e8d4c0; padding-bottom: 0.5rem; }
.filter-block__tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.filter-block__tag { padding: 0.5rem 1rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; transition: all 0.2s; background: #f5e6d3; color: #7a3e1a; border: none; cursor: pointer; }
.filter-block__tag:hover { background: #d4b499; }
.filter-block__tag.active { background: #a05a2c; color: #fff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.filter-block__checkboxes { display: flex; flex-direction: column; gap: 0.75rem; }
.filter-block__checkbox-label { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; }
.filter-block__checkbox-label:hover .filter-block__checkbox-text { color: #a05a2c; }
.filter-block__checkbox-label:hover .filter-block__custom-checkbox { border-color: #a05a2c; }
.filter-block__custom-checkbox { position: relative; display: flex; align-items: center; justify-content: center; width: 1.25rem; height: 1.25rem; border-radius: 0.25rem; border: 2px solid #bfa07a; background: #fff; }
.filter-block__custom-checkbox input { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; }
.filter-block__checkbox-mark { display: none; width: 0.625rem; height: 0.625rem; background: #a05a2c; border-radius: 2px; }
.filter-block__custom-checkbox input:checked ~ .filter-block__checkbox-mark { display: block; }
.filter-block__checkbox-text { color: #4a2c1a; font-weight: 500; transition: color 0.2s; }
.filter-block__slider-wrap { padding: 0 0.25rem; }
.filter-block__slider { width: 100%; accent-color: #a05a2c; height: 0.5rem; background: #e8d4c0; border-radius: 0.5rem; appearance: auto; cursor: pointer; }
.filter-block__slider-labels { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; color: #bfa07a; margin-top: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
.filter-block__slider-current { margin-top: 0.5rem; font-size: 0.875rem; color: #7a5c3e; font-weight: 500; background: #f5e6d3; display: inline-block; padding: 0.25rem 0.75rem; border-radius: 0.5rem; }
.filter-block__slider-current strong { color: #a05a2c; font-weight: 700; }
.experiences-page__main { flex: 1; width: 100%; min-width: 0; }
.experiences-page__toolbar { display: flex; flex-direction: column; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 2rem; background: #fff; padding: 1rem; border-radius: 1rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); border: 1px solid #f5e6d3; }
@media (min-width: 768px) { .experiences-page__toolbar { flex-direction: row; } }
.experiences-page__search { position: relative; width: 100%; }
@media (min-width: 768px) { .experiences-page__search { width: 24rem; } }
.experiences-page__search .icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #9ca3af; width: 1.25rem; height: 1.25rem; }
.experiences-page__search input { width: 100%; padding: 0.75rem 1rem 0.75rem 3rem; border-radius: 0.75rem; border: 1px solid #e5e7eb; outline: none; color: #4a2c1a; transition: all 0.2s; box-sizing: border-box; }
.experiences-page__search input:focus { border-color: transparent; box-shadow: 0 0 0 2px #a05a2c; }
.experiences-page__actions { display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 1rem; }
@media (min-width: 768px) { .experiences-page__actions { width: auto; justify-content: flex-end; } }
.experiences-page__results-count { font-size: 0.875rem; font-weight: 700; color: #a05a2c; background: #fdf6f0; padding: 0.25rem 0.75rem; border-radius: 0.5rem; white-space: nowrap; }
.experiences-page__sort { display: flex; align-items: center; gap: 0.5rem; }
.experiences-page__sort span { font-size: 0.875rem; font-weight: 500; color: #6b7280; white-space: nowrap; }
.experiences-page__sort select { background: #f9fafb; border: 1px solid #e5e7eb; color: #4a2c1a; font-size: 0.875rem; border-radius: 0.75rem; padding: 0.625rem; outline: none; font-weight: 500; cursor: pointer; }
.experiences-page__sort select:focus { border-color: #a05a2c; box-shadow: 0 0 0 1px #a05a2c; }
.experiences-page__grid { display: grid; grid-template-columns: 1fr; gap: 2rem; margin-bottom: 3rem; }
@media (min-width: 1024px) { .experiences-page__grid { grid-template-columns: repeat(2, 1fr); } }
.experiences-page__loading { display: flex; justify-content: center; align-items: center; height: 16rem; }
.experiences-page__loading .spinner { width: 3rem; height: 3rem; border: 2px solid #a05a2c; border-bottom-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; }
.experiences-page__empty { text-align: center; padding: 5rem 0; background: #fff; border-radius: 1rem; border: 1px dashed #e8d4c0; }
.experiences-page__empty .icon { width: 3rem; height: 3rem; color: #d4b499; margin: 0 auto 1rem; }
.experiences-page__empty h3 { font-size: 1.25rem; font-weight: 700; color: #7a3e1a; margin-bottom: 0.5rem; }
.experiences-page__empty p { color: #7a5c3e; margin-bottom: 1.5rem; }
.experiences-page__empty button { color: #a05a2c; font-weight: 700; background: none; border: none; cursor: pointer; }
.experiences-page__empty button:hover { text-decoration: underline; }
.experiences-page__loadmore { display: flex; justify-content: center; }
.experiences-page__loadmore button { border: 2px solid #a05a2c; color: #a05a2c; background: transparent; padding: 0.75rem 2rem; border-radius: 0.75rem; font-weight: 700; transition: all 0.2s; cursor: pointer; }
.experiences-page__loadmore button:hover { background: #a05a2c; color: #fff; }
.experience-card { background: #fff; border-radius: 1rem; overflow: hidden; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); border: 1px solid #f5e6d3; display: flex; flex-direction: column; cursor: pointer; transition: all 0.3s; height: 100%; }
.experience-card:hover { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
.experience-card:hover .experience-card__image { transform: scale(1.05); }
.experience-card:hover .experience-card__title { color: #a05a2c; }
.experience-card__image-wrapper { position: relative; height: 16rem; overflow: hidden; background: #e5e7eb; }
.experience-card__image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s; }
.experience-card__badge { position: absolute; top: 1rem; left: 1rem; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(4px); color: #7a3e1a; font-size: 0.65rem; font-weight: 700; padding: 0.375rem 0.75rem; border-radius: 9999px; letter-spacing: 0.05em; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
@media (min-width: 768px) { .experience-card__badge { font-size: 0.75rem; } }
.experience-card__favorite { position: absolute; top: 1rem; right: 1rem; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(4px); padding: 0.5rem; border-radius: 9999px; border: none; cursor: pointer; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); transition: all 0.3s; z-index: 10; display: flex; align-items: center; justify-content: center; }
.experience-card__favorite:hover { transform: scale(1.1); }
.experience-card__favorite .icon { width: 1.25rem; height: 1.25rem; transition: color 0.3s; color: #9ca3af; }
.experience-card__favorite.active .icon { fill: #ef4444; color: #ef4444; }
.experience-card__favorite:not(.active):hover .icon { color: #ef4444; }
.experience-card__rating { position: absolute; bottom: 1rem; right: 1rem; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(4px); padding: 0.375rem 0.625rem; border-radius: 0.5rem; display: flex; align-items: center; gap: 0.25rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.experience-card__rating .icon { width: 1rem; height: 1rem; fill: #facc15; color: #facc15; }
.experience-card__rating .score { font-size: 0.875rem; font-weight: 700; color: #1f2937; }
.experience-card__rating .count { font-size: 0.75rem; color: #6b7280; }
.experience-card__content { padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1; }
.experience-card__artisan { font-size: 0.75rem; font-weight: 600; color: #a05a2c; margin-bottom: 0.375rem; display: flex; align-items: center; gap: 0.375rem; text-transform: uppercase; letter-spacing: 0.025em; }
.experience-card__artisan::before { content: ''; width: 1rem; height: 1px; background: #a05a2c; }
.experience-card__title { font-size: 1.25rem; font-weight: 700; color: #4a2c1a; margin-bottom: 0.75rem; transition: color 0.2s; line-height: 1.25; }
.experience-card__meta { display: flex; flex-wrap: wrap; align-items: center; column-gap: 1rem; row-gap: 0.5rem; font-size: 0.75rem; font-weight: 500; color: #4b5563; margin-bottom: 1rem; }
.experience-card__meta .meta-item { display: flex; align-items: center; gap: 0.375rem; }
.experience-card__meta .meta-item .icon { width: 0.875rem; height: 0.875rem; color: #bfa07a; }
.experience-card__timeslots { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
.experience-card__timeslots .slot { font-size: 0.625rem; font-weight: 700; background: #fdf6f0; color: #7a3e1a; padding: 0.25rem 0.5rem; border-radius: 0.375rem; border: 1px solid #e8d4c0; }
.experience-card__quote { font-style: italic; color: #7a5c3e; font-size: 0.8125rem; margin-bottom: 0.75rem; border-left: 2px solid #d4b499; padding-left: 0.75rem; line-height: 1.625; }
.experience-card__desc { color: #4b5563; font-size: 0.875rem; margin-bottom: 1.5rem; line-height: 1.625; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.experience-card__footer { margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 1.25rem; border-top: 1px solid #f3f4f6; }
.experience-card__price .label { font-size: 0.625rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; display: block; margin-bottom: 0.125rem; }
.experience-card__price .value { font-size: 1.5rem; font-weight: 700; color: #7a3e1a; display: flex; align-items: flex-end; gap: 0.25rem; line-height: 1; }
.experience-card__price .unit { font-size: 0.875rem; font-weight: 400; color: #6b7280; margin-bottom: 0.125rem; }
.experience-card__book-btn { background: #f5e6d3; color: #7a3e1a; padding: 0.625rem 1.25rem; border-radius: 0.75rem; font-weight: 700; font-size: 0.875rem; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.experience-card__book-btn:hover { background: #a05a2c; color: #fff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

// ==========================================
// 1. MÔ PHỎNG DỮ LIỆU TỪ DATABASE (MONGODB)
// ==========================================
const DB_MOCK_DATA = [
  {
    _id: '60d21b4667d0d8992e610c85',
    artisanId: {
      _id: 'art1',
      category: 'Thủ công mỹ nghệ',
      province: 'Miền Bắc',
      name: 'Nghệ nhân Đinh Văn Thắng',
    },
    title: 'Phục hưng Gốm Bát Tràng',
    description:
      'Khóa học đắm chìm 3 ngày tại đồng bằng sông Hồng, khám phá các kỹ thuật tráng men cổ xưa cùng nghệ nhân làm gốm lâu năm.',
    price: 340,
    duration: { value: 3, unit: 'day' },
    maxGuests: 10,
    timeSlots: ['08:00 AM', '02:00 PM'],
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    ],
    badge: 'CHUỖI DI SẢN VĂN HÓA',
    quote: 'Đất sét ghi nhớ đôi bàn tay đã tạo hình nên nó.',
    location: 'Hà Nội',
    ratingAverage: 4.9,
    totalReviews: 128,
  },
  {
    _id: '60d21b4667d0d8992e610c86',
    artisanId: {
      _id: 'art2',
      category: 'Cảnh quan & Nông nghiệp',
      province: 'Tây Nguyên',
      name: 'Già làng Y Khưng',
    },
    title: 'Khám phá Vùng cao Sapa',
    description:
      "Được hướng dẫn bởi những người già bản H'Mông qua những con đèo bí mật và đồi chè hữu cơ.",
    price: 285,
    duration: { value: 2, unit: 'day' },
    maxGuests: 8,
    timeSlots: ['07:30 AM'],
    images: [
      'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    ],
    badge: '100% TRỰC TIẾP CHO CỘNG ĐỒNG',
    quote: 'Chúng ta không thừa kế đất đai, chúng ta mượn nó.',
    location: 'Lào Cai',
    ratingAverage: 4.7,
    totalReviews: 95,
  },
  {
    _id: '60d21b4667d0d8992e610c87',
    artisanId: {
      _id: 'art3',
      category: 'Ẩm thực truyền thống',
      province: 'Miền Trung',
      name: 'Cô Tôn Nữ Ánh Tuyết',
    },
    title: 'Bí mật Ẩm thực Cung đình Huế',
    description:
      'Mở khóa những hồ sơ gia vị phức tạp của nhà bếp hoàng gia cùng hậu duệ của các đầu bếp cung đình.',
    price: 190,
    duration: { value: 4, unit: 'hour' },
    maxGuests: 5,
    timeSlots: ['09:00 AM', '03:00 PM', '06:00 PM'],
    images: [
      'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80',
    ],
    badge: 'TRẢI NGHIỆM ĐỘC QUYỀN',
    quote: 'Mỗi công thức nấu ăn là một câu chuyện để chia sẻ.',
    location: 'Thừa Thiên Huế',
    ratingAverage: 5.0,
    totalReviews: 210,
  },
  {
    _id: '60d21b4667d0d8992e610c88',
    artisanId: {
      _id: 'art4',
      category: 'Thủ công mỹ nghệ',
      province: 'Tây Bắc',
      name: 'Nghệ nhân Sùng Thị Lan',
    },
    title: 'Nghệ thuật Nhuộm Chàm',
    description:
      'Tham gia vào quá trình lên men chàm nhiều giai đoạn và truyền thống nhuộm sáp ong chống thấm.',
    price: 155,
    duration: { value: 1, unit: 'day' },
    maxGuests: 12,
    timeSlots: ['08:30 AM', '01:30 PM'],
    images: [
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    ],
    badge: 'BẢO TỒN NGHỀ CỔ',
    quote: 'Màu xanh là màu của sự kiên nhẫn và trái tim.',
    location: 'Hà Giang',
    ratingAverage: 4.8,
    totalReviews: 64,
  },
];

// ==========================================
// 2. COMPONENT EXPERIENCE CARD
// ==========================================
const ExperienceCard = ({ experience }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="experience-card group">
      {/* Hình ảnh */}
      <div className="experience-card__image-wrapper">
        <img
          src={experience.images[0] || 'https://via.placeholder.com/600'}
          alt={experience.title}
          className="experience-card__image"
        />

        {experience.badge && (
          <div className="experience-card__badge">{experience.badge}</div>
        )}

        <button
          onClick={handleFavoriteClick}
          className={`experience-card__favorite ${isFavorite ? 'active' : ''}`}
        >
          <Heart className="icon" />
        </button>

        <div className="experience-card__rating">
          <Star className="icon" />
          <span className="score">{experience.ratingAverage}</span>
          <span className="count">({experience.totalReviews})</span>
        </div>
      </div>

      {/* Nội dung chi tiết */}
      <div className="experience-card__content">
        <div className="experience-card__artisan">
          Bởi {experience.artisanId.name}
        </div>

        <h3 className="experience-card__title">{experience.title}</h3>

        <div className="experience-card__meta">
          <div className="meta-item">
            <MapPin className="icon" />
            {experience.location}
          </div>
          <div className="meta-item">
            <Clock className="icon" />
            {experience.duration.value}{' '}
            {experience.duration.unit === 'day' ? 'Ngày' : 'Giờ'}
          </div>
          <div className="meta-item">
            <Users className="icon" />
            Tối đa {experience.maxGuests} khách/slot
          </div>
        </div>

        {experience.timeSlots && experience.timeSlots.length > 0 && (
          <div className="experience-card__timeslots">
            {experience.timeSlots.map((slot, index) => (
              <span key={index} className="slot">
                {slot}
              </span>
            ))}
          </div>
        )}

        {experience.quote && (
          <p className="experience-card__quote">"{experience.quote}"</p>
        )}

        <p className="experience-card__desc">{experience.description}</p>

        {/* Giá & Nút Đặt chỗ */}
        <div className="experience-card__footer">
          <div className="experience-card__price">
            <span className="label">Giá từ</span>
            <div className="value">
              ${experience.price}
              <span className="unit">/người</span>
            </div>
          </div>
          <button className="experience-card__book-btn">Đặt Chỗ Ngay</button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================
export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [maxDuration, setMaxDuration] = useState(14);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

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
        setTimeout(() => {
          setExperiences(DB_MOCK_DATA);
          setFilteredExperiences(DB_MOCK_DATA);
          setIsLoading(false);
        }, 600);
      } catch (error) {
        console.error('Lỗi khi tải trải nghiệm:', error);
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  useEffect(() => {
    let result = [...experiences];

    if (activeCategory !== 'Tất cả') {
      result = result.filter(
        (exp) => exp.artisanId.category === activeCategory
      );
    }

    if (selectedRegions.length > 0) {
      result = result.filter(
        (exp) =>
          selectedRegions.includes(exp.artisanId.province) ||
          selectedRegions.includes(exp.location)
      );
    }

    result = result.filter((exp) => {
      const isHours = exp.duration.unit === 'hour';
      const durationInDays = isHours ? 1 : exp.duration.value;
      return durationInDays <= maxDuration;
    });

    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (exp) =>
          exp.title.toLowerCase().includes(lowerQuery) ||
          exp.description.toLowerCase().includes(lowerQuery) ||
          exp.artisanId.name.toLowerCase().includes(lowerQuery)
      );
    }

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.ratingAverage - a.ratingAverage);
    }

    setFilteredExperiences(result);
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
    <>
      <style>{STYLES}</style>
      <div className="experiences-page">
        {/* Header */}
        <header className="experiences-page__header">
          <h1 className="experiences-page__title">Hành Trình Tinh Hoa</h1>
          <p className="experiences-page__subtitle">
            Kết nối với linh hồn Việt Nam qua những trải nghiệm đắm chìm được
            dẫn dắt bởi các nghệ nhân bậc thầy, nông dân bền vững và những người
            giữ gìn lịch sử truyền miệng.
          </p>
        </header>

        {/* Main Body */}
        <div className="experiences-page__body">
          {/* Sidebar */}
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
                    <span className="filter-block__checkbox-text">
                      {region}
                    </span>
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

          {/* Main Area */}
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
              <div className="experiences-page__grid">
                {filteredExperiences.map((exp) => (
                  <ExperienceCard key={exp._id} experience={exp} />
                ))}
              </div>
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

            {filteredExperiences.length > 0 && (
              <div className="experiences-page__loadmore">
                <button>Tải thêm trải nghiệm</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

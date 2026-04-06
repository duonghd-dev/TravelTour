import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ArtisanCard from '../components/ArtisanCard';
import { artisanApi } from '../api/artisanApi';
import './ArtisansListPage.scss';

const removeAccents = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
};

const ArtisansListPage = () => {
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    category: 'Tất cả',
    province: 'Tất cả',
    isVerified: false,
  });

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        setLoading(true);
        const response = await artisanApi.getAllArtisans();
        const data = response.data || response || [];
        setArtisans(data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách nghệ nhân:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);

  const categories = [
    'Tất cả',
    'Silk Weaving',
    'Ceramics',
    'Woodworking',
    'Embroidery',
  ];
  const provinces = ['Tất cả', 'Hà Nội', 'Huế', 'Đà Nẵng', 'Hội An'];

  const filteredArtisans = artisans.filter((a) => {
    const searchStr = removeAccents(search);
    const targetStr = removeAccents(
      `${a.userId?.firstName} ${a.userId?.lastName} ${a.craft} ${a.category} ${a.province} ${a.village || ''}`
    );
    const matchSearch = targetStr.includes(searchStr);

    const matchCat =
      filters.category === 'Tất cả' || a.category === filters.category;
    const matchProv =
      filters.province === 'Tất cả' || a.province === filters.province;
    const matchVer = !filters.isVerified || a.isVerified;

    return matchSearch && matchCat && matchProv && matchVer;
  });

  const clearFilters = () => {
    setSearch('');
    setFilters({ category: 'Tất cả', province: 'Tất cả', isVerified: false });
  };

  const handleNavigate = (id) => {
    navigate(`/artisan/${id}`);
  };

  return (
    <div
      style={{
        background: '#fdf6f0',
        minHeight: '100vh',
        paddingBottom: '100px',
        overflowX: 'hidden',
      }}
    >
      {/* Hero Header */}
      <header className="hero-header" style={{ marginBottom: '60px' }}>
        <div className="hero-header__cover" style={{ height: '350px' }}>
          <img
            src="https://images.unsplash.com/photo-1518060875936-cefa7d716270?auto=format&fit=crop&w=1920&q=80"
            alt="Hero"
          />
        </div>
        <div
          className="container"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <div
            style={{ textAlign: 'center', color: 'white', maxWidth: '800px' }}
          >
            <h1
              style={{
                fontSize: '3.5rem',
                color: 'white',
                textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                marginBottom: '16px',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Kết Nối Di Sản
            </h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.6 }}>
              Khám phá các nghệ nhân ưu tú và tham gia vào những trải nghiệm thủ
              công độc bản được thiết kế riêng.
            </p>
          </div>
        </div>
      </header>

      <main className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: '40px',
            alignItems: 'start',
          }}
        >
          {/* Filters Sidebar */}
          <aside className="filters-wrapper">
            <h3
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.2rem',
                marginBottom: '24px',
              }}
            >
              Khám Phá
            </h3>

            <div className="search-box">
              <Search size={20} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Tên, nghề, địa danh..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <X
                  size={16}
                  color="var(--text-muted)"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSearch('')}
                />
              )}
            </div>

            <div className="filter-group">
              <span className="filter-label">Danh Mục Nghề</span>
              {categories.map((cat) => (
                <label key={cat} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === cat}
                    onChange={() => setFilters({ ...filters, category: cat })}
                  />
                  {cat === 'Silk Weaving'
                    ? 'Dệt Lụa'
                    : cat === 'Ceramics'
                      ? 'Gốm Sứ'
                      : cat === 'Woodworking'
                        ? 'Mộc Mỹ Nghệ'
                        : cat === 'Embroidery'
                          ? 'Thêu Tay'
                          : cat}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <span className="filter-label">Tỉnh Thành</span>
              {provinces.map((prov) => (
                <label key={prov} className="filter-option">
                  <input
                    type="radio"
                    name="province"
                    checked={filters.province === prov}
                    onChange={() => setFilters({ ...filters, province: prov })}
                  />
                  {prov}
                </label>
              ))}
            </div>

            <div className="filter-group" style={{ borderBottom: 'none' }}>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.isVerified}
                  onChange={(e) =>
                    setFilters({ ...filters, isVerified: e.target.checked })
                  }
                />
                <span style={{ fontWeight: 500, color: 'var(--text-dark)' }}>
                  Chỉ hiện Heritage Verified
                </span>
              </label>
            </div>

            {(search ||
              filters.category !== 'Tất cả' ||
              filters.province !== 'Tất cả' ||
              filters.isVerified) && (
              <button
                className="btn btn--outline"
                style={{
                  width: '100%',
                  marginTop: '16px',
                  fontSize: '0.85rem',
                }}
                onClick={clearFilters}
              >
                Xóa Bộ Lọc
              </button>
            )}
          </aside>

          {/* Results Grid */}
          <div>
            <div
              style={{
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
                {!loading && filteredArtisans.length > 0
                  ? `Đã tìm thấy ${filteredArtisans.length} nghệ nhân`
                  : 'Không có kết quả'}
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '32px',
              }}
            >
              {loading ? (
                <div
                  style={{
                    textAlign: 'center',
                    gridColumn: '1 / -1',
                    padding: '50px 0',
                  }}
                >
                  <h3>Đang tải danh sách nghệ nhân...</h3>
                </div>
              ) : filteredArtisans.length > 0 ? (
                filteredArtisans.map((artisan) => (
                  <ArtisanCard
                    key={artisan._id}
                    artisan={artisan}
                    onClick={handleNavigate}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <Search size={48} strokeWidth={1} />
                  <h3>Không tìm thấy nghệ nhân phù hợp</h3>
                  <p>
                    Hãy thử thay đổi từ khóa tìm kiếm (ví dụ: tên, tỉnh thành)
                    hoặc bỏ bớt các bộ lọc để xem thêm kết quả nhé.
                  </p>
                  <button className="btn btn--outline" onClick={clearFilters}>
                    Tải lại danh sách
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtisansListPage;

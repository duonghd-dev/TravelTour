import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/contexts';
import ArtisanCard from '../components/ArtisanCard';
import ArtisanFilters from '../components/ArtisanFilters';
import { artisanApi } from '../api/artisanApi';
import './ArtisansListPage.scss';

const ArtisansListPage = () => {
  const toast = useToast();
  const [artisans, setArtisans] = useState([]);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    craft: '',
    province: '',
    isVerified: false,
    sort: 'relevance',
  });

  const itemsPerPage = 12;

  // Fetch artisans on mount and when filters change
  useEffect(() => {
    loadArtisans();
  }, [filters]);

  // Filter and search artisans
  useEffect(() => {
    filterAndSearchArtisans();
    setCurrentPage(1);
  }, [artisans, searchQuery, filters]);

  const loadArtisans = async () => {
    try {
      setLoading(true);
      const response = await artisanApi.getAllArtisans({
        category: filters.category,
        craft: filters.craft,
        province: filters.province,
        isVerified: filters.isVerified || undefined,
      });

      const data = response.data || [];
      setArtisans(data);
    } catch (error) {
      console.error('Error loading artisans:', error);
      toast?.error?.('Không thể tải danh sách nghệ nhân');
      setArtisans([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSearchArtisans = () => {
    let filtered = [...artisans];

    // Search by name or craft
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((artisan) => {
        const fullName =
          `${artisan.userId?.firstName} ${artisan.userId?.lastName}`.toLowerCase();
        const craft = artisan.craft?.toLowerCase() || '';
        return fullName.includes(query) || craft.includes(query);
      });
    }

    // Sort
    if (filters.sort === 'rating') {
      filtered.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0));
    } else if (filters.sort === 'experience') {
      filtered.sort(
        (a, b) => (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0)
      );
    } else if (filters.sort === 'reviews') {
      filtered.sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0));
    }

    setFilteredArtisans(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      craft: '',
      province: '',
      isVerified: false,
      sort: 'relevance',
    });
    setSearchQuery('');
  };

  const handleFavoriteClick = async (artisanId) => {
    // TODO: Implement favorite functionality
    toast?.success?.('Đã thêm vào danh sách yêu thích');
  };

  // Pagination
  const totalPages = Math.ceil(filteredArtisans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArtisans = filteredArtisans.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="artisans-page">
      {/* Hero Section */}
      <section className="artisans-hero">
        <div className="artisans-hero__content">
          <h1 className="artisans-hero__title">Discovered Masters</h1>
          <p className="artisans-hero__subtitle">
            Kết nối với lịch sử sủ sắc của Việt Nam thông qua sự điều luyện bên
            bi của các nghề nhân đi sâu, những người đang gìn giữ những kỳ thuật
            được truyền qua nhiều thế hệ.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <div className="artisans-page__search-section">
        <div className="artisans-page__search-wrapper">
          <div className="artisans-page__search-input">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search artisans by name or craft..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="artisans-page__container">
        {/* Sidebar Filters */}
        <aside className="artisans-page__sidebar">
          <ArtisanFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Artisans Grid */}
        <main className="artisans-page__main">
          {/* Results Count */}
          <div className="artisans-page__header">
            <h2 className="artisans-page__count">
              {filteredArtisans.length} artisans found
            </h2>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="artisans-page__loading">
              <div className="spinner"></div>
              <p>Đang tải danh sách nghệ nhân...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredArtisans.length === 0 && (
            <div className="artisans-page__empty">
              <div className="artisans-page__empty-icon">🎭</div>
              <h3>Không tìm thấy nghệ nhân</h3>
              <p>Hãy thử điều chỉnh bộ lọc của bạn</p>
            </div>
          )}

          {/* Artisans Grid */}
          {!loading && filteredArtisans.length > 0 && (
            <>
              <div className="artisans-grid">
                {paginatedArtisans.map((artisan) => (
                  <ArtisanCard
                    key={artisan._id}
                    artisan={artisan}
                    onFavoriteClick={handleFavoriteClick}
                    isFavorited={false}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="artisans-page__pagination">
                  <button
                    className="artisans-page__pagination-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    type="button"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="artisans-page__pagination-pages">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          className={`artisans-page__pagination-page ${
                            currentPage === page ? 'active' : ''
                          }`}
                          onClick={() => setCurrentPage(page)}
                          type="button"
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    className="artisans-page__pagination-btn"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    type="button"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ArtisansListPage;

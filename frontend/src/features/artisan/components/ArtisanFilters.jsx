import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import './ArtisanFilters.scss';

const ArtisanFilters = ({ filters, onFilterChange, onReset }) => {
  const [expandedFilter, setExpandedFilter] = useState(null);

  const categories = [
    'All Categories',
    'Silk Weaving',
    'Ceramics',
    'Woodworking',
    'Lacquerwork',
    'Embroidery',
    'Stone Carving',
  ];

  const provinces = [
    'All Provinces',
    'Hà Nội',
    'TP. Hồ Chí Minh',
    'Huế',
    'Hội An',
    'Đà Nẵng',
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]:
        value === 'All Categories' || value === 'All Provinces' ? '' : value,
    });
  };

  const handleReset = () => {
    setExpandedFilter(null);
    onReset();
  };

  const toggleFilter = (filterName) => {
    setExpandedFilter(expandedFilter === filterName ? null : filterName);
  };

  const hasActiveFilters =
    filters.category || filters.craft || filters.province || filters.isVerified;

  return (
    <div className="artisan-filters">
      <div className="artisan-filters__header">
        <h3 className="artisan-filters__title">Filters</h3>
        {hasActiveFilters && (
          <button
            className="artisan-filters__reset"
            onClick={handleReset}
            type="button"
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="artisan-filters__group">
        <button
          className="artisan-filters__toggle"
          onClick={() => toggleFilter('category')}
          type="button"
        >
          <span>Craft Category</span>
          <ChevronDown
            size={18}
            className={`artisan-filters__icon ${
              expandedFilter === 'category' ? 'active' : ''
            }`}
          />
        </button>
        {expandedFilter === 'category' && (
          <div className="artisan-filters__options">
            {categories.map((cat) => (
              <label key={cat} className="artisan-filters__option">
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={
                    filters.category === ''
                      ? cat === 'All Categories'
                      : filters.category === cat
                  }
                  onChange={(e) =>
                    handleFilterChange('category', e.target.value)
                  }
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Province Filter */}
      <div className="artisan-filters__group">
        <button
          className="artisan-filters__toggle"
          onClick={() => toggleFilter('province')}
          type="button"
        >
          <span>Province</span>
          <ChevronDown
            size={18}
            className={`artisan-filters__icon ${
              expandedFilter === 'province' ? 'active' : ''
            }`}
          />
        </button>
        {expandedFilter === 'province' && (
          <div className="artisan-filters__options">
            {provinces.map((province) => (
              <label key={province} className="artisan-filters__option">
                <input
                  type="radio"
                  name="province"
                  value={province}
                  checked={
                    filters.province === ''
                      ? province === 'All Provinces'
                      : filters.province === province
                  }
                  onChange={(e) =>
                    handleFilterChange('province', e.target.value)
                  }
                />
                <span>{province}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Verification Filter */}
      <div className="artisan-filters__group">
        <label className="artisan-filters__checkbox">
          <input
            type="checkbox"
            checked={filters.isVerified || false}
            onChange={(e) =>
              handleFilterChange('isVerified', e.target.checked ? true : false)
            }
          />
          <span>Heritage Verified Only</span>
        </label>
      </div>

      {/* Sort */}
      <div className="artisan-filters__group">
        <button
          className="artisan-filters__toggle"
          onClick={() => toggleFilter('sort')}
          type="button"
        >
          <span>Sort By</span>
          <ChevronDown
            size={18}
            className={`artisan-filters__icon ${
              expandedFilter === 'sort' ? 'active' : ''
            }`}
          />
        </button>
        {expandedFilter === 'sort' && (
          <div className="artisan-filters__options">
            <label className="artisan-filters__option">
              <input
                type="radio"
                name="sort"
                value="relevance"
                checked={filters.sort === 'relevance' || filters.sort === ''}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              />
              <span>Relevance</span>
            </label>
            <label className="artisan-filters__option">
              <input
                type="radio"
                name="sort"
                value="rating"
                checked={filters.sort === 'rating'}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              />
              <span>Highest Rating</span>
            </label>
            <label className="artisan-filters__option">
              <input
                type="radio"
                name="sort"
                value="experience"
                checked={filters.sort === 'experience'}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              />
              <span>Most Experience</span>
            </label>
            <label className="artisan-filters__option">
              <input
                type="radio"
                name="sort"
                value="reviews"
                checked={filters.sort === 'reviews'}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              />
              <span>Most Reviews</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanFilters;

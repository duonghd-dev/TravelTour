import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { tourService } from '../api/tourService';
import TourCard from '../components/TourCard';
import './ExploreVietnamPage.scss';

export default function ExploreVietnamPage() {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [priceRange, setPriceRange] = useState(15000000);

  const regions = ['All', 'North', 'Central', 'South'];
  const durations = [
    { label: 'All', value: null },
    { label: '1 Day', value: 1 },
    { label: '2 Days', value: 2 },
  ];

  
  useEffect(() => {
    const fetchTours = async () => {
      setIsLoading(true);
      try {
        const data = await tourService.getAllTours();
        setTours(data);
        setFilteredTours(data);
      } catch (error) {
        console.error('Error fetching tours:', error);
        setTours([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, []);

  
  useEffect(() => {
    let result = [...tours];

    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.location.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    
    if (selectedRegion !== 'All') {
      result = result.filter((t) => t.region === selectedRegion);
    }

    
    if (selectedDuration !== 'All') {
      result = result.filter((t) => t.duration?.value === selectedDuration);
    }

    
    result = result.filter((t) => t.price <= priceRange);

    setFilteredTours(result);
  }, [tours, searchQuery, selectedRegion, selectedDuration, priceRange]);

  const handleNavigate = (id) => {
    navigate(`/tours/${id}`);
  };

  return (
    <div className="explore-page">
      {}
      <div className="explore-page__header">
        <div className="explore-page__header-content">
          <h1>Explore Vietnam</h1>
          <p>
            Discover captivating tours across Vietnam's most enchanting regions
          </p>

          <div className="explore-page__search-bar">
            <input
              type="text"
              placeholder="Search tours, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn-search">
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="explore-page__container">
        {/* Filters Sidebar */}
        <aside className="explore-page__sidebar">
          <h3>Filter Tours</h3>

          {/* Region Filter */}
          <div className="filter-section">
            <h4>Region</h4>
            {regions.map((region) => (
              <label key={region} className="filter-checkbox">
                <input
                  type="radio"
                  name="region"
                  checked={selectedRegion === region}
                  onChange={() => setSelectedRegion(region)}
                />
                <span>{region}</span>
              </label>
            ))}
          </div>

          {/* Duration Filter */}
          <div className="filter-section">
            <h4>Duration</h4>
            {durations.map((duration) => (
              <label key={duration.label} className="filter-checkbox">
                <input
                  type="radio"
                  name="duration"
                  checked={selectedDuration === duration.label}
                  onChange={() => setSelectedDuration(duration.label)}
                />
                <span>{duration.label}</span>
              </label>
            ))}
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <h4>Price Range</h4>
            <input
              type="range"
              min="300000"
              max="30000000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="price-slider"
            />
            <div className="price-display">
              <span>{new Intl.NumberFormat('vi-VN').format(300000)} đ</span>
              <span>{new Intl.NumberFormat('vi-VN').format(priceRange)} đ</span>
            </div>
          </div>

          <button
            className="btn-clear-filters"
            onClick={() => {
              setSearchQuery('');
              setSelectedRegion('All');
              setSelectedDuration('All');
              setPriceRange(300);
            }}
          >
            Clear Filters
          </button>
        </aside>

        {/* Main Content */}
        <main className="explore-page__main">
          <div className="explore-page__toolbar">
            <span className="explore-page__count">
              Showing {filteredTours.length} tours available
            </span>
            <select className="explore-page__sort">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Highest Rated</option>
            </select>
          </div>

          {isLoading ? (
            <div className="explore-page__loading">Loading tours...</div>
          ) : filteredTours.length > 0 ? (
            <div className="explore-page__grid">
              {filteredTours.map((tour) => (
                <TourCard
                  key={tour._id}
                  tour={tour}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>
          ) : (
            <div className="explore-page__empty">
              <p>No tours found. Try adjusting your filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

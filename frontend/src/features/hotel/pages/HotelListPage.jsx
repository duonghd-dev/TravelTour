import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { hotelService } from '../api/hotelService';
import HotelCard from '../components/HotelCard';
import './HotelListPage.scss';

export default function HotelListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(25000000);

  
  const fromCheckout = location.state?.fromCheckout || false;
  const currentItems = location.state?.currentItems || [];

  const categories = [
    'All',
    'Heritage Hotel',
    'Mountain Resort',
    'Gallery Hotel',
    'Coastal Resort',
    'Eco-Lodge',
  ];
  const locations = [
    'All',
    'Hue',
    'Hanoi',
    'Ho Chi Minh',
    'Da Nang',
    'Sapa',
    'Cam Ranh Bay',
  ];
  const [selectedLocation, setSelectedLocation] = useState('All');

  
  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      try {
        const data = await hotelService.getAllHotels();
        setHotels(data);
        setFilteredHotels(data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setHotels([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  
  useEffect(() => {
    let result = [...hotels];

    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(query) ||
          h.location.toLowerCase().includes(query) ||
          h.description.toLowerCase().includes(query)
      );
    }

    
    if (selectedCategory !== 'All') {
      result = result.filter((h) => h.category === selectedCategory);
    }

    
    if (selectedLocation !== 'All') {
      result = result.filter((h) => h.location === selectedLocation);
    }

    
    result = result.filter((h) => h.price <= priceRange);

    setFilteredHotels(result);
  }, [hotels, searchQuery, selectedCategory, selectedLocation, priceRange]);

  const handleNavigate = (id) => {
    navigate(`/hotels/${id}`);
  };

  return (
    <div className="hotel-list-page">
      {}
      <div className="hotel-list-page__header">
        <div className="hotel-list-page__header-content">
          <h1>Archived Stays</h1>
          <p>
            Discover heritage hotels and sustainable accommodations across
            Vietnam
          </p>

          <div className="hotel-list-page__search-bar">
            <input type="text" placeholder="Where to?" />
            <input type="date" placeholder="mm/dd/yyyy" />
            <input type="date" placeholder="mm/dd/yyyy" />
            <input type="number" placeholder="Add guests" />
            <button className="btn-discover">Discover</button>
          </div>
        </div>
      </div>

      <div className="hotel-list-page__container">
        {}
        <aside className="hotel-list-page__sidebar">
          <h3>Refine Search</h3>

          {}
          <div className="filter-section">
            <h4>Accommodation Type</h4>
            {categories.map((cat) => (
              <label key={cat} className="filter-checkbox">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat}
                  onChange={() => setSelectedCategory(cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>

          {}
          <div className="filter-section">
            <h4>Location</h4>
            {locations.map((loc) => (
              <label key={loc} className="filter-checkbox">
                <input
                  type="radio"
                  name="location"
                  checked={selectedLocation === loc}
                  onChange={() => setSelectedLocation(loc)}
                />
                <span>{loc}</span>
              </label>
            ))}
          </div>

          {}
          <div className="filter-section">
            <h4>Price Range</h4>
            <input
              type="range"
              min="100000"
              max="50000000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="price-slider"
            />
            <div className="price-display">
              <span>{new Intl.NumberFormat('vi-VN').format(100000)} đ</span>
              <span>{new Intl.NumberFormat('vi-VN').format(priceRange)} đ</span>
            </div>
          </div>

          <button
            className="btn-clear"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedLocation('All');
              setPriceRange(500);
            }}
          >
            Clear Filters
          </button>
        </aside>

        {}
        <main className="hotel-list-page__main">
          {}
          <div className="hotel-list-page__toolbar">
            <div className="search-input-group">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search hotels, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="results-info">
              <span>Showing {filteredHotels.length} heritage stays</span>
              <select defaultValue="impact">
                <option value="impact">Sort by: Impact Contribution</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {}
          {isLoading ? (
            <div className="hotel-list-page__loading">
              <div className="spinner"></div>
            </div>
          ) : filteredHotels.length > 0 ? (
            <div className="hotel-list-page__grid">
              {filteredHotels.map((hotel) => (
                <HotelCard
                  key={hotel._id}
                  hotel={hotel}
                  onClick={handleNavigate}
                  fromCheckout={fromCheckout}
                  currentItems={currentItems}
                />
              ))}
            </div>
          ) : (
            <div className="hotel-list-page__empty">
              <MapPin size={48} />
              <h3>No stays found</h3>
              <p>Try adjusting your filters or search query</p>
            </div>
          )}

          {}
          {filteredHotels.length > 0 && (
            <div className="hotel-list-page__load-more">
              <button className="btn-load-more">Load More Stays</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

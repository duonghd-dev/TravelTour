import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Heart, Star, ChevronLeft } from 'lucide-react';
import { hotelService } from '../api/hotelService';
import './HotelDetailPage.scss';

export default function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      try {
        const data = await hotelService.getHotelDetail(id);
        setHotel(data);
      } catch (error) {
        console.error('Error fetching hotel:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  if (loading) {
    return <div className="hotel-detail__loading">Loading...</div>;
  }

  if (!hotel) {
    return <div className="hotel-detail__error">Hotel not found</div>;
  }

  const handleBooking = () => {
    if (checkInDate && checkOutDate && guests && hotel) {
      // Calculate nights
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const totalPrice =
        (hotel.pricePerNight || hotel.price || 0) * nights * guests;

      navigate('/checkout', {
        state: {
          bookingData: {
            itemId: hotel._id,
            itemType: 'hotel',
            itemName: hotel.name,
            bookingDate: checkInDate,
            timeSlot: null,
            guestsCount: parseInt(guests),
            totalPrice: totalPrice,
          },
        },
      });
    }
  };

  return (
    <div className="hotel-detail">
      {/* Hero Banner */}
      <div
        className="hotel-detail__banner"
        style={{
          backgroundImage: `url(${hotel.images[0]})`,
        }}
      >
        <button className="hotel-detail__back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <div className="hotel-detail__banner-overlay">
          <div className="hotel-detail__banner-content">
            <span className="hotel-detail__badge">{hotel.badge}</span>
            <h1 className="hotel-detail__title">
              {hotel.hero?.title || hotel.name}
            </h1>
            <p className="hotel-detail__subtitle">
              {hotel.hero?.subtitle || hotel.description}
            </p>
          </div>
        </div>
      </div>

      <div className="hotel-detail__container">
        {/* Main Content */}
        <div className="hotel-detail__main">
          {/* Story */}
          <section className="hotel-detail__section">
            <h2>{hotel.story?.title || 'The Story'}</h2>
            <p>{hotel.story?.content || ''}</p>
            {hotel.story?.details && <p>{hotel.story.details}</p>}
          </section>

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <section className="hotel-detail__section">
              <h2>Heritage Amenities</h2>
              <div className="hotel-detail__amenities">
                {hotel.amenities.map((amenity, idx) => (
                  <div key={idx} className="amenity-card">
                    <div className="amenity-icon">{amenity.icon}</div>
                    <h4>{amenity.name}</h4>
                    <p>{amenity.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Cultural Impact */}
          {hotel.culturalImpact && (
            <section className="hotel-detail__section hotel-detail__cultural-impact">
              <h2>{hotel.culturalImpact.title}</h2>
              <p>{hotel.culturalImpact.description}</p>
              <div className="impact-stats">
                <div className="stat">
                  <span className="stat-value">
                    {hotel.culturalImpact.impact}
                  </span>
                  <span className="stat-label">contribution/stay</span>
                </div>
                <div className="stat">
                  <span className="stat-value">
                    {hotel.culturalImpact.artisans}
                  </span>
                  <span className="stat-label">artisans supported</span>
                </div>
              </div>
            </section>
          )}

          {/* Gallery */}
          {hotel.gallery && hotel.gallery.length > 0 && (
            <section className="hotel-detail__section">
              <h2>The Heritage Archive</h2>
              <div className="hotel-detail__gallery">
                {hotel.gallery.map((img, idx) => (
                  <div key={idx} className="gallery-item">
                    <img src={img} alt={`Gallery ${idx}`} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          {hotel.reviewList && hotel.reviewList.length > 0 && (
            <section className="hotel-detail__section">
              <h2>Guest Reflections</h2>
              <div className="hotel-detail__reviews">
                {hotel.reviewList.map((review, idx) => (
                  <div key={idx} className="review-card">
                    <div className="review-rating">
                      {'⭐'.repeat(review.rating)}
                    </div>
                    <p className="review-text">"{review.text}"</p>
                    <p className="review-author">— {review.author}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar - Booking */}
        <aside className="hotel-detail__sidebar">
          <div className="booking-box">
            <div className="booking-price">
              <span className="label">Price per night</span>
              <span className="value">
                {new Intl.NumberFormat('vi-VN').format(hotel.price)} đ
              </span>
            </div>

            <div className="booking-form">
              <div className="form-group">
                <label>Check-in</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Check-out</label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Guests</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>
            </div>

            <button className="btn-reserve" onClick={handleBooking}>
              Reserve Your Stay
            </button>

            <div className="booking-benefits">
              <div className="benefit">
                <span>✓</span>
                <span>Verified Heritage Hotel</span>
              </div>
              <div className="benefit">
                <span>✓</span>
                <span>Community Impact Contribution</span>
              </div>
            </div>

            <div className="booking-info">
              <h4>Quick Info</h4>
              <div className="info-item">
                <MapPin size={16} />
                <span>{hotel.location}</span>
              </div>
              <div className="info-item">
                <Star size={16} />
                <span>
                  {hotel.rating} ({hotel.reviews || 0} reviews)
                </span>
              </div>
              <button
                className={`btn-favorite ${isFavorite ? 'active' : ''}`}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart size={20} />
                {isFavorite ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

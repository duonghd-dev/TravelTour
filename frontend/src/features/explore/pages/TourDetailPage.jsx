import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faCheck,
  faLandmark,
  faShip,
  faAward,
  faHome,
  faSeedling,
  faDragon,
  faBiking,
  faMountain,
  faLeaf,
} from '@fortawesome/free-solid-svg-icons';
import {
  MapPin,
  Heart,
  Star,
  ChevronLeft,
  Clock,
  Users,
  CheckCircle,
} from 'lucide-react';
import { tourService } from '../api/tourService';
import './TourDetailPage.scss';

// Mapping FontAwesome icon name to icon object
const iconNameMap = {
  faLandmark,
  faShip,
  faAward,
  faHome,
  faSeedling,
  faDragon,
  faBiking,
  faMountain,
  faLeaf,
  faCheck,
  faStar,
};

// Get icon from name
const getIcon = (iconName) => {
  if (typeof iconName === 'string' && iconNameMap[iconName]) {
    return iconNameMap[iconName];
  }
  return null;
};

export default function TourDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState('');
  const [guests, setGuests] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      setLoading(true);
      try {
        const data = await tourService.getTourDetail(id);
        setTour(data);

        setGuests(String(data.minParticipants || 1));
      } catch (error) {
        console.error('Error fetching tour:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  if (loading) {
    return <div className="tour-detail__loading">Loading...</div>;
  }

  if (!tour) {
    return <div className="tour-detail__error">Tour not found</div>;
  }

  const handleBooking = () => {
    const guestsNumber = parseInt(guests);

    if (guestsNumber < tour.minParticipants) {
      alert(`Tối thiểu ${tour.minParticipants} khách mỗi tour`);
      return;
    }

    if (guestsNumber > tour.maxParticipants) {
      alert(`Tối đa ${tour.maxParticipants} khách mỗi tour`);
      return;
    }

    if (checkInDate && guests && tour) {
      const durationDays = tour.duration?.value || 1;
      const totalPrice =
        (tour.pricePerPerson || tour.price || 0) * durationDays * guestsNumber;

      navigate('/checkout', {
        state: {
          bookingData: {
            itemId: tour._id,
            itemType: 'tour',
            itemName: tour.title || tour.name,
            bookingDate: checkInDate,
            timeSlot: null,
            guestsCount: guestsNumber,
            totalPrice: totalPrice,
            minParticipants: tour.minParticipants || 1,
            maxParticipants: tour.maxParticipants || 20,
          },
        },
      });
    }
  };

  return (
    <div className="tour-detail">
      {}
      <div
        className="tour-detail__banner"
        style={{
          backgroundImage: `url(${tour.images?.[0]})`,
        }}
      >
        <button className="tour-detail__back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <div className="tour-detail__banner-overlay">
          <div className="tour-detail__banner-content">
            <span className="tour-detail__badge">{tour.badge}</span>
            <h1 className="tour-detail__title">{tour.title}</h1>
            <p className="tour-detail__subtitle">{tour.description}</p>
          </div>
        </div>
      </div>

      <div className="tour-detail__container">
        {}
        <div className="tour-detail__main">
          {}
          <section className="tour-detail__section">
            <h2>Tour Overview</h2>
            <div className="tour-detail__overview">
              <div className="overview-item">
                <MapPin size={24} />
                <div>
                  <h4>Location</h4>
                  <p>{tour.location}</p>
                </div>
              </div>
              <div className="overview-item">
                <Clock size={24} />
                <div>
                  <h4>Duration</h4>
                  <p>
                    {tour.duration?.value} {tour.duration?.unit}
                  </p>
                </div>
              </div>
              <div className="overview-item">
                <Users size={24} />
                <div>
                  <h4>Group Size</h4>
                  <p>
                    {tour.minParticipants}-{tour.maxParticipants} guests
                  </p>
                </div>
              </div>
              <div className="overview-item">
                <Star size={24} />
                <div>
                  <h4>Rating</h4>
                  <p>
                    {tour.rating} ({tour.reviews} reviews)
                  </p>
                </div>
              </div>
            </div>
          </section>

          {}
          {tour.highlights && tour.highlights.length > 0 && (
            <section className="tour-detail__section">
              <h2>Tour Highlights</h2>
              <div className="tour-detail__highlights">
                {tour.highlights.map((highlight, idx) => {
                  const icon = getIcon(highlight.icon);
                  return (
                    <div key={idx} className="highlight-card">
                      <div className="highlight-icon">
                        {icon ? (
                          <FontAwesomeIcon icon={icon} />
                        ) : (
                          <span className="icon-placeholder">✨</span>
                        )}
                      </div>
                      <h4>{highlight.title}</h4>
                      <p>{highlight.description}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <section className="tour-detail__section">
              <h2>Detailed Itinerary</h2>
              <div className="tour-detail__itinerary">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="itinerary-day">
                    <h3>
                      Day {day.day}: {day.title}
                    </h3>
                    <p className="day-description">{day.description}</p>

                    {day.activities && day.activities.length > 0 && (
                      <div className="day-items">
                        <h4>Activities:</h4>
                        <ul>
                          {day.activities.map((activity, idx) => (
                            <li key={idx}>
                              <CheckCircle size={16} />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {day.meals && day.meals.length > 0 && (
                      <div className="day-items">
                        <h4>Meals:</h4>
                        <span className="meals-tag">
                          {day.meals.join(', ').toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {}
          {tour.included && tour.included.length > 0 && (
            <section className="tour-detail__section">
              <h2>What's Included</h2>
              <div className="included-list">
                {tour.included.map((item, idx) => (
                  <div key={idx} className="included-item">
                    <CheckCircle size={20} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* What to Bring */}
          {tour.whatToBring && tour.whatToBring.length > 0 && (
            <section className="tour-detail__section">
              <h2>What to Bring</h2>
              <ul className="bring-list">
                {tour.whatToBring.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Tour Information */}
          <section className="tour-detail__section">
            <h2>Tour Information</h2>
            <div className="info-grid">
              <div className="info-card">
                <h4>Difficulty Level</h4>
                <p className="difficulty-badge moderate">Moderate</p>
              </div>
              <div className="info-card">
                <h4>Tour Type</h4>
                <p>Guided Group Tour</p>
              </div>
              <div className="info-card">
                <h4>Group Size</h4>
                <p>
                  {tour.minParticipants}-{tour.maxParticipants} guests
                </p>
              </div>
              <div className="info-card">
                <h4>Language</h4>
                <p>English & Vietnamese</p>
              </div>
              <div className="info-card">
                <h4>Confirmation</h4>
                <p>Within 24 hours</p>
              </div>
              <div className="info-card">
                <h4>Meeting Point</h4>
                <p>{tour.location} City Center</p>
              </div>
            </div>
          </section>

          {/* Cancellation Policy */}
          <section className="tour-detail__section">
            <h2>Cancellation & Refund Policy</h2>
            <div className="policy-list">
              <div className="policy-item">
                <span className="policy-label">30+ days before</span>
                <span className="policy-text">Full refund</span>
              </div>
              <div className="policy-item">
                <span className="policy-label">14-29 days before</span>
                <span className="policy-text">75% refund</span>
              </div>
              <div className="policy-item">
                <span className="policy-label">7-13 days before</span>
                <span className="policy-text">50% refund</span>
              </div>
              <div className="policy-item">
                <span className="policy-label">Less than 7 days</span>
                <span className="policy-text">No refund</span>
              </div>
            </div>
          </section>

          {/* What's Not Included */}
          <section className="tour-detail__section">
            <h2>What's Not Included</h2>
            <ul className="bring-list">
              <li>Personal travel insurance</li>
              <li>International flights</li>
              <li>Visa fees</li>
              <li>Additional activities not mentioned</li>
              <li>Personal expenses and tips</li>
            </ul>
          </section>

          {/* Reviews */}
          {tour.reviewList && tour.reviewList.length > 0 && (
            <section className="tour-detail__section">
              <h2>Guest Reviews</h2>
              <div className="review-summary">
                <div className="rating-display">
                  <div className="rating-score">{tour.rating}</div>
                  <div className="rating-stars">
                    {Array.from({ length: Math.round(tour.rating) }).map(
                      (_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          className="star-icon"
                        />
                      )
                    )}
                  </div>
                  <div className="rating-count">
                    Based on {tour.reviews} reviews
                  </div>
                </div>
              </div>
              <div className="tour-detail__reviews">
                {tour.reviewList.map((review, idx) => (
                  <div key={idx} className="review-card">
                    <div className="review-header">
                      <div className="review-rating">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            className="star-icon"
                          />
                        ))}
                      </div>
                      <span className="review-author">{review.author}</span>
                    </div>
                    <p className="review-text">"{review.text}"</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQ Section */}
          <section className="tour-detail__section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
              <div className="faq-item">
                <h4>Do you provide transportation to the meeting point?</h4>
                <p>
                  We provide transfer from main hotels in {tour.location}.
                  Additional transfer can be arranged for a fee.
                </p>
              </div>
              <div className="faq-item">
                <h4>Is this tour suitable for children?</h4>
                <p>
                  Yes! Tours are family-friendly. Children should be accompanied
                  by adults at all times.
                </p>
              </div>
              <div className="faq-item">
                <h4>What should I bring?</h4>
                <p>
                  See "What to Bring" section above for a complete packing list.
                </p>
              </div>
              <div className="faq-item">
                <h4>Can I book a private tour?</h4>
                <p>
                  Yes, private tours available on request. Price varies based on
                  group size. Contact us for details.
                </p>
              </div>
              <div className="faq-item">
                <h4>Are meals vegetarian/gluten-free options available?</h4>
                <p>
                  Please inform us of dietary restrictions when booking. We do
                  our best to accommodate.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar - Booking */}
        <aside className="tour-detail__sidebar">
          <div className="booking-box">
            <div className="booking-price">
              <span className="label">Price per person</span>
              <span className="value">
                {new Intl.NumberFormat('vi-VN').format(tour.price)} đ
              </span>
            </div>

            <div className="booking-form">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>
                  Guests ({tour.minParticipants}-{tour.maxParticipants})
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  {Array.from(
                    {
                      length: tour.maxParticipants - tour.minParticipants + 1,
                    },
                    (_, i) => tour.minParticipants + i
                  ).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button className="btn-reserve" onClick={handleBooking}>
              Book Tour
            </button>

            <div className="booking-benefits">
              <div className="benefit">
                <FontAwesomeIcon icon={faCheck} className="check-icon" />
                <span>Professional Guide</span>
              </div>
              <div className="benefit">
                <FontAwesomeIcon icon={faCheck} className="check-icon" />
                <span>All Meals Included</span>
              </div>
              <div className="benefit">
                <FontAwesomeIcon icon={faCheck} className="check-icon" />
                <span>Small Group Tours</span>
              </div>
            </div>

            <div className="booking-info">
              <h4>Tour Info</h4>
              <div className="info-item">
                <MapPin size={16} />
                <span>{tour.location}</span>
              </div>
              <div className="info-item">
                <Clock size={16} />
                <span>
                  {tour.duration?.value} {tour.duration?.unit}
                </span>
              </div>
              <div className="info-item">
                <Users size={16} />
                <span>
                  {tour.minParticipants}-{tour.maxParticipants} guests
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

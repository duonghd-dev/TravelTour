import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ExperiencesDetail.scss';

const ExperiencesDetail = () => {
  const { id } = useParams();
  const [experience, setExperience] = useState(null);
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [count, setCount] = useState(1);

  // Fetch experience detail từ API
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiUrl}/api/v1/experiences/${id}`);
        if (!response.ok) throw new Error('Failed to fetch experience');
        const data = await response.json();
        setExperience(data.data);
        setCount(data.data.minGuests);

        // Fetch artisan data dựa vào artisanId
        if (data.data.artisanId?._id || data.data.artisanId) {
          const artisanId = data.data.artisanId?._id || data.data.artisanId;
          const artisanResponse = await fetch(
            `${apiUrl}/api/v1/artisans/${artisanId}`
          );
          if (artisanResponse.ok) {
            const artisanData = await artisanResponse.json();
            setArtisan(artisanData.data);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchExperience();
  }, [id]);

  if (loading)
    return (
      <div className="expdetail">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="expdetail">
        <p>Error: {error}</p>
      </div>
    );
  if (!experience)
    return (
      <div className="expdetail">
        <p>Experience not found</p>
      </div>
    );

  // Generate time slots
  const getSlotsForDate = (dateStr) => {
    if (!dateStr) return [];
    const day = new Date(dateStr).getDate() || 1;
    const totalSlots = experience.maxGuests;

    if (day % 3 === 0) {
      return [
        { id: 's1', time: '08:00 AM', available: 0, total: totalSlots },
        { id: 's2', time: '02:00 PM', available: 4, total: totalSlots },
      ];
    } else if (day % 3 === 1) {
      return [
        { id: 's1', time: '08:00 AM', available: 8, total: totalSlots },
        { id: 's2', time: '02:00 PM', available: 2, total: totalSlots },
      ];
    } else {
      return [
        { id: 's1', time: '08:00 AM', available: 0, total: totalSlots },
        { id: 's2', time: '02:00 PM', available: 0, total: totalSlots },
      ];
    }
  };

  const availableSlots = getSlotsForDate(date);
  const isDaySoldOut =
    date &&
    availableSlots.length > 0 &&
    availableSlots.every((slot) => slot.available === 0);

  const currentMaxGuests = selectedSlot
    ? Math.min(experience.maxGuests, selectedSlot.available)
    : experience.maxGuests;

  const guestOptions = Array.from(
    { length: currentMaxGuests - experience.minGuests + 1 },
    (_, i) => experience.minGuests + i
  );

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setSelectedSlot(null);
    setCount(experience.minGuests);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    if (count > slot.available) {
      setCount(slot.available);
    }
  };

  const canBook =
    date && selectedSlot && count > 0 && experience.status === 'active';

  return (
    <div className="expdetail">
      {/* Banner + Title */}
      <div
        className="expdetail__banner"
        style={{
          backgroundImage: `url(${experience.images?.[0] || experience.image || ''})`,
        }}
      >
        <div className="expdetail__banner-overlay">
          <span className="expdetail__badge">{experience.badge}</span>
          <h1 className="expdetail__title">{experience.title}</h1>
          <div className="expdetail__info">
            <span>{experience.location}</span>
            <span>|</span>
            <span>
              {experience.duration.value} {experience.duration.unit}
              {experience.duration.value > 1 ? 's' : ''}
            </span>
            <span>|</span>
            <span className="expdetail__rating-info">
              ★ {experience.ratingAverage} ({experience.totalReviews} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="expdetail__container">
        {/* Left: Story + Guide + Journey + Gallery + Reviews */}
        <div className="expdetail__main">
          {/* Story */}
          <section className="expdetail__story">
            <h2 className="expdetail__section-title">The Story of the Soul</h2>
            <blockquote className="expdetail__quote">
              "{experience.quote}"
            </blockquote>
            <p className="expdetail__desc">{experience.description}</p>
          </section>

          {/* Guide */}
          {experience.guide && (
            <section className="expdetail__guide">
              <h3 className="expdetail__section-subtitle">MEET YOUR GUIDE</h3>
              <div className="expdetail__guide-card">
                <img
                  src={experience.guide.image}
                  alt={experience.guide.name}
                  className="expdetail__guide-img"
                />
                <div className="expdetail__guide-info">
                  <h4>{experience.guide.name}</h4>
                  <p>{artisan?.slogan || experience.guide.slogan}</p>
                  <div className="expdetail__guide-meta">
                    <span>{experience.guide.years}+ YEARS EXPERIENCE</span>
                    <span>{experience.guide.generation}th GENERATION</span>
                  </div>
                  <a
                    href={`/artisan/${experience.guide.artisanId}`}
                    className="expdetail__guide-profile-btn"
                  >
                    View Artisan Profile &rarr;
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* Journey */}
          {experience.journey && experience.journey.length > 0 && (
            <section className="expdetail__journey">
              <h3
                className="expdetail__section-title"
                style={{ marginBottom: 24 }}
              >
                The Curated Journey
              </h3>
              <ol className="expdetail__journey-list">
                {experience.journey.map((step, idx) => (
                  <li key={idx} className="expdetail__journey-step">
                    <div className="expdetail__journey-stepnum">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="expdetail__journey-content">
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Gallery */}
          {experience.gallery && experience.gallery.length > 0 && (
            <section className="expdetail__gallery">
              <h3 className="expdetail__section-title">Moments & Details</h3>
              <div className="expdetail__gallery-grid">
                {experience.gallery.map((imgUrl, index) => (
                  <div
                    key={index}
                    className={`expdetail__gallery-item expdetail__gallery-item--${index}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`gallery-${index}`}
                      className="expdetail__gallery-img"
                    />
                    <div className="expdetail__gallery-overlay">
                      <span className="expdetail__gallery-text">
                        {index === 0
                          ? 'Living Heritage'
                          : index === experience.gallery.length - 1
                            ? 'View Full Gallery'
                            : 'Artisan Craft'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          {experience.reviews && experience.reviews.length > 0 && (
            <section className="expdetail__reviews">
              <h3 className="expdetail__section-title">Traveler Reflections</h3>
              <div className="expdetail__reviews-list">
                {experience.reviews.map((r, idx) => (
                  <div key={idx} className="expdetail__review-card">
                    <div className="expdetail__review-avatar">
                      {r.avatar ? (
                        <img src={r.avatar} alt={r.name} />
                      ) : (
                        <span>
                          {r.name
                            .split(' ')
                            .map((w) => w[0])
                            .join('')
                            .toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="expdetail__review-content">
                      <div className="expdetail__review-name">{r.name}</div>
                      <div className="expdetail__review-text">{r.content}</div>
                      <div className="expdetail__review-rating">
                        {'★'.repeat(r.rating)}
                        {'☆'.repeat(5 - r.rating)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right: Booking Box - Ensure rendered only once */}
        {experience && (
          <aside className="expdetail__sidebar">
            <div className="expdetail__booking-box">
              {experience.totalBookings > 0 && (
                <div className="expdetail__booking-popular">
                  <span role="img" aria-label="fire">
                    🔥
                  </span>{' '}
                  {experience.totalBookings} travelers have booked this!
                </div>
              )}

              <div className="expdetail__booking-price">
                <span>Total Experience</span>
                <span className="expdetail__booking-amount">
                  ${experience.price}
                </span>
                <span className="expdetail__booking-unit">per person</span>
              </div>

              <div className="expdetail__booking-schedule-info">
                <div className="expdetail__booking-status">
                  {experience.status === 'active' ? (
                    <span className="status-active">🟢 Available to Book</span>
                  ) : (
                    <span className="status-inactive">
                      🔴 Currently Unavailable
                    </span>
                  )}
                </div>
                {experience.availableDays && (
                  <p>
                    <strong>Operates:</strong>{' '}
                    {Array.isArray(experience.availableDays)
                      ? experience.availableDays
                          .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
                          .join(', ')
                      : 'Check availability'}
                  </p>
                )}
              </div>

              {/* Bước 1: Chọn ngày */}
              <div className="expdetail__booking-field">
                <label>1. Select Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  disabled={experience.status !== 'active'}
                />
              </div>

              {/* Bước 2: Chọn khung giờ */}
              {date && (
                <div className="expdetail__booking-field">
                  <label>2. Select Time Slot</label>

                  {isDaySoldOut ? (
                    <div className="expdetail__soldout-msg">
                      All slots for this day are fully booked. Please select
                      another date.
                    </div>
                  ) : (
                    <div className="expdetail__slots">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={slot.available === 0}
                          className={`expdetail__slot-btn ${
                            selectedSlot?.id === slot.id
                              ? 'expdetail__slot-btn--selected'
                              : ''
                          }`}
                          onClick={() => handleSlotSelect(slot)}
                        >
                          <span className="expdetail__slot-time">
                            {slot.time}
                          </span>
                          <span className="expdetail__slot-spots">
                            {slot.available === 0
                              ? 'Sold Out'
                              : `${slot.available}/${slot.total} slots`}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Bước 3: Chọn số lượng người */}
              <div
                className="expdetail__booking-field"
                style={{ marginTop: '10px' }}
              >
                <label>3. Travelers</label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  disabled={!selectedSlot || experience.status !== 'active'}
                >
                  {!selectedSlot && (
                    <option value={0}>Select a time slot first</option>
                  )}
                  {selectedSlot &&
                    guestOptions.map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                </select>
              </div>

              <button
                className={`expdetail__booking-btn ${
                  !canBook ? 'expdetail__booking-btn--disabled' : ''
                }`}
                disabled={!canBook}
              >
                {!date
                  ? 'Select a Date'
                  : !selectedSlot
                    ? 'Select a Time Slot'
                    : 'Book Experience'}
              </button>

              <ul className="expdetail__booking-benefits">
                <li>✔ Verified Heritage Guide</li>
                <li>✔ Sustainable Community Impact</li>
              </ul>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default ExperiencesDetail;

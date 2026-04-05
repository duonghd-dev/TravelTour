import React, { useState } from 'react';
import './ExperiencesDetail.scss'; // Import file SCSS vào đây

const EXPERIENCE_DETAIL = {
  id: 1,
  title: 'Bat Trang Pottery Revival',
  location: 'Gia Lam, Hanoi',
  price: 340,
  badge: 'HERITAGE REVIVAL SERIES',
  image:
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  quote:
    'The clay remembers the touch of the ancestor, and the fire breathes life into the silence.',
  story: `For over 700 years, the village of Bat Trang has stood as a sentinel of Vietnamese craftsmanship. Nestled along the Red River, this community has flourished with artisans guarding global treasures. The "Revival Series" is a masterclass in living heritage, rooted in the language of resilience. You’ll help stoke the community kiln, witness generations work together, and throw your own first series form on the potter’s wheel, acknowledging the ancient methods from Imperial blue-shine to contemporary textures of today.\n\nThis physical making ignites the deep human connection between the artisan and the earth. Every piece you sculpt supports the local community, but even mightier is that the ancient skills continue to kindle for generations to come.`,

  artisanId: 'master-tam-123',
  duration: { value: 4, unit: 'hour' },
  maxGuests: 8,
  minGuests: 1,
  schedule: '08:00 AM & 02:00 PM',
  availableDays: ['monday', 'wednesday', 'friday', 'saturday'],
  status: 'active',
  totalBookings: 142,
  ratingAverage: 4.8,
  totalReviews: 24,

  guide: {
    name: 'Master Nguyen Van Tam',
    desc: 'A potter for individual UN task forces and the soul of Hanoi.',
    years: 40,
    generation: 14,
    image:
      'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
  },
  journey: [
    {
      title: 'Sourcing Raw Clay & History',
      desc: 'Begin your journey at the riverbanks. Learn to identify the unique soil qualities of the Red River. Afternoon includes a private workshop at the Bat Trang Museum with Master Tam.',
    },
    {
      title: 'The Wheel & Shaping',
      desc: 'Full-day immersion in throwing techniques. Under Master Tam’s guidance, you will shape your signature vessel, learning the complex Bat Trang technique.',
    },
    {
      title: 'Glazing & The Ancient Kiln',
      desc: 'Apply traditional and glazes. You will attend the experience to preparing the wood-kiln in a ritual involving local tea and communal storytelling as the first theme is set.',
    },
  ],
  gallery: [
    'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  ],
  reviews: [
    {
      name: 'Elena Aris',
      avatar: '',
      content:
        'This was the highlight of our Vietnam journey. Master Tam’s patience is infinite. We didn’t just learn pottery, we learned a different pace of life.',
      rating: 5,
    },
    {
      name: 'Marcus Low',
      avatar: '',
      content:
        'Deeply moving. The connection to the village’s history makes every bowl you throw feel like an artifact. Highly recommend for slow travelers.',
      rating: 5,
    },
  ],
};

const getSlotsForDate = (dateStr) => {
  if (!dateStr) return [];
  const day = new Date(dateStr).getDate() || 1;
  const totalSlots = EXPERIENCE_DETAIL.maxGuests;

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

const ExperiencesDetail = () => {
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [count, setCount] = useState(EXPERIENCE_DETAIL.minGuests);

  const availableSlots = getSlotsForDate(date);
  const isDaySoldOut =
    date &&
    availableSlots.length > 0 &&
    availableSlots.every((slot) => slot.available === 0);

  const currentMaxGuests = selectedSlot
    ? Math.min(EXPERIENCE_DETAIL.maxGuests, selectedSlot.available)
    : EXPERIENCE_DETAIL.maxGuests;

  const guestOptions = Array.from(
    { length: currentMaxGuests - EXPERIENCE_DETAIL.minGuests + 1 },
    (_, i) => EXPERIENCE_DETAIL.minGuests + i
  );

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setSelectedSlot(null);
    setCount(EXPERIENCE_DETAIL.minGuests);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    if (count > slot.available) {
      setCount(slot.available);
    }
  };

  const canBook =
    date && selectedSlot && count > 0 && EXPERIENCE_DETAIL.status === 'active';

  return (
    <div className="expdetail">
      {/* Banner + Title */}
      <div
        className="expdetail__banner"
        style={{ backgroundImage: `url(${EXPERIENCE_DETAIL.image})` }}
      >
        <div className="expdetail__banner-overlay">
          <span className="expdetail__badge">{EXPERIENCE_DETAIL.badge}</span>
          <h1 className="expdetail__title">{EXPERIENCE_DETAIL.title}</h1>
          <div className="expdetail__info">
            <span>{EXPERIENCE_DETAIL.location}</span>
            <span>•</span>
            <span>
              {EXPERIENCE_DETAIL.duration.value}{' '}
              {EXPERIENCE_DETAIL.duration.unit}
              {EXPERIENCE_DETAIL.duration.value > 1 ? 's' : ''}
            </span>
            <span>•</span>
            <span className="expdetail__rating-info">
              ★ {EXPERIENCE_DETAIL.ratingAverage} (
              {EXPERIENCE_DETAIL.totalReviews} reviews)
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
              “{EXPERIENCE_DETAIL.quote}”
            </blockquote>
            <p className="expdetail__desc">{EXPERIENCE_DETAIL.story}</p>
          </section>

          {/* Guide */}
          <section className="expdetail__guide">
            <h3 className="expdetail__section-subtitle">MEET YOUR GUIDE</h3>
            <div className="expdetail__guide-card">
              <img
                src={EXPERIENCE_DETAIL.guide.image}
                alt={EXPERIENCE_DETAIL.guide.name}
                className="expdetail__guide-img"
              />
              <div className="expdetail__guide-info">
                <h4>{EXPERIENCE_DETAIL.guide.name}</h4>
                <p>{EXPERIENCE_DETAIL.guide.desc}</p>
                <div className="expdetail__guide-meta">
                  <span>{EXPERIENCE_DETAIL.guide.years}+ YEARS EXPERIENCE</span>
                  <span>{EXPERIENCE_DETAIL.guide.generation}th GENERATION</span>
                </div>
                <a
                  href={`/artisan/${EXPERIENCE_DETAIL.artisanId}`}
                  className="expdetail__guide-profile-btn"
                >
                  View Artisan Profile &rarr;
                </a>
              </div>
            </div>
          </section>

          {/* Journey */}
          <section className="expdetail__journey">
            <h3
              className="expdetail__section-title"
              style={{ marginBottom: 24 }}
            >
              The Curated Journey
            </h3>
            <ol className="expdetail__journey-list">
              {EXPERIENCE_DETAIL.journey.map((step, idx) => (
                <li key={idx} className="expdetail__journey-step">
                  <div className="expdetail__journey-stepnum">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="expdetail__journey-content">
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Gallery */}
          <section className="expdetail__gallery">
            <h3 className="expdetail__section-title">Moments & Details</h3>
            <div className="expdetail__gallery-grid">
              {EXPERIENCE_DETAIL.gallery.map((imgUrl, index) => (
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
                        : index === 4
                          ? 'View Full Gallery'
                          : 'Artisan Craft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section className="expdetail__reviews">
            <h3 className="expdetail__section-title">Traveler Reflections</h3>
            <div className="expdetail__reviews-list">
              {EXPERIENCE_DETAIL.reviews.map((r, idx) => (
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
        </div>

        {/* Right: Booking Box */}
        <aside className="expdetail__sidebar">
          <div className="expdetail__booking-box">
            {EXPERIENCE_DETAIL.totalBookings > 0 && (
              <div className="expdetail__booking-popular">
                <span role="img" aria-label="fire">
                  🔥
                </span>{' '}
                {EXPERIENCE_DETAIL.totalBookings} travelers have booked this!
              </div>
            )}

            <div className="expdetail__booking-price">
              <span>Total Experience</span>
              <span className="expdetail__booking-amount">
                ${EXPERIENCE_DETAIL.price}
              </span>
              <span className="expdetail__booking-unit">per person</span>
            </div>

            <div className="expdetail__booking-schedule-info">
              <div className="expdetail__booking-status">
                {EXPERIENCE_DETAIL.status === 'active' ? (
                  <span className="status-active">🟢 Available to Book</span>
                ) : (
                  <span className="status-inactive">
                    🔴 Currently Unavailable
                  </span>
                )}
              </div>
              <p>
                <strong>Operates:</strong>{' '}
                {EXPERIENCE_DETAIL.availableDays
                  .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
                  .join(', ')}
              </p>
            </div>

            {/* Bước 1: Chọn ngày */}
            <div className="expdetail__booking-field">
              <label>1. Select Date</label>
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                disabled={EXPERIENCE_DETAIL.status !== 'active'}
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
                disabled={
                  !selectedSlot || EXPERIENCE_DETAIL.status !== 'active'
                }
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
      </div>
    </div>
  );
};

export default ExperiencesDetail;

import React from 'react';
import { Heart, ShieldCheck, MapPin, Star, ArrowRight } from 'lucide-react';
import './ArtisanCard.scss';

const ArtisanCard = ({ artisan, onClick }) => {
  const {
    userId,
    experiences,
    ratingAverage,
    totalReviews,
    generation,
    isVerified,
    craft,
    province,
    village,
  } = artisan;

  const firstName = userId?.firstName || '';
  const lastName = userId?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const avatar = userId?.avatar || '';

  return (
    <div className="artisan-card" onClick={() => onClick(artisan._id)}>
      <div className="artisan-card__image-wrap">
        <img
          src={artisan.images?.[0] || avatar}
          alt={fullName}
          className="artisan-card__image"
        />
        {isVerified && (
          <div className="artisan-card__verified badge badge--verified">
            <ShieldCheck size={14} /> Verified
          </div>
        )}
        <button
          className="artisan-card__fav"
          onClick={(e) => {
            e.stopPropagation();
            alert('Đã lưu!');
          }}
        >
          <Heart size={20} />
        </button>
        {generation && (
          <div className="artisan-card__generation">Đời thứ {generation}</div>
        )}
      </div>

      <div className="artisan-card__body">
        <div className="artisan-card__craft">{craft}</div>
        <h3 className="artisan-card__name">{fullName}</h3>
        <div className="artisan-card__loc">
          <MapPin size={16} /> {province}
          {village ? `, ${village}` : ''}
        </div>

        <div className="artisan-card__stats">
          <div className="artisan-card__stat">
            <div className="artisan-card__stat-val">
              <Star
                size={16}
                fill="var(--accent-gold)"
                color="var(--accent-gold)"
              />{' '}
              {ratingAverage || 0}
            </div>
            <div className="artisan-card__stat-label">
              {totalReviews || 0} đánh giá
            </div>
          </div>
          <div className="artisan-card__stat">
            <div className="artisan-card__stat-val">
              {artisan.responseRate || 100}%
            </div>
            <div className="artisan-card__stat-label">Phản hồi</div>
          </div>
        </div>

        <button className="btn btn--outline" style={{ width: '100%' }}>
          Xem Hồ Sơ <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ArtisanCard;

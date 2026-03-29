import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import './ArtisanCard.scss';

const ArtisanCard = ({ artisan, onFavoriteClick, isFavorited }) => {
  const navigate = useNavigate();
  const fullName = `${artisan.userId.firstName} ${artisan.userId.lastName}`;

  const handleViewProfile = () => {
    navigate(`/artisan/${artisan._id}`);
  };

  return (
    <div className="artisan-card">
      <div className="artisan-card__image-wrapper">
        <img
          src={artisan.userId.avatar || '/avatar-default.png'}
          alt={fullName}
          className="artisan-card__image"
        />
        {artisan.isVerified && (
          <span className="artisan-card__badge">✓ HERITAGE VERIFIED</span>
        )}
        <button
          className="artisan-card__favorite-btn"
          onClick={() => onFavoriteClick?.(artisan._id)}
          type="button"
        >
          <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="artisan-card__content">
        <h3 className="artisan-card__name">{fullName}</h3>
        <p className="artisan-card__craft">{artisan.craft}</p>
        {artisan.province && (
          <p className="artisan-card__location">{artisan.province}</p>
        )}

        <div className="artisan-card__stats">
          <div className="artisan-card__stat">
            <span className="artisan-card__stat-value">
              {artisan.experienceYears || 0}+
            </span>
            <span className="artisan-card__stat-label">Years</span>
          </div>
          <div className="artisan-card__stat">
            <span className="artisan-card__stat-value">
              ★ {artisan.ratingAverage ? artisan.ratingAverage.toFixed(1) : 0}
            </span>
            <span className="artisan-card__stat-label">
              ({artisan.totalReviews || 0})
            </span>
          </div>
        </div>

        {artisan.bio && (
          <p className="artisan-card__description">{artisan.bio}</p>
        )}

        <button
          className="artisan-card__btn"
          onClick={handleViewProfile}
          type="button"
        >
          View Profile & Experiences
        </button>
      </div>
    </div>
  );
};

export default ArtisanCard;

import React, { useState, useEffect } from 'react';
import { Heart, ShieldCheck, MapPin, Star, ArrowRight } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { profileApi } from '@/features/profile/api/profileApi';
import './ArtisanCard.scss';

const ArtisanCard = ({ artisan, onClick }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

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

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await profileApi.getFavorites();
        const favorites = response.data || [];

        const favorite = favorites.find(
          (fav) =>
            fav.itemId.toString() === artisan._id && fav.itemType === 'artisan'
        );

        if (favorite) {
          setIsFavorite(true);
          setFavoriteId(favorite._id);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [artisan._id]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    try {
      setLoading(true);

      if (isFavorite && favoriteId) {
        await profileApi.removeFavorite(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        const response = await profileApi.addFavorite(artisan._id, 'artisan');
        if (response.success) {
          setIsFavorite(true);

          const favorites = response.data || [];
          const newFavorite = favorites.find(
            (fav) =>
              fav.itemId.toString() === artisan._id &&
              fav.itemType === 'artisan'
          );
          if (newFavorite) {
            setFavoriteId(newFavorite._id);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="artisan-card" onClick={() => onClick(artisan._id)}>
      <div className="artisan-card__image-wrap">
        <img
          src={artisan.images?.[0] || avatar}
          alt={fullName}
          className="artisan-card__image"
        />
        {isVerified && (
          <div className="artisan-card__verified">
            <FontAwesomeIcon
              icon={faCheck}
              className="artisan-card__verified-icon"
            />
            <span className="artisan-card__verified-text">
              HERITAGE VERIFIED
            </span>
          </div>
        )}
        <button
          className={`artisan-card__fav ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          disabled={loading}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
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

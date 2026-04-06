import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Clock, Users, Star } from 'lucide-react';
import { profileApi } from '@/features/profile/api/profileApi';
import './TourCard.scss';

export default function TourCard({ tour, onNavigate }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await profileApi.getFavorites();
        const favorites = response.data || [];

        const favorite = favorites.find(
          (fav) => fav.itemId.toString() === tour._id && fav.itemType === 'tour'
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
  }, [tour._id]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    try {
      setLoading(true);

      if (isFavorite && favoriteId) {
        // Remove from favorites
        await profileApi.removeFavorite(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        // Add to favorites
        const response = await profileApi.addFavorite(tour._id, 'tour');
        if (response.success) {
          setIsFavorite(true);
          // Get the new favorites to find the ID
          const favorites = response.data || [];
          const newFavorite = favorites.find(
            (fav) =>
              fav.itemId.toString() === tour._id && fav.itemType === 'tour'
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
    <div
      className="tour-card"
      onClick={() => onNavigate(tour._id)}
      style={{ cursor: 'pointer' }}
    >
      <div className="tour-card__image-wrapper">
        <img
          src={tour.images?.[0]}
          alt={tour.title}
          className="tour-card__image"
        />
        {tour.badge && <span className="tour-card__badge">{tour.badge}</span>}
        <button
          className={`tour-card__favorite ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          disabled={loading}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        <div className="tour-card__rating">
          <Star size={16} fill="currentColor" />
          <span>{tour.rating}</span>
        </div>
      </div>

      <div className="tour-card__content">
        <h3 className="tour-card__title">{tour.title}</h3>

        <div className="tour-card__info">
          <div className="tour-card__meta">
            <MapPin size={16} />
            <span>{tour.location}</span>
          </div>
          <div className="tour-card__meta">
            <Clock size={16} />
            <span>
              {tour.duration?.value} {tour.duration?.unit}
            </span>
          </div>
          <div className="tour-card__meta">
            <Users size={16} />
            <span>
              {tour.minParticipants}-{tour.maxParticipants} guests
            </span>
          </div>
        </div>

        <p className="tour-card__description">{tour.description}</p>

        <div className="tour-card__price-footer">
          <div className="tour-card__price">
            <span className="tour-card__price-label">From</span>
            <span className="tour-card__price-value">${tour.price}</span>
            <span className="tour-card__price-unit">/{tour.priceUnit}</span>
          </div>
          <button className="tour-card__btn-book">Book Now</button>
        </div>
      </div>
    </div>
  );
}

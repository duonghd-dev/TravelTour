import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Star } from 'lucide-react';
import { profileApi } from '@/features/profile/api/profileApi';
import { useToast } from '@/contexts';
import './HotelCard.scss';

const HotelCard = ({
  hotel,
  onClick,
  fromCheckout = false,
  currentItems = [],
}) => {
  const navigate = useNavigate();
  const { showWarning } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await profileApi.getFavorites();
        const favorites = response.data || [];

        const favorite = favorites.find(
          (fav) =>
            fav.itemId.toString() === hotel._id && fav.itemType === 'hotel'
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
  }, [hotel._id]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    try {
      setLoading(true);

      if (isFavorite && favoriteId) {
        await profileApi.removeFavorite(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        const response = await profileApi.addFavorite(hotel._id, 'hotel');
        if (response.success) {
          setIsFavorite(true);

          const favorites = response.data || [];
          const newFavorite = favorites.find(
            (fav) =>
              fav.itemId.toString() === hotel._id && fav.itemType === 'hotel'
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

  const handleBookNow = (e) => {
    e.stopPropagation();

    if (fromCheckout && currentItems && currentItems.length > 0) {
      const hasTour = currentItems.some((item) => item.itemType === 'tour');

      if (hasTour) {
        showWarning(
          'Tour đã bao gồm khách sạn và lịch trình đầy đủ. Bạn không thể thêm khách sạn khác!',
          5000
        );
        return;
      }
    }

    const bookingData = {
      itemId: hotel._id,
      itemType: 'hotel',
      itemName: hotel.name,
      price: hotel.price,
    };

    if (fromCheckout) {
      navigate('/checkout', {
        state: {
          bookingData,
          addToCart: true,
          currentItems: currentItems,
        },
      });
    } else {
      navigate('/checkout', {
        state: {
          bookingData,
        },
      });
    }
  };

  return (
    <div className="hotel-card" onClick={() => onClick(hotel._id)}>
      <div className="hotel-card__image-wrap">
        <img
          src={hotel.images?.[0]}
          alt={hotel.name}
          className="hotel-card__image"
        />
        {hotel.badge && <div className="hotel-card__badge">{hotel.badge}</div>}
        <button
          className={`hotel-card__favorite ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          disabled={loading}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        <div className="hotel-card__rating">
          <Star size={16} fill="currentColor" />
          <span>{hotel.rating}</span>
        </div>
      </div>

      <div className="hotel-card__content">
        <h3 className="hotel-card__name">{hotel.name}</h3>
        <div className="hotel-card__location">
          <MapPin size={16} />
          {hotel.location}
        </div>
        <p className="hotel-card__desc">{hotel.description}</p>

        <div className="hotel-card__footer">
          <div className="hotel-card__price">
            <span className="label">From</span>
            <span className="value">
              {new Intl.NumberFormat('vi-VN').format(hotel.price)} đ
            </span>
            <span className="unit">/{hotel.priceUnit}</span>
          </div>
          <button className="hotel-card__book-btn" onClick={handleBookNow}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;

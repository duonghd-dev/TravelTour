import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { profileApi } from '@/features/profile/api/profileApi';
import './ExperienceCard.scss';

const ExperienceCard = ({ experience }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80';

  
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await profileApi.getFavorites();
        const favorites = response.data || [];

        const favorite = favorites.find(
          (fav) =>
            fav.itemId.toString() === experience._id &&
            fav.itemType === 'experience'
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
  }, [experience._id]);

  
  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    try {
      setLoading(true);

      if (isFavorite && favoriteId) {
        
        await profileApi.removeFavorite(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        
        const response = await profileApi.addFavorite(
          experience._id,
          'experience'
        );
        if (response.success) {
          setIsFavorite(true);
          
          const favorites = response.data || [];
          const newFavorite = favorites.find(
            (fav) =>
              fav.itemId.toString() === experience._id &&
              fav.itemType === 'experience'
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
    <div className="experience-card">
      <div className="experience-card__image-wrapper">
        <img
          src={
            experience.images?.[0] ||
            experience.image ||
            experience.mainImage ||
            FALLBACK_IMAGE
          }
          alt={experience.title}
          className="experience-card__image"
        />
        {experience.badge && (
          <span className="experience-card__badge">{experience.badge}</span>
        )}
        <button
          className={`experience-card__favorite ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          disabled={loading}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="experience-card__content">
        {experience.quote && (
          <div className="experience-card__quote">
            <span>“{experience.quote}”</span>
          </div>
        )}
        <h3 className="experience-card__title">{experience.title}</h3>
        <p className="experience-card__desc">
          {experience.description || experience.desc}
        </p>
        <div className="experience-card__footer">
          <span className="experience-card__price">
            {new Intl.NumberFormat('vi-VN').format(experience.price)} đ{' '}
            <span className="experience-card__per">/ person</span>
          </span>
          <button className="experience-card__btn">Book Experience</button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;

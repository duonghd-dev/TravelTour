import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPalette,
  faBuilding,
  faPlane,
  faUsers,
  faMapPin,
  faTag,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { profileApi } from '../api/profileApi';
import styles from './MyFavoritesSection.module.scss';

const MyFavoritesSection = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80';

  const groupedFavorites = {
    experience: favorites.filter((f) => f.itemType === 'experience'),
    hotel: favorites.filter((f) => f.itemType === 'hotel'),
    tour: favorites.filter((f) => f.itemType === 'tour'),
    artisan: favorites.filter((f) => f.itemType === 'artisan'),
  };

  const itemTypeConfig = {
    experience: {
      label: 'Experiences',
      iconFA: faPalette,
      color: '#2d5016',
    },
    hotel: {
      label: 'Hotels',
      iconFA: faBuilding,
      color: '#8b5a2b',
    },
    tour: {
      label: 'Tours',
      iconFA: faPlane,
      color: '#6b4226',
    },
    artisan: {
      label: 'Artisans',
      iconFA: faUsers,
      color: '#663399',
    },
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await profileApi.getFavorites();
      setFavorites(data.data || []);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setMessage({ type: 'error', text: 'Failed to load favorites' });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id) => {
    try {
      await profileApi.removeFavorite(id);
      setFavorites((prev) => prev.filter((fav) => fav._id !== id));
      setMessage({ type: 'success', text: 'Removed from favorites' });
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove favorite' });
    }
  };

  const getImage = (item) => {
    if (item.images?.length) return item.images[0];
    if (item.image) return item.image;
    if (item.mainImage) return item.mainImage;
    if (item.avatar) return item.avatar;
    return FALLBACK_IMAGE;
  };

  const getTitle = (item) => {
    if (item.title) return item.title;
    if (item.name) return item.name;
    return 'Untitled';
  };

  const getDescription = (item) => {
    if (item.description) return item.description;
    if (item.desc) return item.desc;
    if (item.slogan) return item.slogan;
    return '';
  };

  const getMetaInfo = (item) => {
    const info = {};
    if (item.location) info.location = item.location;
    if (item.province) info.location = item.province;
    if (item.category) info.category = item.category;
    if (item.craft) info.craft = item.craft;
    if (item.craftType) info.craftType = item.craftType;
    return info;
  };

  const renderFavoriteItem = (favorite) => {
    const item = favorite.itemDetail;

    if (!item) {
      return (
        <div key={favorite._id} className={styles.favoriteItem}>
          <div className={styles.itemImageWrapper}>
            <img src={FALLBACK_IMAGE} alt="Item" className={styles.thumbnail} />
          </div>
          <div className={styles.itemContent}>
            <h3 className={styles.itemTitle}>Item no longer available</h3>
            <p className={styles.itemDescription}>
              This {favorite.itemType} was deleted.
            </p>
            <button
              className={styles.removeButton}
              onClick={() => removeFavorite(favorite._id)}
            >
              Remove
            </button>
          </div>
        </div>
      );
    }

    const metaInfo = getMetaInfo(item);
    const imageUrl = getImage(item);

    return (
      <div key={favorite._id} className={styles.favoriteItem}>
        <div className={styles.itemImageWrapper}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={getTitle(item)}
              className={styles.thumbnail}
            />
          ) : (
            <div className={styles.placeholderImage}>No image</div>
          )}
        </div>
        <div className={styles.itemContent}>
          <h3 className={styles.itemTitle}>{getTitle(item)}</h3>
          <p className={styles.itemDescription}>{getDescription(item)}</p>
          <div className={styles.itemMeta}>
            {metaInfo.location && (
              <div className={styles.metaItem}>
                <FontAwesomeIcon icon={faMapPin} className={styles.icon} />
                {metaInfo.location}
              </div>
            )}
            {(metaInfo.category || metaInfo.craft || metaInfo.craftType) && (
              <div className={styles.metaItem}>
                <FontAwesomeIcon icon={faTag} className={styles.icon} />
                {metaInfo.category || metaInfo.craft || metaInfo.craftType}
              </div>
            )}
            {item.rating && (
              <div className={styles.metaItem}>
                <span className={styles.icon}>⭐</span>
                {item.rating.toFixed(1)}
              </div>
            )}
          </div>
          <button
            className={styles.removeButton}
            onClick={() => removeFavorite(favorite._id)}
            title="Remove from favorites"
          >
            Remove
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>My Favorites</h2>
      <p className={styles.sectionSubtitle}>
        Your collection of beloved experiences
      </p>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      ) : favorites.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FontAwesomeIcon icon={faHeart} />
          </div>
          <h3 className={styles.emptyTitle}>No Favorites Yet</h3>
          <p className={styles.emptyText}>
            Start exploring our collection and add your favorite experiences to
            this list.
          </p>
          <a href="/experiences" className={styles.exploreLink}>
            Explore Experiences
          </a>
        </div>
      ) : (
        <div className={styles.groupedFavorites}>
          {Object.entries(groupedFavorites).map(([type, items]) => {
            if (items.length === 0) return null;

            const config = itemTypeConfig[type];
            return (
              <div key={type} className={styles.favoriteGroup}>
                {}
                <div
                  className={styles.groupHeader}
                  style={{ borderLeftColor: config.color }}
                >
                  <span className={styles.groupIcon}>{config.icon}</span>
                  <h3 className={styles.groupTitle}>{config.label}</h3>
                  <span className={styles.groupCount}>{items.length}</span>
                </div>

                {}
                <div className={styles.groupItems}>
                  {items.map((favorite) => renderFavoriteItem(favorite))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyFavoritesSection;

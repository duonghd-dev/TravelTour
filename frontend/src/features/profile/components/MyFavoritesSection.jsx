import { useState, useEffect } from 'react';
import { profileApi } from '../api/profileApi';
import styles from './MyFavoritesSection.module.scss';

const MyFavoritesSection = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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
          <div className={styles.emptyIcon}>❤️</div>
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
        <div className={styles.favoritesList}>
          {favorites.map((favorite) => (
            <div key={favorite._id} className={styles.favoriteItem}>
              <img
                src={favorite.image}
                alt={favorite.title}
                className={styles.thumbnail}
              />
              <div className={styles.itemContent}>
                <h3 className={styles.itemTitle}>{favorite.title}</h3>
                <p className={styles.itemDescription}>{favorite.description}</p>
                <div className={styles.itemMeta}>
                  {favorite.category && (
                    <div className={styles.metaItem}>
                      <span className={styles.icon}>🏷️</span>
                      {favorite.category}
                    </div>
                  )}
                  {favorite.location && (
                    <div className={styles.metaItem}>
                      <span className={styles.icon}>📍</span>
                      {favorite.location}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavoritesSection;

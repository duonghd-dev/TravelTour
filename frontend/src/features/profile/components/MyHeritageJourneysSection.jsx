import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlane,
  faCalendarDays,
  faMapPin,
} from '@fortawesome/free-solid-svg-icons';
import { profileApi } from '../api/profileApi';
import styles from './MyHeritageJourneysSection.module.scss';

const MyHeritageJourneysSection = () => {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJourneys();
  }, []);

  const loadJourneys = async () => {
    try {
      const data = await profileApi.getHeritageJourneys();
      setJourneys(data.data || []);
    } catch (error) {
      console.error('Failed to load journeys:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>My Heritage Journeys</h2>
      <p className={styles.sectionSubtitle}>
        View and manage your booked experiences
      </p>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      ) : journeys.length === 0 ? (
        <div className={styles.emptyState}>
          <FontAwesomeIcon icon={faPlane} className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No Heritage Journeys Yet</h3>
          <p className={styles.emptyText}>
            You haven't booked any heritage experiences yet. Start exploring our
            collection of distinctive journeys.
          </p>
          <a href="/experiences" className={styles.exploreLink}>
            Explore Experiences
          </a>
        </div>
      ) : (
        <div className={styles.journeysGrid}>
          {journeys.map((journey) => (
            <div key={journey._id} className={styles.journeyCard}>
              <div className={styles.imageContainer}>
                <img
                  src={journey.mainImage}
                  alt={journey.title}
                  className={styles.journeyImage}
                />
                <span
                  className={`${styles.statusBadge} ${styles[journey.status]}`}
                >
                  {journey.status === 'completed' ? 'COMPLETED' : 'UPCOMING'}
                </span>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.journeyTitle}>{journey.title}</h3>
                <div className={styles.infoRow}>
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    className={styles.icon}
                  />
                  <span>
                    {new Date(journey.startDate).toLocaleDateString()} -{' '}
                    {new Date(journey.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <FontAwesomeIcon icon={faMapPin} className={styles.icon} />
                  <span>{journey.location}</span>
                </div>
                <button className={styles.manageButton}>Manage Booking</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyHeritageJourneysSection;

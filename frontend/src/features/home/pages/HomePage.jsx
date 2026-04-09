import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.scss';
import axiosInstance from '@/services/axiosInstance';

import bannerVideo from '@assets/video/DiscoverForVN.mp4';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80';

const toDurationLabel = (minutes) => {
  if (!minutes || Number(minutes) <= 0) return 'Flexible schedule';
  if (Number(minutes) < 60) return `${minutes} minutes`;
  return `${(Number(minutes) / 60).toFixed(1).replace('.0', '')} hours`;
};

const HomePage = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCraft, setSelectedCraft] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        
        const [experiencesRes, artisansRes, hotelsRes] = await Promise.all([
          axiosInstance.get('/api/v1/experiences'),
          axiosInstance.get('/api/v1/artisans'),
          axiosInstance.get('/api/v1/hotels'),
        ]);

        
        setExperiences(experiencesRes.data?.data || []);
        setArtisans(artisansRes.data?.data || []);
        setLocations(hotelsRes.data?.data || []);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const featuredExperiences = useMemo(
    () => experiences.slice(0, 3),
    [experiences]
  );
  const mostLovedExperiences = useMemo(
    () =>
      experiences.length > 3
        ? experiences.slice(3, 6)
        : experiences.slice(0, 3),
    [experiences]
  );
  const displayArtisans = useMemo(() => artisans.slice(0, 3), [artisans]);

  const regionOptions = useMemo(() => {
    const fromLocations = locations.map((loc) => loc.province).filter(Boolean);
    return [...new Set(fromLocations)];
  }, [locations]);

  const craftOptions = useMemo(() => {
    const fromArtisans = artisans.map((a) => a.craftCategory).filter(Boolean);
    return [...new Set(fromArtisans)];
  }, [artisans]);

  const impactStats = useMemo(() => {
    const totalReviews = experiences.reduce(
      (sum, exp) => sum + (exp.totalReviews || 0),
      0
    );
    const avgRating =
      experiences.length > 0
        ? (
            experiences.reduce(
              (sum, exp) => sum + (exp.ratingAverage || 0),
              0
            ) / experiences.length
          ).toFixed(1)
        : '0.0';

    return {
      artisans: artisans.length,
      experiences: experiences.length,
      locations: locations.length,
      reviews: totalReviews,
      avgRating,
    };
  }, [experiences, artisans, locations]);

  const handleExplore = () => {
    const searchParams = new URLSearchParams();
    if (selectedRegion) searchParams.append('region', selectedRegion);
    if (selectedCraft) searchParams.append('craft', selectedCraft);
    navigate(`/explore-vietnam?${searchParams.toString()}`);
  };

  const handleViewAllExperiences = () => {
    navigate('/explore-vietnam');
  };

  const handleBookExperience = (experienceId) => {
    navigate(`/experiences/${experienceId}`);
  };

  const handleViewDetails = (experienceId) => {
    navigate(`/experiences/${experienceId}`);
  };

  const handleArtisanClick = (artisanId) => {
    navigate(`/artisans/${artisanId}`);
  };

  const handleExploreNow = () => {
    navigate('/explore-vietnam');
  };

  const getExperienceImage = (exp) => {
    return exp?.images?.[0] || exp?.mainImage || exp?.image || FALLBACK_IMAGE;
  };

  const getExperienceLocation = (exp) => {
    return (
      exp?.locationId?.province ||
      exp?.location?.province ||
      exp?.location ||
      'Vietnam'
    );
  };

  return (
    <div className={styles.homePage}>
      {}
      <section className={styles.heroSection}>
        <div className={styles.heroVideo}>
          <video autoPlay muted loop playsInline>
            <source src={bannerVideo} type="video/mp4" />
          </video>
          <div className={styles.heroOverlay}></div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Preserving <br />
              <span className={styles.heroHighlight}>the marks of time</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Van Hoa Trinh connects travelers with artisans through authentic
              cultural experiences.
            </p>

            <div className={styles.heroLine}>
              <div className={styles.lineBar}></div>
              <p className={styles.lineText}>
                500+ artisans from all provinces ready to share their stories.
              </p>
            </div>
          </div>

          <div className={styles.searchBox}>
            <h3 className={styles.searchTitle}>Find Your Journey</h3>

            <div className={styles.searchForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Region</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Choose Region</option>
                  {regionOptions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Art Form</label>
                <select
                  value={selectedCraft}
                  onChange={(e) => setSelectedCraft(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Choose Type</option>
                  {craftOptions.map((craft) => (
                    <option key={craft} value={craft}>
                      {craft}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={handleExplore} className={styles.searchButton}>
                Start Exploring
              </button>
            </div>
          </div>
        </div>

        <div className={styles.scrollHint}>
          <span>Scroll to hear the stories</span>
          <div className={styles.scrollBar}></div>
        </div>
      </section>

      <div className={styles.sectionDivider}></div>

      {}
      <section className={styles.problemSection}>
        <div className={styles.problemContainer}>
          <h2 className={styles.problemTitle}>
            When culture becomes only a memory...
          </h2>

          <div className={styles.problemContent}>
            <p className={styles.problemText}>
              Many traditional craft villages are disappearing. The last
              artisans keep the flame alive, but the younger generation is not
              eager to continue the heritage.
            </p>

            <p className={styles.problemText}>
              Millions visit Vietnam, yet most only see the surface.{' '}
              <span className={styles.highlight}>
                Culture must be experienced, not just observed.
              </span>
            </p>
          </div>
        </div>
      </section>

      <div className={styles.sectionDivider}></div>

      {}
      <section className={styles.solutionSection}>
        <div className={styles.solutionContainer}>
          <div className={styles.solutionLeft}>
            <h2 className={styles.solutionTitle}>
              Van Hoa Trinh <br />
              <span className={styles.solutionSubtitle}>
                Bridging cultural heritage
              </span>
            </h2>

            <p className={styles.solutionText}>
              We connect you with "Living Human Treasures". You don't just
              visit—you learn, create, and live alongside traditional cultural
              values.
            </p>

            <div className={styles.solutionFlow}>
              <div className={styles.flowItem}>
                <p className={styles.flowLabel}>Travelers</p>
                <p className={styles.flowSubLabel}>Connection</p>
              </div>

              <div className={styles.flowArrow}>→</div>

              <div className={styles.flowCenter}>Van Hoa Trinh</div>

              <div className={styles.flowArrow}>→</div>

              <div className={styles.flowItem}>
                <p className={styles.flowLabel}>Artisans</p>
                <p className={styles.flowSubLabel}>Preservation</p>
              </div>
            </div>
          </div>

          <div className={styles.solutionRight}>
            <video autoPlay muted loop playsInline>
              <source src={bannerVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <div className={styles.sectionDivider}></div>

      {/* 4. FEATURED EXPERIENCES */}
      <section className={styles.featuredSection}>
        <div className={styles.featuredHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Featured Experiences</h2>
            <p className={styles.sectionSubtitle}>
              A journey that touches the soul of traditional craft villages.
            </p>
          </div>
          <button
            onClick={handleViewAllExperiences}
            className={styles.viewAllButton}
          >
            View All
          </button>
        </div>

        <div className={styles.experienceGrid}>
          {featuredExperiences.map((item) => (
            <div key={item._id} className={styles.experienceCard}>
              <div className={styles.experienceImage}>
                <img src={getExperienceImage(item)} alt={item.title} />
                <div className={styles.locationBadge}>
                  {getExperienceLocation(item)}
                </div>
              </div>

              <div className={styles.experienceInfo}>
                <h4 className={styles.experienceTitle}>{item.title}</h4>

                <div className={styles.experienceStats}>
                  <span>⏱ {toDurationLabel(item.durationMinutes)}</span>
                  <span>
                    ⭐ {(item.ratingAverage || 0).toFixed(1)} (
                    {item.totalReviews || 0})
                  </span>
                </div>

                <button
                  onClick={() => handleBookExperience(item._id)}
                  className={styles.bookButton}
                >
                  Book Experience
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.sectionDivider}></div>

      {/* 5. MOST LOVED JOURNEYS */}
      <section className={styles.mostLovedSection}>
        <div className={styles.mostLovedHeader}>
          <div>
            <h2 className={styles.mostLovedTitle}>Most Loved Journeys</h2>
            <p className={styles.mostLovedSubtitle}>
              The most authentic experiences chosen by our community.
            </p>
          </div>
          <span className={styles.topSelection}>Top 2026 Selection</span>
        </div>

        <div className={styles.lovedGrid}>
          {mostLovedExperiences.map((exp, idx) => (
            <div key={exp._id} className={styles.lovedCard}>
              <div className={styles.lovedNumber}>{idx + 1}</div>

              <div className={styles.lovedImage}>
                <img src={getExperienceImage(exp)} alt={exp.title} />
                <div className={styles.lovedOverlay}></div>

                <div className={styles.lovedContent}>
                  <p className={styles.lovedLocation}>
                    {getExperienceLocation(exp)}
                  </p>
                  <h4 className={styles.lovedCardTitle}>{exp.title}</h4>

                  <div className={styles.lovedFooter}>
                    <div className={styles.lovedReviews}>
                      <span className={styles.reviewsLabel}>Reviews</span>
                      <span className={styles.reviewsCount}>
                        {exp.totalReviews || 0}+ travelers
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewDetails(exp._id)}
                      className={styles.detailsButton}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.sectionDivider}></div>

      {/* 6. MEET THE ARTISANS */}
      <section className={styles.artisansSection}>
        <h2 className={styles.artisansTitle}>The Keepers of Heritage</h2>

        <div className={styles.artisansGrid}>
          {displayArtisans.map((artisan) => (
            <div
              key={artisan._id}
              onClick={() => handleArtisanClick(artisan._id)}
              className={styles.artisanCard}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.artisanImage}>
                <img
                  src={artisan?.userId?.avatar || FALLBACK_IMAGE}
                  alt={artisan?.userId?.fullName}
                />
              </div>

              <h4 className={styles.artisanName}>
                {artisan?.userId?.fullName || 'Local Artisan'}
              </h4>

              <p className={styles.artisanType}>
                {artisan?.craftType || 'Traditional Craft'}
              </p>

              <p className={styles.artisanBio}>
                "
                {artisan?.slogan ||
                  'Preserving traditions through authentic experiences.'}
                "
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.sectionDivider}></div>

      {/* 7. IMPACT */}
      <section className={styles.impactSection}>
        <div className={styles.impactGrid}>
          <div className={styles.impactCard}>
            <div className={styles.impactNumber}>{impactStats.artisans}+</div>
            <p className={styles.impactLabel}>Artisans Preserved</p>
          </div>

          <div className={styles.impactCard}>
            <div className={styles.impactNumber}>
              {impactStats.avgRating} / 5
            </div>
            <p className={styles.impactLabel}>Average Rating</p>
          </div>

          <div className={styles.impactCard}>
            <div className={styles.impactNumber}>{impactStats.reviews}+</div>
            <p className={styles.impactLabel}>Community Reviews</p>
          </div>
        </div>
      </section>

      <div className={styles.sectionDivider}></div>

      {/* 8. TESTIMONIALS & FINAL CTA */}
      <section className={styles.testimonialSection}>
        <div className={styles.testimonialContent}>
          <p className={styles.testimonialText}>
            "The pottery experience was the most memorable moment of my trip. I
            felt like I was contributing to preserve something truly
            meaningful."
          </p>
          <p className={styles.testimonialAuthor}>— Anna, Germany</p>
        </div>

        <div className={styles.finalCta}>
          <h2 className={styles.ctaTitle}>
            Continue the story <br /> with artisans
          </h2>

          <button onClick={handleExploreNow} className={styles.ctaButton}>
            Explore Experiences Now
          </button>
        </div>
      </section>

      {loading && <div className={styles.loadingMessage}>Loading...</div>}
    </div>
  );
};

export default HomePage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import {
  MessageCircle,
  Heart,
  MapPin,
  Activity,
  Users,
  Award,
  Clock,
  Calendar,
  Star,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { artisanApi } from '../api/artisanApi';
import { ARTISAN_CONSTANTS } from '../constants';
import { ChatBox } from '../../chat/components';
import './ArtisanDetailPage.scss';

const ArtisanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentRecPage, setCurrentRecPage] = useState(1);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [currentExpPage, setCurrentExpPage] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchArtisanDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const artisanData = await artisanApi.getArtisanDetail(id);

        if (artisanData && artisanData._id) {
          setArtisan(artisanData);
        } else {
          setError('Dữ liệu không hợp lệ');
        }
      } catch (err) {
        console.error('Lỗi khi tải chi tiết nghệ nhân:', err);
        setError('Không thể tải chi tiết nghệ nhân. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtisanDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-center section-pad" style={{ minHeight: '50vh' }}>
        <h3>{ARTISAN_CONSTANTS.LOADING_TEXT}</h3>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div
        className="flex-center section-pad"
        style={{
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <h3>{error || ARTISAN_CONSTANTS.ERROR_MESSAGES.NO_DATA}</h3>
        <button className="btn btn--outline" onClick={() => navigate(-1)}>
          {ARTISAN_CONSTANTS.BUTTONS.BACK}
        </button>
      </div>
    );
  }

  const fullName =
    `${artisan.userId?.firstName || ''} ${artisan.userId?.lastName || ''}`.trim();
  const coverImage =
    artisan.images?.[0] ||
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa';

  return (
    <div
      style={{
        background: '#fdf6f0',
        minHeight: '100vh',
        paddingBottom: '100px',
        overflowX: 'hidden',
      }}
    >
      {}
      <header className="hero-header">
        <div className="hero-header__cover">
          <img src={coverImage} alt="Workshop Cover" />
        </div>
        <div className="hero-header__content">
          <div className="container">
            <div className="hero-header__card">
              <div className="hero-header__avatar-wrap">
                <img
                  src={
                    artisan.avatar ||
                    artisan.userId?.avatar ||
                    'https://via.placeholder.com/180'
                  }
                  alt={fullName}
                  className="hero-header__avatar"
                />
                {artisan.isVerified && (
                  <div className="hero-header__badge-pos">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="hero-header__badge-icon"
                    />
                    <span className="hero-header__badge-text">
                      HERITAGE VERIFIED
                    </span>
                  </div>
                )}
              </div>

              <div className="hero-header__info">
                {artisan.generation && (
                  <span className="hero-header__generation">
                    Truyền nhân đời thứ {artisan.generation}
                  </span>
                )}
                <h1 className="hero-header__name">{fullName}</h1>

                <div className="hero-header__title-group">
                  {artisan.title && (
                    <span className="hero-header__title-role">
                      {artisan.title}
                    </span>
                  )}
                  {artisan.title && artisan.craft && (
                    <span className="hero-header__title-divider"></span>
                  )}
                  {artisan.craft && (
                    <span className="hero-header__title-craft">
                      {artisan.craft}
                    </span>
                  )}
                </div>

                <div className="hero-header__meta">
                  {artisan.workshopLocation?.address && (
                    <div className="hero-meta-item">
                      <MapPin size={18} />{' '}
                      <span>{artisan.workshopLocation.address}</span>
                    </div>
                  )}
                  <div className="hero-meta-item">
                    <Activity size={18} /> Phản hồi:{' '}
                    <strong>{artisan.responseRate || 100}%</strong>
                  </div>
                  {artisan.totalBookings && (
                    <div className="hero-meta-item">
                      <Users size={18} /> Khách tham gia:{' '}
                      <strong>{artisan.totalBookings}+</strong>
                    </div>
                  )}
                </div>

                <div className="hero-header__actions">
                  <button
                    className="btn btn--primary"
                    title="Nhắn tin"
                    onClick={() => setIsChatOpen(true)}
                  >
                    <MessageCircle size={16} /> Nhắn Tin Tư Vấn
                  </button>
                  <button className="btn btn--outline" title="Lưu hộ sơ">
                    <Heart size={16} /> Lưu Hộ Sơ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="content-frame">
        <main className="container">
          {}
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-box__val">
                {artisan.experienceYears || ARTISAN_CONSTANTS.DEFAULT_RATING}
              </div>
              <div className="stat-box__label">
                {ARTISAN_CONSTANTS.SECTION_TITLES.YEARS_EXP}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-box__val">
                {artisan.ratingAverage || ARTISAN_CONSTANTS.DEFAULT_RATING}
              </div>
              <div className="stat-box__label">
                {ARTISAN_CONSTANTS.SECTION_TITLES.RATING} (
                {artisan.totalReviews ||
                  ARTISAN_CONSTANTS.DEFAULT_TOTAL_REVIEWS}
                )
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-box__val">
                {artisan.totalBookings ||
                  ARTISAN_CONSTANTS.DEFAULT_TOTAL_BOOKINGS}
              </div>
              <div className="stat-box__label">
                {ARTISAN_CONSTANTS.SECTION_TITLES.BOOKINGS}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-box__val">
                {artisan.experiences?.length || 0}
              </div>
              <div className="stat-box__label">
                {ARTISAN_CONSTANTS.SECTION_TITLES.EXPERIENCES_COUNT}
              </div>
            </div>
          </div>

          {}
          <section className="section-pad" style={{ paddingTop: 0 }}>
            <h3 className="section-heading">
              {ARTISAN_CONSTANTS.SECTION_TITLES.HERITAGE_STORY}
            </h3>
            <div className="story-grid">
              <div className="story-sidebar">
                {artisan.certifyingOrganization && (
                  <div className="cert-card">
                    <h4>
                      <Award size={20} />{' '}
                      {ARTISAN_CONSTANTS.SECTION_TITLES.CERTIFYING_ORG}
                    </h4>
                    <p>{artisan.certifyingOrganization}</p>
                  </div>
                )}
                {artisan.skills && artisan.skills.length > 0 && (
                  <div className="skills-card">
                    <h4>{ARTISAN_CONSTANTS.SECTION_TITLES.SPECIAL_SKILLS}</h4>
                    <div className="skills-list">
                      {artisan.skills.map((skill, i) => (
                        <span key={i} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {artisan.proofImages && artisan.proofImages.length > 0 && (
                  <div className="proof-card">
                    <h4>
                      <ShieldCheck size={20} /> Chứng Minh Hộ Sơ
                    </h4>
                    <div className="proof-images-grid">
                      {artisan.proofImages.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Proof ${i + 1}`}
                          className="proof-image"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="story-content">
                {}
                {artisan.slogan && (
                  <section className="slogan-section">
                    <blockquote className="slogan-quote">
                      "{artisan.slogan}"
                    </blockquote>
                  </section>
                )}

                {artisan.storytelling ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: artisan.storytelling }}
                  />
                ) : (
                  <p>{artisan.slogan || 'Không có mô tả'}</p>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      {}
      {artisan.experiences && artisan.experiences.length > 0 && (
        <section className="experiences-wrapper">
          <div className="container">
            <h3 className="section-heading">
              {ARTISAN_CONSTANTS.SECTION_TITLES.EXPERIENCES}
            </h3>

            {(() => {
              const itemsPerPage = 1;
              const totalItems = artisan.experiences.length;
              const totalPages = Math.ceil(totalItems / itemsPerPage);
              const startIdx = (currentExpPage - 1) * itemsPerPage;
              const endIdx = startIdx + itemsPerPage;
              const paginatedExp = artisan.experiences.slice(startIdx, endIdx);

              return (
                <>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '40px',
                    }}
                  >
                    {paginatedExp.map((exp) => (
                      <div key={exp._id} className="exp-card">
                        <div className="exp-image">
                          <img
                            src={
                              exp.images?.[0] ||
                              'https://via.placeholder.com/400'
                            }
                            alt={exp.title}
                          />
                        </div>
                        <div className="exp-content">
                          {exp.badge && (
                            <div className="badge badge--series">
                              {exp.badge}
                            </div>
                          )}
                          <h2 className="exp-title">{exp.title}</h2>

                          <p className="exp-desc">{exp.description}</p>

                          <div className="exp-features">
                            <div className="exp-feature">
                              <Clock size={20} /> {exp.duration?.value || 0}{' '}
                              {exp.duration?.unit ===
                              ARTISAN_CONSTANTS.DURATION_UNITS.HOUR
                                ? 'Giờ'
                                : exp.duration?.unit}
                            </div>
                            <div className="exp-feature">
                              <Users size={20} /> {exp.minGuests || 0} -{' '}
                              {exp.maxGuests || 0} Khách
                            </div>
                            <div className="exp-feature">
                              <Calendar size={20} />{' '}
                              {exp.availableDays
                                ?.map((d) => d.substring(0, 3).toUpperCase())
                                .join(', ') || 'Theo lịch'}
                            </div>
                            {artisan.workshopLocation?.address && (
                              <div className="exp-feature">
                                <MapPin size={20} />{' '}
                                <p style={{ margin: '6px 0 0 0' }}>
                                  {artisan.workshopLocation.address}
                                </p>
                              </div>
                            )}
                          </div>

                          {exp.journey && exp.journey.length > 0 && (
                            <div className="exp-journey">
                              <h4>
                                {ARTISAN_CONSTANTS.SECTION_TITLES.JOURNEY}
                              </h4>
                              <div className="journey-list">
                                {exp.journey.map((step, idx) => (
                                  <div key={idx} className="journey-item">
                                    <div className="journey-dot">{idx + 1}</div>
                                    <div className="journey-text">
                                      <h5>{step.title}</h5>
                                      <p>{step.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="exp-footer">
                            <div className="exp-price">
                              {new Intl.NumberFormat('vi-VN').format(
                                exp.price || 0
                              )}
                              đ <span>/ khách</span>
                            </div>
                            <button className="btn btn--primary">
                              {ARTISAN_CONSTANTS.BUTTONS.BOOK}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination-controls">
                      <button
                        className="pagination-btn"
                        disabled={currentExpPage === 1}
                        onClick={() =>
                          setCurrentExpPage(Math.max(1, currentExpPage - 1))
                        }
                      >
                        &lt;
                      </button>

                      <div className="pagination-info">
                        {currentExpPage} / {totalPages}
                      </div>

                      <button
                        className="pagination-btn"
                        disabled={currentExpPage === totalPages}
                        onClick={() =>
                          setCurrentExpPage(
                            Math.min(totalPages, currentExpPage + 1)
                          )
                        }
                      >
                        &gt;
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </section>
      )}

      {}
      {artisan.recommendedExperiences &&
        artisan.recommendedExperiences.length > 0 && (
          <section className="experiences-wrapper">
            <div className="container">
              <h3 className="section-heading">
                {ARTISAN_CONSTANTS.SECTION_TITLES.RECOMMENDED_EXPERIENCES}
              </h3>

              {(() => {
                const itemsPerPage = 4;
                const totalItems = artisan.recommendedExperiences.length;
                const totalPages = Math.ceil(totalItems / itemsPerPage);
                const startIdx = (currentRecPage - 1) * itemsPerPage;
                const endIdx = startIdx + itemsPerPage;
                const paginatedItems = artisan.recommendedExperiences.slice(
                  startIdx,
                  endIdx
                );

                return (
                  <>
                    {(() => {
                      const gridColumns = (() => {
                        if (paginatedItems.length === 2)
                          return 'repeat(2, 1fr)';
                        if (paginatedItems.length === 3)
                          return 'repeat(3, 1fr)';
                        return 'repeat(4, 1fr)';
                      })();

                      return (
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: gridColumns,
                            gap: '30px',
                            marginBottom: '40px',
                            justifyContent: 'center',
                          }}
                        >
                          {paginatedItems.map((rec) => (
                            <div key={rec._id} className="rec-exp-card">
                              <div className="rec-exp-image">
                                <img
                                  src={
                                    rec.images?.[0] ||
                                    ARTISAN_CONSTANTS.PLACEHOLDER_EXPERIENCE
                                  }
                                  alt={rec.title}
                                />
                              </div>
                              <div className="rec-exp-content">
                                <div className="rec-exp-artisan">
                                  <p className="rec-exp-artisan-name">
                                    {rec.artisan?.userId?.firstName}{' '}
                                    {rec.artisan?.userId?.lastName}
                                  </p>
                                  <span className="rec-exp-craft">
                                    {rec.artisan?.craft}
                                  </span>
                                </div>

                                <h4 className="rec-exp-title">{rec.title}</h4>
                                <p className="rec-exp-desc">
                                  {rec.description}
                                </p>

                                <div className="rec-exp-info">
                                  <div className="info-item">
                                    <Clock size={16} />{' '}
                                    {rec.duration?.value || 0}{' '}
                                    {rec.duration?.unit ===
                                    ARTISAN_CONSTANTS.DURATION_UNITS.HOUR
                                      ? 'Giờ'
                                      : rec.duration?.unit}
                                  </div>
                                  <div className="info-item">
                                    <Star size={16} /> {rec.ratingAverage || 0}{' '}
                                    ({rec.totalReviews || 0})
                                  </div>
                                </div>

                                <div className="rec-exp-footer">
                                  <div className="rec-exp-price">
                                    {new Intl.NumberFormat('vi-VN').format(
                                      rec.price || 0
                                    )}
                                    đ
                                  </div>
                                  <button className="btn btn--primary btn--small">
                                    {ARTISAN_CONSTANTS.BUTTONS.BOOK}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}

                    {totalPages > 1 && (
                      <div className="pagination-controls">
                        <button
                          className="pagination-btn"
                          disabled={currentRecPage === 1}
                          onClick={() =>
                            setCurrentRecPage(Math.max(1, currentRecPage - 1))
                          }
                        >
                          ← Trang trước
                        </button>

                        <div className="pagination-info">
                          Trang {currentRecPage} / {totalPages}
                        </div>

                        <button
                          className="pagination-btn"
                          disabled={currentRecPage === totalPages}
                          onClick={() =>
                            setCurrentRecPage(
                              Math.min(totalPages, currentRecPage + 1)
                            )
                          }
                        >
                          Trang sau →
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </section>
        )}

      {}
      {artisan.reviews && artisan.reviews.length > 0 && (
        <section className="container section-pad">
          <h3 className="section-heading">
            {ARTISAN_CONSTANTS.SECTION_TITLES.REVIEWS}
          </h3>

          {(() => {
            const itemsPerPage = 4;
            const totalItems = artisan.reviews.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            const startIdx = (currentReviewPage - 1) * itemsPerPage;
            const endIdx = startIdx + itemsPerPage;
            const paginatedReviews = artisan.reviews.slice(startIdx, endIdx);

            return (
              <>
                <div className="reviews-grid">
                  {paginatedReviews.map((review) => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <div className="review-user">
                          <img
                            src={
                              review.userId?.avatar ||
                              'https://via.placeholder.com/48'
                            }
                            alt="Avatar"
                            className="review-avatar"
                          />
                          <div>
                            <h4 className="review-name">
                              {review.userId?.firstName}{' '}
                              {review.userId?.lastName}
                            </h4>
                            <p className="review-date">
                              {new Date(review.createdAt).toLocaleDateString(
                                'vi-VN'
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="review-stars">
                          {[...Array(review.rating || 0)].map((_, i) => (
                            <Star key={i} size={16} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <p className="review-content">"{review.content}"</p>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination-controls">
                    <button
                      className="pagination-btn"
                      disabled={currentReviewPage === 1}
                      onClick={() =>
                        setCurrentReviewPage(Math.max(1, currentReviewPage - 1))
                      }
                    >
                      ← Trang trước
                    </button>

                    <div className="pagination-info">
                      Trang {currentReviewPage} / {totalPages}
                    </div>

                    <button
                      className="pagination-btn"
                      disabled={currentReviewPage === totalPages}
                      onClick={() =>
                        setCurrentReviewPage(
                          Math.min(totalPages, currentReviewPage + 1)
                        )
                      }
                    >
                      Trang sau →
                    </button>
                  </div>
                )}
              </>
            );
          })()}
        </section>
      )}

      {}
      {isChatOpen && (
        <ChatBox
          recipientId={artisan?._id}
          recipientName={fullName}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default ArtisanDetailPage;

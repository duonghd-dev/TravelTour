import './ArtisanHeader.scss';

const ArtisanHeader = ({ artisan, user }) => {
  if (!artisan || !artisan.userId) return null;

  const fullName = `${artisan.userId.firstName} ${artisan.userId.lastName}`;

  return (
    <div className="artisan-header">
      <div className="artisan-header__cover">
        <div className="artisan-header__cover-placeholder"></div>
      </div>

      <div className="artisan-header__content">
        <div className="artisan-header__avatar">
          <img
            src={artisan.userId.avatar || '/avatar-default.png'}
            alt={fullName}
          />
          {artisan.isVerified && (
            <span className="artisan-header__badge">✓ HERITAGE VERIFIED</span>
          )}
        </div>

        <div className="artisan-header__info">
          <h1 className="artisan-header__name">{fullName}</h1>
          <p className="artisan-header__title">
            {artisan.title || artisan.craft}
          </p>
          <p className="artisan-header__location">
            {artisan.province && `${artisan.province}`}
            {artisan.province && artisan.village && ', '}
            {artisan.village && `${artisan.village}`}
            {!artisan.province && !artisan.village && 'Việt Nam'}
          </p>

          <div className="artisan-header__stats">
            <div className="artisan-header__stat">
              <div className="artisan-header__stat-value">
                {artisan.experienceYears}+
              </div>
              <div className="artisan-header__stat-label">Years Experience</div>
            </div>

            <div className="artisan-header__stat">
              <div className="artisan-header__stat-value">
                {artisan.totalGuests || artisan.totalBookings}k
              </div>
              <div className="artisan-header__stat-label">Guests Served</div>
            </div>

            <div className="artisan-header__stat">
              <div className="artisan-header__stat-value">
                ⭐ {artisan.ratingAverage?.toFixed(1) || '0.0'}
              </div>
              <div className="artisan-header__stat-label">
                ({artisan.totalReviews || 0})
              </div>
            </div>

            <div className="artisan-header__stat">
              <div className="artisan-header__stat-value">
                {artisan.experiences?.length || 0}+
              </div>
              <div className="artisan-header__stat-label">Experiences</div>
            </div>
          </div>

          <div className="artisan-header__actions">
            {user?.id !== artisan.userId._id && (
              <>
                <button className="artisan-header__btn artisan-header__btn--message">
                  💬 Message
                </button>
                <button className="artisan-header__btn artisan-header__btn--favorite">
                  ❤️
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanHeader;

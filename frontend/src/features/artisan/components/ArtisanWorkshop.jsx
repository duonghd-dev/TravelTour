import './ArtisanWorkshop.scss';

const ArtisanWorkshop = ({ artisan }) => {
  if (!artisan || !artisan.workshopLocation) return null;

  return (
    <section className="artisan-workshop">
      <div className="artisan-workshop__container">
        <h2 className="artisan-workshop__title">The Workshop</h2>

        <div className="artisan-workshop__content">
          <div className="artisan-workshop__map">
            <div className="artisan-workshop__map-placeholder">
              <img
                src="https://via.placeholder.com/500x300?text=Map+Location"
                alt="Workshop location"
              />
            </div>
            {artisan.workshopLocation.address && (
              <div className="artisan-workshop__location-pin">
                📍 {artisan.workshopLocation.address}
              </div>
            )}
          </div>

          <div className="artisan-workshop__info">
            <h3 className="artisan-workshop__section-title">Địa Chỉ</h3>
            <p className="artisan-workshop__address">
              {artisan.workshopLocation.address || 'Chưa cập nhật'}
            </p>

            <h3 className="artisan-workshop__section-title">Lịch Hoạt Động</h3>
            <p className="artisan-workshop__schedule">
              {artisan.workshopLocation.description ||
                artisan.schedule ||
                'Liên hệ để biết lịch hoạt động chi tiết'}
            </p>

            <button className="artisan-workshop__btn">
              📍 Get Directions →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtisanWorkshop;

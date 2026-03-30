import './ArtisanBio.scss';

const ArtisanBio = ({ artisan }) => {
  if (!artisan) return null;

  return (
    <section className="artisan-bio">
      <div className="artisan-bio__container">
        <h2 className="artisan-bio__title">Hành Trình Di Sản</h2>

        <div className="artisan-bio__content">
          <div className="artisan-bio__text">
            {artisan.skills && artisan.skills.length > 0 && (
              <div className="artisan-bio__skills">
                <h3 className="artisan-bio__section-title">Kỹ Năng Đặc Biệt</h3>
                <div className="artisan-bio__skill-list">
                  {artisan.skills.map((skill, idx) => (
                    <span key={idx} className="artisan-bio__skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {artisan.certifyingOrganization && (
              <div className="artisan-bio__certified">
                <h3 className="artisan-bio__section-title">
                  Tổ Chức Cấp Chứng Nhận
                </h3>
                <p>{artisan.certifyingOrganization}</p>
              </div>
            )}
          </div>

          <div className="artisan-bio__text">
            {/* Render HTML storytelling/bio content */}
            <div
              className="artisan-bio__storytelling"
              dangerouslySetInnerHTML={{
                __html:
                  artisan.storytelling ||
                  artisan.bio ||
                  '<p>Chưa cập nhật thông tin</p>',
              }}
            />

            {artisan.images && artisan.images.length > 0 && (
              <div className="artisan-bio__image">
                <img src={artisan.images[0]} alt="Artisan bio" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtisanBio;

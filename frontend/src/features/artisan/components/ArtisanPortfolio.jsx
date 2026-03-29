import './ArtisanPortfolio.scss';

const ArtisanPortfolio = ({ artisan }) => {
  if (!artisan) return null;

  const allImages = [
    ...(artisan.proofImages || []),
    ...(artisan.images?.slice(0, 3) || []),
  ];

  if (allImages.length === 0) return null;

  return (
    <section className="artisan-portfolio">
      <div className="artisan-portfolio__container">
        <h2 className="artisan-portfolio__title">Portfolio & Proof</h2>

        <div className="artisan-portfolio__grid">
          {allImages.map((image, idx) => (
            <div key={idx} className="artisan-portfolio__item">
              <img src={image} alt={`Portfolio ${idx + 1}`} />
              {idx === 0 && (
                <div className="artisan-portfolio__badge">PORTFOLIO</div>
              )}
              {idx === allImages.length - 1 && artisan.title && (
                <div className="artisan-portfolio__cert">
                  <div className="artisan-portfolio__cert-title">
                    CERTIFICATE
                  </div>
                  <div className="artisan-portfolio__cert-text">
                    {artisan.title}
                  </div>
                  <div className="artisan-portfolio__cert-org">
                    {artisan.certifyingOrganization || 'Verified'}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtisanPortfolio;

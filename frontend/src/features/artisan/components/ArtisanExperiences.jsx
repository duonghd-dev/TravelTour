import { useState } from 'react';
import './ArtisanExperiences.scss';

const ArtisanExperiences = ({ experiences = [] }) => {
  const [selectedExp, setSelectedExp] = useState(null);

  if (!experiences || experiences.length === 0) return null;

  return (
    <section className="artisan-experiences">
      <div className="artisan-experiences__container">
        <h2 className="artisan-experiences__title">Craft with the Master</h2>
        <p className="artisan-experiences__subtitle">
          Experience and immerse yourself in authentic Vietnamese crafts
        </p>

        <div className="artisan-experiences__grid">
          {experiences.map((exp) => (
            <div
              key={exp._id}
              className="artisan-experiences__card"
              onClick={() => setSelectedExp(exp._id)}
            >
              <div className="artisan-experiences__image">
                {exp.images && exp.images[0] ? (
                  <img src={exp.images[0]} alt={exp.title} />
                ) : (
                  <div className="artisan-experiences__image-placeholder">
                    📸
                  </div>
                )}
              </div>

              <div className="artisan-experiences__content">
                <h3 className="artisan-experiences__exp-title">{exp.title}</h3>

                <div className="artisan-experiences__meta">
                  <div className="artisan-experiences__meta-item">
                    <span className="artisan-experiences__label">⏱️</span>
                    {exp.duration?.value} {exp.duration?.unit}
                  </div>
                  <div className="artisan-experiences__meta-item">
                    <span className="artisan-experiences__label">👥</span>
                    Max {exp.maxGuests} guests
                  </div>
                </div>

                {exp.ratingAverage && (
                  <div className="artisan-experiences__rating">
                    <span className="artisan-experiences__stars">
                      ⭐ {exp.ratingAverage.toFixed(1)}
                    </span>
                    ({exp.totalReviews || 0} reviews)
                  </div>
                )}

                <div className="artisan-experiences__footer">
                  <div className="artisan-experiences__price">
                    ${(exp.price / 1000).toFixed(0)}k
                  </div>
                  <button className="artisan-experiences__btn">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtisanExperiences;

import './ExperienceCard.scss';

const ExperienceCard = ({ experience }) => {
  return (
    <div className="experience-card">
      <div className="experience-card__image-wrapper">
        <img
          src={experience.image}
          alt={experience.title}
          className="experience-card__image"
        />
        {experience.badge && (
          <span className="experience-card__badge">{experience.badge}</span>
        )}
      </div>
      <div className="experience-card__content">
        {experience.quote && (
          <div className="experience-card__quote">
            <span>“{experience.quote}”</span>
          </div>
        )}
        <h3 className="experience-card__title">{experience.title}</h3>
        <p className="experience-card__desc">{experience.desc}</p>
        <div className="experience-card__footer">
          <span className="experience-card__price">
            ${experience.price}{' '}
            <span className="experience-card__per">/ person</span>
          </span>
          <button className="experience-card__btn">Book Experience</button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;

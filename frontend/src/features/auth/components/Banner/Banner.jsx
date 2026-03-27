import PropTypes from 'prop-types';
import './Banner.scss';

const Banner = ({
  subtitle = '',
  title,
  titleHighlight = '',
  description = '',
  author = '',
}) => {
  return (
    <div className="auth-banner">
      <div className="banner-content">
        <div className="banner-text">
          {subtitle && <h2>{subtitle}</h2>}
          <h1>
            {title} {titleHighlight && <span>{titleHighlight}</span>}
          </h1>
          {description && <p>{description}</p>}
          {author && <p className="author">{author}</p>}
        </div>
      </div>
      <div className="banner-image-overlay"></div>
    </div>
  );
};

Banner.propTypes = {
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  titleHighlight: PropTypes.string,
  description: PropTypes.string,
  author: PropTypes.string,
};

export default Banner;

import React from 'react';
import styles from './styles.module.scss';
import bannerVideo from '@assets/video/DiscoverForVN.mp4';

const Banner = () => {
  const { container, content } = styles;
  return (
    <section className={container}>
      <div>
        <video type="video/mp4" autoPlay muted playsInline>
          <source src={bannerVideo} />
        </video>
      </div>

      {}
    </section>
  );
};

export default Banner;

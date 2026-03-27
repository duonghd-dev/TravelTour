import styles from './styles.module.scss';

import React from 'react';

const { wrapLayout, container } = styles;

const MainLayout = ({ children }) => {
  return (
    <main className={wrapLayout}>
      <div className={container}>{children}</div>
    </main>
  );
};

export default MainLayout;

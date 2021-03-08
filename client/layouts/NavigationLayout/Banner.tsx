import React from 'react';
import cx from 'classnames';

import layoutStyles from '../DashboardLayout/DashboardLayout.module.scss';
import styles from './NavigationLayout.module.scss';

interface IBannerProps {
  text: string;
}

const Banner = ({ text }: IBannerProps) => (
  <div
    className={cx(layoutStyles.content, styles.bannerContainer, {
      [layoutStyles.full]: 'full',
    })}
  >
    <div className={styles.bannerText}>{text}</div>
  </div>
);

export default Banner;

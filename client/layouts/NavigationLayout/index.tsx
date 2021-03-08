import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import Logo from '../../components/Logo';
import { Link } from '../../router';
import Banner from './Banner';
import { BannerContext, BannerContextProvider } from './bannerContext';
import styles from './NavigationLayout.module.scss';

const NavigationLayout: React.FunctionComponent = ({ children }) => (
  <>
    <div className={styles.headerWrap}>
      <div className={styles.headerContent}>
        <Link href="/">
          <a className={styles.logoWrap}>
            <Logo className={styles.logo} height={32} width={116} />
          </a>
        </Link>
        <h1>Main Navigation</h1>
      </div>
    </div>
    <BannerContextProvider>
      <NavigationLayoutContent>{children}</NavigationLayoutContent>
    </BannerContextProvider>
  </>
);

NavigationLayout.propTypes = {
  children: PropTypes.node,
};

const NavigationLayoutContent: React.FC = ({ children }) => {
  const { bannerText } = useContext(BannerContext);
  return (
    <>
      {bannerText ? <Banner text={bannerText} /> : null}
      {children}
    </>
  );
};

NavigationLayoutContent.propTypes = {
  children: PropTypes.node,
};

export const getNavigationLayout = (page) => <NavigationLayout>{page}</NavigationLayout>;

export default NavigationLayout;

import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import Logo from '../../components/Logo';
import { Link } from '../../router';
import Banner from './Banner';
import { BannerContext, BannerContextProvider } from './bannerContext';
import styles from './NavigationLayout.module.scss';
import MainNavigation from '../../components/MainNavigation';
import VerticalNavigationLayout from "../VerticalNavigationLayout";
import {INavItem} from "../VerticalNavigationLayout/navigation";

const NavigationLayout: React.FunctionComponent = ({ children }) => (
  <>
    <div className={styles.headerWrap}>
      <div className={styles.headerContent}>
        <Link href="/">
          <a className={styles.logoWrap}>
            <Logo className={styles.logo} height={32} width={116} />
          </a>
        </Link>
        <MainNavigation />
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


const navItems: INavItem[] = [
  {
    key: 'company',
    label: 'Company Home',
    href: '/',
    iconName: 'Home',
    exact: true,
  },
  {
    key: 'home',
    label: 'Admin Home',
    href: '/admin',
    iconName: 'Home',
    exact: true,
  },
  {
    key: 'messages',
    label: 'Admin Messages',
    href: '/admin/messages',
    iconName: 'MessageSquare',
  },

];

export const getNavigationLayout = (page) => <VerticalNavigationLayout navItems={navItems}>{page}</VerticalNavigationLayout>;

export default NavigationLayout;

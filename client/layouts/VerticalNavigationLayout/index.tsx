import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import FeatherIcon from '../../components/FeatherIcon';
import Logo from '../../components/Logo/DefaultLogo';
import colors from '../../constants/colors';
import { NavLink } from '../../router';
import CollapsedIcon from './assets/collapsedIcon.svg';
import NavItems, { INavItem } from './navigation';
import PageHeader from './pageHeader';
import styles from './VerticalNavigationLayout.module.scss';

interface IProps {
  navItems: INavItem[];
  children: React.ReactNode;
}

const VerticalNavigationLayout = ({ children, navItems }: IProps) => {
  const [navigationOpen, setNavigationOpen] = useState<boolean>(false);

  // Adding listeners for resize is overkill, just open the menu when component mounts
  useEffect(() => {
    if (window.innerWidth > 1199) {
      setNavigationOpen(true);
    }
  }, []);

  function onToggleMenuClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.stopPropagation();
    event.preventDefault();
    setNavigationOpen(!navigationOpen);
  }

  return (
    <div className={styles.page}>
      <div className={cx(styles.pageNavigation, { [styles.open]: navigationOpen })}>
        <div className={styles.navigationContainer}>
          <div className={styles.menuContainer} onClick={onToggleMenuClick}>
            {navigationOpen ? (
              <Logo height={40} />
            ) : (
              <img src={CollapsedIcon} alt="collapsed-icon" className={styles.collapsedIcon} />
            )}
          </div>
          <div className={styles.navItemsContainer}>
            <NavItems isDrawerOpen={navigationOpen} navItems={navItems} />
          </div>
        </div>
        <NavLink href="/logout">
          <a className={cx(styles.navItemContainer, styles.logoutButton)}>
            {navigationOpen ? (
              <>
                <FeatherIcon name="LogOut" color={colors.logoutGrey} />
                <span className={styles.navItemLabel}>Log Out</span>
              </>
            ) : (
              <FeatherIcon name="LogOut" color={colors.logoutGrey} />
            )}
          </a>
        </NavLink>
      </div>
      <div className={cx(styles.pageContentWrapper, { [styles.drawerOpen]: navigationOpen })}>
        <div className={styles.pageContent}>
          <PageHeader />
          {children}
        </div>
      </div>
    </div>
  );
};

VerticalNavigationLayout.propTypes = {
  children: PropTypes.node,
};

VerticalNavigationLayout.defaultProps = {};

export default VerticalNavigationLayout;

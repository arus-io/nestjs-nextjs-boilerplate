import React from 'react';

import FeatherIcon, { IconName } from '../../../components/FeatherIcon';
import colors from '../../../constants/colors';
import { NavLink } from '../../../router';
import styles from '../VerticalNavigationLayout.module.scss';

export interface INavItem {
  key: string;
  label: string;
  href: string;
  iconName: IconName;
  exact?: boolean;
}
interface INavItemsProps {
  navItems: INavItem[];
  isDrawerOpen: boolean;
}

const NavItems = ({ isDrawerOpen, navItems }: INavItemsProps) => (
  <>
    {navItems.map(({ key, href, label, iconName, exact }) => (
      <NavLink key={key} activeClassName={styles.activeNavItem} href={href} exact={exact}>
        <a className={styles.navItemContainer}>
          {isDrawerOpen ? (
            <>
              <FeatherIcon name={iconName} color={colors.iconGrey} />
              <span className={styles.navItemLabel}>{label}</span>
            </>
          ) : (
            <FeatherIcon name={iconName} color={colors.iconGrey} />
          )}
        </a>
      </NavLink>
    ))}
  </>
);

export default NavItems;

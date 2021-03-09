import React from 'react';

import FeatherIcon from '../../../components/FeatherIcon';
import colors from '../../../constants/colors';
import { NavLink } from '../../../router';
import DefaultAvatar from '../assets/defaultAvatar.svg';
import styles from '../VerticalNavigationLayout.module.scss';
import withUser, { IWithUserProps } from '../withUser';
import GlobalSearch from './components/GlobalSearch';

const PageHeader = ({ user }: IWithUserProps) => {
  // TODO
  // GQL to get user data AND notifications
  // TODO
  // users able to upload their avatar/picture?

  return (
    <div className={styles.pageHeader}>
      <div className={styles.searchBar}>{user?.superuser ? <GlobalSearch /> : null}</div>
      <div className={styles.userSection}>
        {/* <NotificationBadge count={99} /> */}
        <div className={styles.userSettingsContainer}>
          {/* TODO Replace with user pic and default to this if not present */}
          <img src={DefaultAvatar} alt="default-avatar" className={styles.userIcon} />
          {user ? (
            <div className={styles.userInfoContainer}>
              {/* TODO once we have the same layout, unify settings route */}
              <NavLink href={'/settings'}>
                <a className={styles.settingsLink}>
                  <span className={styles.userNameLabel}>{`${user.firstName} ${user.lastName}`}</span>
                  <FeatherIcon name="ChevronRight" size={20} color={colors.lightText} />
                </a>
              </NavLink>
              <div className={styles.userEmailLabel}>{user.email}</div>
            </div>
          ) : null}
          <div className={styles.ovalBackground} />
        </div>
      </div>
    </div>
  );
};

export default withUser(PageHeader);

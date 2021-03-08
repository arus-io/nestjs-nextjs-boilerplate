import React from 'react';
import withUser, { IWithUserProps } from '../../../layouts/VerticalNavigationLayout/withUser';
import shouldBeLoggedIn from '../../../utils/should-be-logged-in';
import styles from './HomePage.module.scss';

const HomePage = ({ user }: IWithUserProps) => {
  return (
    <>
      <div className={styles.welcomeBanner}>
        <div className={styles.bannerHeader}>{`Hello ${user.firstName}`}</div>
        <div className={styles.bannerLabel}>Welcome back to Boilerplate App!</div>
      </div>
    </>
  );
};

export default shouldBeLoggedIn(withUser(HomePage));

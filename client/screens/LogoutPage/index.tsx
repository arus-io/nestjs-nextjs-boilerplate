import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { logoutAction } from '../../_core/api';
import Loading from '../../components/Loading';
import { Router } from '../../router';
import { IUserVM } from '../Hr/types';
import styles from './LogoutPage.module.scss';

interface IProps {
  user: IUserVM;
}

const LogoutPage = ({ user }: IProps) => {
  useEffect(() => {
    if (!user) {
      Router.push('/login');
    }
  }, [user]);

  return (
    <div className={styles.loadingContainer}>
      <Loading size="large" className={styles.loading} />
    </div>
  );
};

LogoutPage.getInitialProps = ({ req, res, store }) => {
  store.dispatch(logoutAction());

  if (res) {
    res.clearCookie('token');
    res.writeHead(302, {
      Location: `http://${req.subdomain}.${process.env.SITE_DOMAIN}/login`,
    });
    res.end();
  }
};

export default connect(({ auth }) => ({ user: auth.me }), {})(LogoutPage);

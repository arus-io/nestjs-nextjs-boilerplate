import cx from 'classnames';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { Link } from '../../router';
import AccountIcon from '../Icons/Account';
import styles from './MainNavigation.module.scss';

const MainNavigation = ({ router, role }) => {
  const links = [];
    links.push(
      <li key="settings">
        <Link href={'/settings'}>
          <a
            className={cx({
              [styles.active]: router.route === '/settings',
            })}
          >
            <AccountIcon />
          </a>
        </Link>
      </li>,
    );

  return <ul className={styles.list}>{links}</ul>;
};

MainNavigation.propTypes = {
  role: PropTypes.string,
  isHr: PropTypes.bool,
  router: PropTypes.object,
  subdomain: PropTypes.string,
  renderMySteps: PropTypes.bool,
};

export default compose(
  withRouter,
  connect(({ auth }) => {
    return {
      role: auth.role,
    };
  }),
)(MainNavigation);

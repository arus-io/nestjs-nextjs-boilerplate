import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { Router } from '../../router';
import ArrowLeft from '../Icons/ArrowLeft';
import styles from './BackButton.module.scss';

const BackButton = ({ className, href, history, fallback }) => (
  <a
    onClick={(e) => {
      e.preventDefault();
      if (href) {
        Router.push(href);
      } else if (!history && fallback) {
        Router.push(fallback);
      } else {
        Router.back();
      }
    }}
    href={href || '#'}
    className={cx(styles.back, className)}
  >
    <ArrowLeft className={styles.icon} />
    <span className={styles.text}>BACK</span>
  </a>
);

BackButton.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  history: PropTypes.string,
  fallback: PropTypes.string,
};

export default connect(({ history }) => ({
  history,
}))(BackButton);

export const BackRedirect = connect(({ history }) => ({
  history,
}))(({ fallback }) => {
  useEffect(() => {
    if (!history && fallback) {
      Router.push(fallback);
    } else {
      Router.back();
    }
  }, []);

  return null;
});

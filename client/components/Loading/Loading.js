import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './Loading.module.scss';

const Loading = ({ size, white, style, className }) => (
  <div
    className={cx(styles.container, styles[size], className, {
      [styles.white]: white,
    })}
    style={style}
    aria-label="Loading"
    role="alert"
    aria-busy="true"
    aria-live="assertive"
  />
);

Loading.propTypes = {
  // small - 10px
  // default - 20px
  // large - 40px
  size: PropTypes.oneOf(['small', 'default', 'large']),
  style: PropTypes.object,
  className: PropTypes.string,
  white: PropTypes.bool,
};

export default Loading;

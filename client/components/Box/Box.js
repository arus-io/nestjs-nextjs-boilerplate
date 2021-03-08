import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './Box.module.scss';

const Box = ({ className, ...props }) => <div className={cx(styles.box, className)} {...props} />;

Box.propTypes = {
  className: PropTypes.string,
};

export default Box;

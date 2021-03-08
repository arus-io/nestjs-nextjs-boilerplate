import PropTypes from 'prop-types';
import React from 'react';
import colors from '../../constants/colors';

const ArrowLeft = ({ width, height, fill, ...props }) => (
  <svg width={width} xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 0 16 12" fill={fill} {...props}>
    <path d="M5 7.4L7.2 9.7C7.7 10.2 7.7 11.1 7.2 11.6 6.6 12.1 5.8 12.1 5.3 11.6L0.9 7C0.4 6.4 0.4 5.6 0.9 5L5.3 0.4C5.8-0.1 6.6-0.1 7.2 0.4 7.7 0.9 7.7 1.8 7.2 2.3L5 4.6 14.2 4.6C14.9 4.6 15.5 5.2 15.5 6 15.5 6.8 14.9 7.4 14.2 7.4L5 7.4Z" />
  </svg>
);

ArrowLeft.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
};

ArrowLeft.defaultProps = {
  width: 15,
  height: 12,
  fill: colors.text,
};

export default ArrowLeft;

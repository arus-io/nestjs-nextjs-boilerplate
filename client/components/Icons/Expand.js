import PropTypes from 'prop-types';
import React from 'react';
import colors from '../../constants/colors';

const Expand = ({ size, fill, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 14 14" fill={fill} {...props}>
    <path d="M4.6 11.2L6.6 11.2C7.3 11.2 7.8 11.8 7.8 12.5 7.8 13.2 7.3 13.8 6.6 13.8L1.5 13.8C0.8 13.8 0.3 13.2 0.3 12.5L0.3 7.4C0.3 6.7 0.8 6.2 1.5 6.2 2.2 6.2 2.8 6.7 2.8 7.4L2.8 9.4 4.8 7.4C5.3 6.9 6.1 6.9 6.6 7.4 7.1 7.9 7.1 8.7 6.6 9.2L4.6 11.2ZM11.2 4.6L9.2 6.6C8.7 7.1 7.9 7.1 7.4 6.6 6.9 6.1 6.9 5.3 7.4 4.8L9.4 2.8 7.4 2.8C6.7 2.8 6.2 2.2 6.2 1.5 6.2 0.8 6.7 0.3 7.4 0.3L12.5 0.3C13.2 0.3 13.8 0.8 13.8 1.5L13.8 6.6C13.8 7.3 13.2 7.8 12.5 7.8 11.8 7.8 11.2 7.3 11.2 6.6L11.2 4.6Z" />
  </svg>
);

Expand.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

Expand.defaultProps = {
  size: 14,
  fill: colors.light,
};

export default Expand;

import PropTypes from 'prop-types';
import React from 'react';
import colors from '../../constants/colors';

const Ring = ({ size, fill, checked, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} {...props}>
    <path d="M12 24C18.6 24 24 18.6 24 12 24 5.4 18.6 0 12 0 5.4 0 0 5.4 0 12 0 18.6 5.4 24 12 24ZM12 21C7 21 3 17 3 12 3 7 7 3 12 3 17 3 21 7 21 12 21 17 17 21 12 21Z" />
  </svg>
);

Ring.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
  checked: PropTypes.bool,
};

Ring.defaultProps = {
  size: 24,
  fill: colors.secondary,
};

export default Ring;

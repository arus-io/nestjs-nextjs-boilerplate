import PropTypes from 'prop-types';
import React from 'react';
import colors from '../../constants/colors';

const StepCheckmark = ({ size, fill, checked, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} {...props}>
    {checked ? (
      <path d="M8 0L16 0C20.4 0 24 3.6 24 8L24 16C24 20.4 20.4 24 16 24L8 24C3.6 24 0 20.4 0 16L0 8C0 3.6 3.6 0 8 0ZM10.4 13.2L8.6 11.4C8 10.9 7 10.9 6.4 11.4 5.9 12 5.9 13 6.4 13.6L9.4 16.6C10.1 17.2 11.1 17.1 11.7 16.4L17.7 9.4C18.2 8.8 18.1 7.8 17.4 7.3 16.8 6.8 15.8 6.9 15.3 7.6L10.4 13.2Z" />
    ) : (
      <path d="M8 0L16 0C20.4 0 24 3.6 24 8L24 16C24 20.4 20.4 24 16 24L8 24C3.6 24 0 20.4 0 16L0 8C0 3.6 3.6 0 8 0ZM8 3C5.2 3 3 5.2 3 8L3 16C3 18.8 5.2 21 8 21L16 21C18.8 21 21 18.8 21 16L21 8C21 5.2 18.8 3 16 3L8 3Z" />
    )}
  </svg>
);

StepCheckmark.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
  checked: PropTypes.bool,
};

StepCheckmark.defaultProps = {
  size: 24,
  fill: colors.secondary,
};

export default StepCheckmark;

import PropTypes from 'prop-types';
import React from 'react';
import colors from '../../constants/colors';

const CalendarIcon = ({ size, fill, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={fill} viewBox="0 0 18 18" {...props}>
    <path d="M16.9 2.3L14.6 2.3 14.6 0 11.3 0 11.3 2.3 6.8 2.3 6.8 0 3.4 0 3.4 2.3 1.1 2.3C0.5 2.3 0 2.8 0 3.4L0 16.9C0 17.5 0.5 18 1.1 18L16.9 18C17.5 18 18 17.5 18 16.9L18 3.4C18 2.8 17.5 2.3 16.9 2.3ZM15.8 15.8L2.3 15.8 2.3 6.8 15.8 6.8 15.8 15.8Z" />
  </svg>
);

CalendarIcon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

CalendarIcon.defaultProps = {
  size: 18,
  fill: colors.lightText,
};

export default CalendarIcon;

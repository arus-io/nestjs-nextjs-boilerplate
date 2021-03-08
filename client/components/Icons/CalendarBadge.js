import PropTypes from 'prop-types';
import React from 'react';

const CalendarBadge = ({ size, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 40 40" {...props}>
    <circle cx="20" cy="20" r="20" fill="#F3F4FA" />
    <g fill="#00989F">
      <path d="M29.2 12.1L26.6 12.1 26.6 9.5 22.6 9.5 22.6 12.1 17.4 12.1 17.4 9.5 13.4 9.5 13.4 12.1 10.8 12.1C10.1 12.1 9.5 12.7 9.5 13.4L9.5 29.2C9.5 29.9 10.1 30.5 10.8 30.5L29.2 30.5C29.9 30.5 30.5 29.9 30.5 29.2L30.5 13.4C30.5 12.7 29.9 12.1 29.2 12.1ZM27.9 27.9L12.1 27.9 12.1 17.4 27.9 17.4 27.9 27.9Z" />
    </g>
  </svg>
);

CalendarBadge.propTypes = {
  size: PropTypes.number,
};

CalendarBadge.defaultProps = {
  size: 40,
};

export default CalendarBadge;

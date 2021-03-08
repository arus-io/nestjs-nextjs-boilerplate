import PropTypes from 'prop-types';
import React from 'react';

const StepCompletedBadge = ({ size, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 48 48" {...props}>
    <circle cx="24" cy="24" r="24" fill="#D8E3EB" />
    <g fill="#54B0B4">
      <path d="M23.5 13C25.7 13 27.8 13.6 29.6 14.7 30.2 15.1 30.4 15.9 30 16.5 29.6 17.1 28.8 17.3 28.2 16.9 26.8 16 25.2 15.6 23.5 15.6 18.6 15.6 14.6 19.6 14.6 24.5 14.6 29.4 18.6 33.4 23.5 33.4 28.4 33.4 32.4 29.4 32.4 24.5 32.4 23.7 32.3 22.9 32.2 22.2 32 21.5 32.4 20.8 33.1 20.6 33.8 20.4 34.5 20.8 34.6 21.5 34.9 22.4 35 23.5 35 24.5 35 30.8 29.8 36 23.5 36 17.2 36 12 30.8 12 24.5 12 18.2 17.2 13 23.5 13ZM35.6 14.4C36.1 14.9 36.1 15.6 35.7 16.1L35.6 16.2 24.4 27.4C23.9 27.9 23.2 27.9 22.7 27.5L22.6 27.4 18.5 23.4C18 22.9 18 22.1 18.5 21.6 19 21.1 19.7 21.1 20.2 21.5L20.3 21.6 23.5 24.7 33.8 14.4C34.3 13.9 35.1 13.9 35.6 14.4Z" />
    </g>
  </svg>
);

StepCompletedBadge.propTypes = {
  size: PropTypes.number,
};

StepCompletedBadge.defaultProps = {
  size: 48,
};

export default StepCompletedBadge;

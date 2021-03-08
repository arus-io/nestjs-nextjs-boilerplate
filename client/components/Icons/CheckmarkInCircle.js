import PropTypes from 'prop-types';
import React from 'react';

const CheckmarkInCircle = ({ size, fill, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill={fill} {...props}>
    <path d="M8.6 0.8C10.3 0.8 11.8 1.2 13.2 2 13.6 2.3 13.8 2.9 13.5 3.4 13.2 3.8 12.6 4 12.2 3.7 11.1 3 9.9 2.7 8.6 2.7 4.9 2.7 1.9 5.7 1.9 9.4 1.9 13.1 4.9 16.1 8.6 16.1 12.3 16.1 15.3 13.1 15.3 9.4 15.3 8.8 15.2 8.1 15.1 7.6 15 7.1 15.3 6.6 15.8 6.5 16.3 6.3 16.8 6.6 17 7.1 17.1 7.8 17.2 8.6 17.2 9.4 17.2 14.1 13.4 18 8.6 18 3.9 18 0 14.1 0 9.4 0 4.6 3.9 0.8 8.6 0.8ZM17.7 1.8C18.1 2.1 18.1 2.7 17.8 3.1L17.7 3.2 9.3 11.6C8.9 11.9 8.4 12 8 11.7L7.9 11.6 4.9 8.5C4.5 8.1 4.5 7.5 4.9 7.2 5.2 6.8 5.8 6.8 6.2 7.1L6.2 7.2 8.6 9.6 16.4 1.8C16.7 1.4 17.3 1.4 17.7 1.8Z" />
  </svg>
);

CheckmarkInCircle.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

CheckmarkInCircle.defaultProps = {
  size: 18,
  fill: '#333F4D',
};

export default CheckmarkInCircle;

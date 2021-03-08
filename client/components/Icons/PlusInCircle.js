import PropTypes from 'prop-types';
import React from 'react';

const PlusInCircle = ({ size, fill, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill={fill} {...props}>
    <path d="M7 13.9C3.2 13.9 0.1 10.8 0.1 7 0.1 3.2 3.2 0.1 7 0.1 10.8 0.1 13.9 3.2 13.9 7 13.9 10.8 10.8 13.9 7 13.9ZM7 12C9.8 12 12 9.8 12 7 12 4.2 9.8 2 7 2 4.2 2 2 4.2 2 7 2 9.8 4.2 12 7 12ZM7.9 6.1L9.2 6.1C9.7 6.1 10.1 6.5 10.1 7 10.1 7.5 9.7 7.9 9.2 7.9L7.9 7.9 7.9 9.2C7.9 9.7 7.5 10.1 7 10.1 6.5 10.1 6.1 9.7 6.1 9.2L6.1 7.9 4.8 7.9C4.3 7.9 3.9 7.5 3.9 7 3.9 6.5 4.3 6.1 4.8 6.1L6.1 6.1 6.1 4.8C6.1 4.3 6.5 3.9 7 3.9 7.5 3.9 7.9 4.3 7.9 4.8L7.9 6.1Z" />
  </svg>
);

PlusInCircle.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

PlusInCircle.defaultProps = {
  size: 14,
  fill: '#FFFFFF',
};

export default PlusInCircle;

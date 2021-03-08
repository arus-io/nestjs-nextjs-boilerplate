import PropTypes from 'prop-types';
import React from 'react';

const OutlineCheckmark = ({ size, fill, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill={fill} {...props}>
    <path d="M5.5 0.5L10.5 0.5C13.3 0.5 15.5 2.7 15.5 5.5L15.5 10.5C15.5 13.3 13.3 15.5 10.5 15.5L5.5 15.5C2.7 15.5 0.5 13.3 0.5 10.5L0.5 5.5C0.5 2.7 2.7 0.5 5.5 0.5ZM5.5 2.4C3.8 2.4 2.4 3.8 2.4 5.5L2.4 10.5C2.4 12.2 3.8 13.6 5.5 13.6L10.5 13.6C12.2 13.6 13.6 12.2 13.6 10.5L13.6 5.5C13.6 3.8 12.2 2.4 10.5 2.4L5.5 2.4ZM7.3 8.5L9.8 5.5C10.1 5.1 10.7 5.1 11.1 5.4 11.5 5.7 11.6 6.3 11.2 6.7L8.1 10.5C7.8 10.9 7.1 10.9 6.7 10.5L4.8 8.7C4.5 8.3 4.5 7.7 4.8 7.3 5.2 7 5.8 7 6.2 7.3L7.3 8.5Z" />
  </svg>
);

OutlineCheckmark.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

OutlineCheckmark.defaultProps = {
  size: 16,
  fill: '#ffffff',
};

export default OutlineCheckmark;

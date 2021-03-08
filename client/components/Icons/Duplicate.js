import PropTypes from 'prop-types';
import React from 'react';

import colors from '../../constants/colors';

const Duplicate = ({ width, height, fill }) => (
  <svg width={width} height={height} viewBox="0 0 20 22">
    <g fill={fill}>
      <path d="M7.9 8.2C7.9 7.3 8.6 6.7 9.4 6.7L18.5 6.7C19.3 6.7 20 7.3 20 8.2L20 20.5C20 21.3 19.3 22 18.5 22L9.4 22C8.6 22 7.9 21.3 7.9 20.5L7.9 8.2ZM10.9 9.7L10.9 19 17 19 17 9.7 10.9 9.7ZM3 15.7L6 15.7C6.9 15.7 7.5 16.4 7.5 17.2 7.5 18.1 6.9 18.7 6 18.7L1.5 18.7C0.7 18.7 0 18.1 0 17.2L0 1.5C0 0.7 0.7 0 1.5 0L14 0C14.8 0 15.5 0.7 15.5 1.5L15.5 4.8C15.5 5.6 14.8 6.3 14 6.3 13.1 6.3 12.5 5.6 12.5 4.8L12.5 3 3 3 3 15.7Z" />
    </g>
  </svg>
);

Duplicate.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.number,
  fill: PropTypes.string,
};

Duplicate.defaultProps = {
  width: 20,
  height: 22,
  fill: colors.primary,
};

export default Duplicate;

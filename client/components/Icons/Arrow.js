import PropTypes from 'prop-types';
import React from 'react';
import colors from '../../constants/colors';

const Arrow = ({ fill, side, width, height }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 10 12"
    style={{
      transform: side === 'left' ? 'scaleX(-1)' : '',
    }}
    fill={fill}
  >
    <path d="M4.4 10L7.9 6 4.4 2C4.1 1.6 4.1 1.1 4.5 0.7 4.9 0.4 5.5 0.4 5.8 0.8L9.8 5.4C10.1 5.7 10.1 6.3 9.8 6.6L5.8 11.2C5.5 11.6 4.9 11.6 4.5 11.3 4.1 10.9 4.1 10.4 4.4 10ZM0.7 10L4.2 6 0.7 2C0.4 1.6 0.4 1.1 0.8 0.7 1.2 0.4 1.8 0.4 2.1 0.8L6.1 5.4C6.4 5.7 6.4 6.3 6.1 6.6L2.1 11.2C1.8 11.6 1.2 11.6 0.8 11.3 0.4 10.9 0.4 10.4 0.7 10Z" />
  </svg>
);

Arrow.propTypes = {
  fill: PropTypes.string,
  side: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

Arrow.defaultProps = {
  side: 'right',
  fill: colors.text,
  width: 10,
  height: 12,
};

export default Arrow;

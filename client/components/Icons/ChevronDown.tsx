import PropTypes from 'prop-types';
import React from 'react';

import colors from '../../constants/colors';

interface IProps {
  width?: number;
  height?: number;
  fill?: string;
}

const ChevronDown = ({ width, height, fill, ...props }: IProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={fill}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

ChevronDown.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
};

ChevronDown.defaultProps = {
  width: 18,
  height: 18,
  fill: colors.text,
};

export default ChevronDown;

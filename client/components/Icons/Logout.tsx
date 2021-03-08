import PropTypes from 'prop-types';
import React from 'react';

interface IProps {
  fill?: string;
  size?: number;
  [key: string]: string | number;
}

const Logout = ({ width, height, fill, ...props }: IProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 18 16" {...props}>
    <g fill={fill}>
      <path d="M15 2.8L9 2.8 9 4.5C9 5.1 8.5 5.6 7.9 5.6 7.3 5.6 6.8 5.1 6.8 4.5L6.8 2.5C6.8 1.4 7.7 0.5 8.8 0.5L15.2 0.5C16.3 0.5 17.3 1.4 17.3 2.5L17.3 13.5C17.3 14.6 16.3 15.5 15.2 15.5L8.8 15.5C7.7 15.5 6.8 14.6 6.8 13.5L6.8 11.5C6.8 10.9 7.3 10.4 7.9 10.4 8.5 10.4 9 10.9 9 11.5L9 13.3 15 13.3 15 2.8ZM4.6 6.9L11.8 6.9C12.4 6.9 12.9 7.4 12.9 8 12.9 8.6 12.4 9.1 11.8 9.1L4.6 9.1 5.4 9.9C5.8 10.4 5.8 11.1 5.4 11.5 4.9 12 4.2 12 3.8 11.5L1.1 8.8C0.6 8.4 0.6 7.6 1.1 7.2L3.8 4.5C4.2 4 4.9 4 5.4 4.5 5.8 4.9 5.8 5.6 5.4 6.1L4.6 6.9Z" />
    </g>
  </svg>
);

Logout.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
};

Logout.defaultProps = {
  width: 18,
  height: 16,
  fill: 'currentColor',
};

export default Logout;

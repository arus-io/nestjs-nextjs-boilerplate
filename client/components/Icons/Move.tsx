import PropTypes from 'prop-types';
import React from 'react';

import colors from '../../constants/colors';

interface IProps {
  fill?: string;
  height?: number;
  width?: number;
  [key: string]: string | number;
}

const Move = ({ width, height, fill, ...props }: IProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 22 22" fill={fill} {...props}>
    <path d="M5.3 12.9C5.9 13.4 5.9 14.3 5.3 14.9 4.8 15.4 3.9 15.4 3.3 14.9L3.3 14.9 0.4 12C0.4 12 0.4 12 0.4 12 0.4 12 0.4 12 0.3 11.9 0.3 11.9 0.3 11.9 0.3 11.9 0.3 11.9 0.3 11.8 0.3 11.8 0.2 11.8 0.2 11.8 0.2 11.8 0.2 11.8 0.2 11.7 0.2 11.7 0.2 11.7 0.2 11.7 0.2 11.7L0.2 11.6C0.1 11.5 0 11.2 0 11 0 10.8 0.1 10.5 0.2 10.4L0.2 10.3C0.2 10.3 0.2 10.3 0.2 10.3 0.2 10.3 0.2 10.2 0.2 10.2 0.2 10.2 0.2 10.2 0.3 10.2 0.3 10.2 0.3 10.1 0.3 10.1 0.3 10.1 0.4 10 0.4 10L0.3 10.1C0.4 10 0.4 10 0.4 10L0.4 10 3.3 7.1C3.9 6.6 4.8 6.6 5.3 7.1 5.9 7.7 5.9 8.6 5.3 9.1L5.3 9.1 4.9 9.6 9.6 9.6 9.6 4.9 9.1 5.3C8.6 5.8 7.8 5.9 7.2 5.4L7.1 5.3C6.6 4.8 6.6 3.9 7.1 3.3L7.1 3.3 10 0.4C10 0.4 10 0.4 10 0.4 10 0.4 10 0.4 10.1 0.3 10.1 0.3 10.1 0.3 10.1 0.3 10.1 0.3 10.2 0.3 10.2 0.3 10.2 0.2 10.2 0.2 10.2 0.2 10.2 0.2 10.3 0.2 10.3 0.2 10.3 0.2 10.3 0.2 10.3 0.2L10.4 0.2C10.5 0.1 10.8 0 11 0 11.2 0 11.5 0.1 11.6 0.2L11.7 0.2C11.7 0.2 11.7 0.2 11.7 0.2 11.7 0.2 11.8 0.2 11.8 0.2 11.8 0.2 11.8 0.2 11.8 0.3 11.8 0.3 11.9 0.3 11.9 0.3 11.9 0.3 12 0.4 12 0.4L11.9 0.3C12 0.4 12 0.4 12 0.4L12 0.4 14.9 3.3C15.4 3.9 15.4 4.8 14.9 5.3 14.3 5.9 13.4 5.9 12.9 5.3L12.9 5.3 12.4 4.9 12.4 9.6 17.1 9.6 16.7 9.1C16.2 8.6 16.1 7.8 16.6 7.2L16.7 7.1C17.2 6.6 18.1 6.6 18.7 7.1L18.7 7.1 21.6 10C21.6 10 21.6 10 21.6 10 21.6 10 21.6 10 21.7 10.1 21.7 10.1 21.7 10.1 21.7 10.1 21.7 10.1 21.7 10.2 21.7 10.2 21.8 10.2 21.8 10.2 21.8 10.2 21.8 10.2 21.8 10.3 21.8 10.3 21.8 10.3 21.8 10.3 21.8 10.3L21.8 10.4C21.9 10.5 22 10.8 22 11 22 11.2 21.9 11.5 21.8 11.6L21.8 11.7C21.8 11.7 21.8 11.7 21.8 11.7 21.8 11.7 21.8 11.8 21.8 11.8 21.8 11.8 21.8 11.8 21.7 11.8 21.7 11.8 21.7 11.9 21.7 11.9 21.7 11.9 21.6 12 21.6 12L21.7 11.9C21.6 12 21.6 12 21.6 12L21.6 12 18.7 14.9C18.1 15.4 17.2 15.4 16.7 14.9 16.1 14.3 16.1 13.4 16.7 12.9L16.7 12.9 17.1 12.4 12.4 12.4 12.4 17.1 12.9 16.7C13.4 16.2 14.2 16.1 14.8 16.6L14.9 16.7C15.4 17.2 15.4 18.1 14.9 18.7L14.9 18.7 12 21.6C12 21.6 12 21.6 12 21.6 12 21.6 12 21.6 11.9 21.7 11.9 21.7 11.9 21.7 11.9 21.7 11.9 21.7 11.8 21.7 11.8 21.7 11.8 21.8 11.8 21.8 11.8 21.8 11.8 21.8 11.7 21.8 11.7 21.8 11.7 21.8 11.7 21.8 11.7 21.8L11.6 21.8C11.5 21.9 11.2 22 11 22 10.8 22 10.5 21.9 10.4 21.8L10.3 21.8C10.3 21.8 10.3 21.8 10.3 21.8 10.3 21.8 10.2 21.8 10.2 21.8 10.2 21.8 10.2 21.8 10.2 21.7 10.2 21.7 10.1 21.7 10.1 21.7 10.1 21.7 10 21.6 10 21.6L10.1 21.7C10 21.6 10 21.6 10 21.6L10 21.6 7.1 18.7C6.6 18.1 6.6 17.2 7.1 16.7 7.7 16.1 8.6 16.1 9.1 16.7L9.1 16.7 9.6 17.1 9.6 12.4 4.9 12.4Z" />
  </svg>
);

Move.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
};

Move.defaultProps = {
  width: 22,
  height: 22,
  fill: colors.light,
};

export default Move;

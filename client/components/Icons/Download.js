import PropTypes from 'prop-types';
import React from 'react';
import colors from '../../constants/colors';

const DownloadIcon = ({ width, height, fill, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 18 20" fill={fill} {...props}>
    <path d="M10.2 11L13.7 7.4C14.2 6.9 14.9 6.9 15.4 7.4 15.9 7.8 15.9 8.6 15.4 9.1L9.9 15C9.4 15.5 8.6 15.5 8.1 15L2.6 9.1C2.1 8.6 2.1 7.8 2.6 7.4 3.1 6.9 3.8 6.9 4.3 7.4L7.8 11 7.8 1.3C7.8 0.6 8.3 0 9 0 9.7 0 10.2 0.6 10.2 1.3L10.2 11ZM16.8 17.5C17.5 17.5 18 18 18 18.7 18 19.4 17.5 20 16.8 20L1.2 20C0.5 20 0 19.4 0 18.7 0 18 0.5 17.5 1.2 17.5L16.8 17.5Z" />
  </svg>
);

DownloadIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
};

DownloadIcon.defaultProps = {
  width: 18,
  height: 20,
  fill: colors.text,
};

export default DownloadIcon;

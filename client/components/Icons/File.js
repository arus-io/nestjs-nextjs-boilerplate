import PropTypes from 'prop-types';
import React from 'react';
import colors from '../../constants/colors';

const FileIcon = ({ width, height, fill, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 14 18" fill={fill} {...props}>
    <path d="M11.5 6.8L8.1 6.8C7.5 6.8 7 6.2 7 5.6L7 3 2.5 3 2.5 15 11.5 15 11.5 6.8ZM13.8 16.1C13.8 16.7 13.2 17.3 12.6 17.3L1.4 17.3C0.8 17.3 0.3 16.7 0.3 16.1L0.3 1.9C0.3 1.3 0.8 0.8 1.4 0.8L8.6 0.8C8.9 0.8 9.2 0.9 9.4 1.1L13.4 5.2C13.6 5.4 13.8 5.7 13.8 6L13.8 16.1Z" />
  </svg>
);

FileIcon.propTypes = {
  fill: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

FileIcon.defaultProps = {
  fill: colors.text,
  width: 14,
  height: 18,
};

export default FileIcon;

import PropTypes from 'prop-types';
import React from 'react';
import colors from '../../constants/colors';

const PreviewIcon = ({ width, height, fill, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 22 16" fill={fill} {...props}>
    <path d="M0.2 8.6C-0.1 8.2-0.1 7.8 0.2 7.4 0.3 7.1 0.6 6.7 0.9 6.2 1.5 5.4 2.2 4.5 3 3.8 5.4 1.4 8 0 11 0 14 0 16.6 1.4 19 3.8 19.8 4.5 20.5 5.4 21.1 6.2 21.4 6.7 21.7 7.1 21.8 7.4 22.1 7.8 22.1 8.2 21.8 8.6 21.7 8.9 21.4 9.3 21.1 9.8 20.5 10.6 19.8 11.5 19 12.2 16.6 14.6 14 16 11 16 8 16 5.4 14.6 3 12.2 2.2 11.5 1.5 10.6 0.9 9.8 0.6 9.3 0.3 8.9 0.2 8.6ZM3.1 8.3C3.6 9.1 4.2 9.8 4.9 10.5 6.8 12.4 8.9 13.5 11 13.5 13.1 13.5 15.2 12.4 17.1 10.5 17.8 9.8 18.4 9.1 18.9 8.3 19 8.2 19.1 8.1 19.1 8 19.1 7.9 19 7.8 18.9 7.7 18.4 6.9 17.8 6.2 17.1 5.5 15.2 3.6 13.1 2.5 11 2.5 8.9 2.5 6.8 3.6 4.9 5.5 4.2 6.2 3.6 6.9 3.1 7.7 3 7.8 2.9 7.9 2.9 8 2.9 8.1 3 8.2 3.1 8.3ZM11 11.8C8.8 11.8 7 10.1 7 8 7 5.9 8.8 4.2 11 4.2 13.2 4.2 15 5.9 15 8 15 10.1 13.2 11.8 11 11.8ZM11 9.3C11.7 9.3 12.3 8.7 12.3 8 12.3 7.3 11.7 6.7 11 6.7 10.3 6.7 9.7 7.3 9.7 8 9.7 8.7 10.3 9.3 11 9.3Z" />
  </svg>
);

PreviewIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
};

PreviewIcon.defaultProps = {
  width: 22,
  height: 16,
  fill: colors.primary,
};

export default PreviewIcon;

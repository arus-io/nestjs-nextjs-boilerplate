import PropTypes from 'prop-types';
import React from 'react';

import colors from '../../constants/colors';

interface IProps extends React.SVGProps<SVGSVGElement> {
  fill?: string;
  size?: number;
}

const Edit = ({ size, ...props }: IProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" {...props}>
    <path d="M13.5 4.7L15.3 6.5 16.9 5 15 3.1 13.5 4.7ZM13.5 8.4L11.6 6.5 5.3 12.9 7.1 14.7 13.5 8.4ZM5.1 16.4L3.6 14.9 3.1 16.9 5.1 16.4ZM14 0.4C14.6-0.1 15.4-0.1 15.9 0.4L19.6 4.1C20.1 4.6 20.1 5.4 19.6 6L7.2 18.4C7 18.5 6.8 18.7 6.6 18.7L1.6 20C0.7 20.2-0.2 19.3 0 18.4L1.3 13.4C1.3 13.2 1.5 13 1.6 12.8L14 0.4Z" />
  </svg>
);

Edit.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

Edit.defaultProps = {
  size: 20,
  fill: colors.primary,
};

export default Edit;

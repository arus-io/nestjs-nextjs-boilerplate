import PropTypes from 'prop-types';
import React from 'react';

import colors from '../../constants/colors';

interface IProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  fill?: string;
}

const Close = ({ size, fill, ...props }: IProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={fill} viewBox="0 0 16 16" {...props}>
    <g fill="none">
      <g fill={fill}>
        <path d="M15.1 0.9C15.6 1.5 15.6 2.5 15.1 3.1L10.1 8 15.1 12.9C15.6 13.5 15.6 14.5 15.1 15.1 14.5 15.6 13.5 15.6 12.9 15.1L8 10.1 3.1 15.1C2.5 15.6 1.5 15.6 0.9 15.1 0.4 14.5 0.4 13.5 0.9 12.9L5.9 8 0.9 3.1C0.4 2.5 0.4 1.5 0.9 0.9 1.5 0.4 2.5 0.4 3.1 0.9L8 5.9 12.9 0.9C13.5 0.4 14.5 0.4 15.1 0.9Z" />
      </g>
    </g>
  </svg>
);

Close.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

Close.defaultProps = {
  size: 16,
  fill: colors.primary,
};

export default Close;

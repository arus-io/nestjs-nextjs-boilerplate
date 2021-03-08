import PropTypes from 'prop-types';
import React from 'react';

import colors from '../../constants/colors';

interface IProps {
  fill?: string;
  height?: number;
  width?: number;
  [key: string]: string | number;
}

const SearchIcon = ({ width, height, fill, ...props }: IProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 18 18" {...props}>
    <path
      fill={fill}
      fillRule="nonzero"
      d="M7.5652174.75c3.7639406 0 6.8152174 3.05127676 6.8152174 6.8152174 0 1.493926-.480678 2.8755836-1.2958104 3.9987493l3.850197 3.849038c.4202381.4202381.4202381 1.1015786 0 1.5218167-.3939732.3939732-1.017431.4185966-1.4400898.07387l-.0817269-.07387-3.849038-3.850197c-1.1231657.8151324-2.5048233 1.2958104-3.9987493 1.2958104C3.80127676 14.3804348.75 11.329158.75 7.5652174.75 3.80127676 3.80127676.75 7.5652174.75zm0 2.15217391c-2.57532781 0-4.66304349 2.08771568-4.66304349 4.66304349 0 2.5753278 2.08771568 4.6630435 4.66304349 4.6630435 1.2817025 0 2.4426281-.5171075 3.2855289-1.3540745.0028664-.0039841.0069766-.0081609.0111279-.0123122l.0123122-.0111279c.836967-.8429008 1.3540745-2.0038264 1.3540745-3.2855289 0-2.57532781-2.0877157-4.66304349-4.6630435-4.66304349z"
    />
  </svg>
);

SearchIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
};

SearchIcon.defaultProps = {
  width: 18,
  height: 18,
  fill: colors.lightText,
};

export default SearchIcon;

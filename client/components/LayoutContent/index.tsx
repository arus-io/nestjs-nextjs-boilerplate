import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './LayoutContent.module.scss';

interface IProps {
  children: React.ReactNode;
  variant?: 'small' | 'medium' | 'full';
}

const LayoutContent = ({ children, variant }: IProps) => (
  <div
    className={cx(styles.content, {
      [styles[variant]]: variant,
    })}
  >
    {children}
  </div>
);

LayoutContent.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['small', 'medium', 'full']),
};

LayoutContent.defaultProps = {
  variant: 'medium',
};

export default LayoutContent;

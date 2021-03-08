import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { getNavigationLayout } from '../NavigationLayout';
import styles from './DashboardLayout.module.scss';

interface IProps {
  children: React.ReactNode;
  variant?: 'small' | 'medium' | 'full';
  className?: string;
  style?: React.CSSProperties;
}

const DashboardLayout = ({ children, variant, className, style }: IProps) => (
  <div
    className={cx(
      styles.content,
      {
        [styles[variant]]: variant,
      },
      className,
    )}
    style={style}
  >
    {children}
  </div>
);

DashboardLayout.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['small', 'medium', 'full']),
  className: PropTypes.string,
  style: PropTypes.object,
};

DashboardLayout.defaultProps = {
  variant: 'medium',
};

export const getSmallLayout = (page) => getNavigationLayout(<DashboardLayout variant="small">{page}</DashboardLayout>);
export const getLayout = (page) => getNavigationLayout(<DashboardLayout>{page}</DashboardLayout>);
export const getFullLayout = (page) => getNavigationLayout(<DashboardLayout variant="full">{page}</DashboardLayout>);
export const getFullContentLayout = (page) =>
  getNavigationLayout(
    <DashboardLayout variant="full" className={styles.fullContent}>
      {page}
    </DashboardLayout>,
  );

export default DashboardLayout;

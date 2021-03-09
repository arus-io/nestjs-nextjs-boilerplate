import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Link } from '../../router';
import styles from './Nav.module.scss';

const Nav = ({ children, className }) => <div className={cx(styles.nav, className)}>{children}</div>;

Nav.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

interface INavLinkProps {
  children: React.ReactNode;
  className?: string;
  active: boolean;
  disabled?: boolean;
  href: string;
  shallow?: boolean;
  small?: boolean;
  color: string;
}
export const NavLink = ({ href, className, children, disabled, active, shallow, small, ...props }: INavLinkProps) => (
  <Link href={href} shallow={shallow}>
    <button
      type="button"
      disabled={disabled}
      className={cx(styles.link, className, {
        [styles.active]: active,
        [styles.small]: small,
      })}
      {...props}
    >
      {children}
    </button>
  </Link>
);

export default Nav;

NavLink.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  href: PropTypes.string,
  shallow: PropTypes.bool,
  small: PropTypes.bool,
  color: PropTypes.string,
};

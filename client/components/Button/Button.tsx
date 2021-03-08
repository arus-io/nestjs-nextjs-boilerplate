import cx from 'classnames';
import React from 'react';

import { Link } from '../../router';
import Loading from '../Loading';
import styles from './Button.module.scss';

export type ButtonColors =
  | 'primary'
  | 'secondary'
  | 'accentLight'
  | 'accentDark'
  | 'lightBlue'
  | 'lightYellow'
  | 'lightRed'
  | 'dark'
  | 'light'
  | 'lightGreen'
  | 'accentGreen';

interface ButtonPropTypes {
  children: any;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: any;
  type?: string;
  color?: ButtonColors;
  as?: string;
  href?: string;
  icon?: any;
  plain?: boolean;
  iconProps?: any;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
}

const Button = ({
  color,
  href,
  className,
  type,
  loading,
  children,
  disabled,
  plain,
  icon: Icon,
  iconProps,
  as,
  ...props
}: ButtonPropTypes) => {
  const ButtonEl = as as any;
  const elementType = href && !disabled ? undefined : type;

  const content = (
    <ButtonEl
      href={href}
      type={elementType}
      className={cx(
        styles.button,
        styles[color],
        {
          [styles.disabled]: disabled,
          [styles.haveIcon]: !!Icon,
          [styles.loading]: loading,
          [styles.plain]: plain,
        },
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      <div className={styles.content} style={loading ? { visibility: 'hidden' } : null}>
        {Icon ? <Icon className={styles.icon} {...iconProps} /> : null}
        {children}
      </div>
      {loading && (
        <div className={styles.loadingWrap}>
          <Loading />
        </div>
      )}
    </ButtonEl>
  );
  if (href && !disabled) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

Button.defaultProps = {
  style: {},
  type: 'button',
  as: 'button',
  plain: false,
};

export default Button;

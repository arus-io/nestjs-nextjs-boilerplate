import React from 'react';
import cx from 'classnames';
import { Link } from '../../router';
import styles from './IconButton.module.scss';

interface IconButtonProps {
  children?: any;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  gray?: boolean;
  style?: any;
  iconProps?: any;
  type?: string;
  href?: string;
  icon?: any;
  color?: string;
  as: string;
  onClick?: any;
  iconSide?: 'left' | 'right';
  target?: any;
}
const Button = ({
  color,
  href,
  className,
  type,
  loading,
  children,
  disabled,
  icon: Icon,
  as,
  iconProps,
  iconSide,
  ...props
}: IconButtonProps) => {
  let ButtonEl = as as any;
  const elementType = href && !disabled ? undefined : type;
  if (href) {
    ButtonEl = 'a';
  }
  const content = (
    <ButtonEl
      href={href}
      type={elementType}
      className={cx(styles.button, className, {
        [styles[color]]: true,
        [styles.disabled]: disabled,
        [styles[iconSide]]: true,
        [styles.noChildren]: !children,
      })}
      disabled={disabled || loading}
      {...props}
    >
      {children && <div className={styles.content}>{children}</div>}
      <Icon className={styles.icon} {...iconProps} />
    </ButtonEl>
  );

  const isExternalUrl = href?.indexOf('http') === 0;

  if (href && !disabled && !isExternalUrl) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

Button.defaultProps = {
  style: {},
  iconProps: {},
  type: 'button',
  color: 'primary',
  as: 'button',
  iconSide: 'right',
};

export default Button;

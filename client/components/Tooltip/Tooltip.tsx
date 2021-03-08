import cx from 'classnames';
import React, { useState } from 'react';
import OutsideClick from 'react-outside-click-handler';

import styles from './Tooltip.module.scss';

export interface ITooltipProps {
  header: string;
  content: string | React.ReactNode;
  children: any;
  direction: string;
  size?: 'large';
}

const Tooltip = (props: ITooltipProps) => {
  const { header, content, children, direction, size } = props;
  const [active, setActive] = useState(false);

  const showTooltip = () => {
    setActive(!active);
  };

  const hideTooltip = () => {
    setActive(false);
  };

  return (
    <div className={styles.tooltipWrapper}>
      <div onMouseDown={showTooltip}>{children}</div>
      {active && (
        <OutsideClick onOutsideClick={hideTooltip}>
          <div
            className={cx(styles.tooltipTip, {
              [styles.right]: direction === 'right',
              [styles.left]: direction === 'left',
              [styles.bottom]: direction === 'bottom',
              [styles.top]: direction === 'top',
              [styles.large]: size === 'large',
            })}
          >
            <div className={styles.headerTooltip}>{header}</div>
            <div className={styles.bodyTooltip}>{content}</div>
          </div>
        </OutsideClick>
      )}
    </div>
  );
};

export default Tooltip;

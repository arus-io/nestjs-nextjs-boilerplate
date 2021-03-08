import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import IconButton from '../IconButton';
import QuestionIcon from '../Icons/Question';
import Tooltip from '../Tooltip';
import { ITooltipProps } from '../Tooltip/Tooltip';
import styles from './Label.module.scss';

interface IProps extends React.HTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  className?: string;
  children?: React.ReactNode;
  tooltip?: Omit<ITooltipProps, 'children'>;
}

const Label = ({ children, className, htmlFor, tooltip, ...rest }: IProps) => (
  <div className={styles.labelContainer}>
    <label className={cx(styles.label, className)} htmlFor={htmlFor} {...rest}>
      {children}
    </label>
    {tooltip ? (
      <Tooltip {...tooltip}>
        {/* TODO Use featherIcon */}
        <IconButton icon={QuestionIcon} onClick={() => null} iconProps={{ size: 16 }} iconSide="left" />
      </Tooltip>
    ) : null}
  </div>
);

Label.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Label;

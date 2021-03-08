import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import IconButton from '../IconButton';
import QuestionIcon from '../Icons/Question';
import Label from '../Label';
import Loading from '../Loading';
import PlainInput from '../PlainInput';
import Tooltip from '../Tooltip';
import styles from './Input.module.scss';

interface IProps {
  input: any;
  label?: string;
  className?: string;
  id: string;
  help?: any;
  meta: any;
  type?: string;
  as?: string;
  disabled?: boolean;
  tooltip?: any;
  inputClassName?: string;
  [key: string]: any;
}

const Input = ({
  input,
  label,
  className,
  id,
  type,
  help,
  meta: { asyncValidating, error, touched },
  as,
  disabled,
  tooltip,
  inputClassName,
  ...rest
}: IProps) => {
  let info;
  let infoClassName;

  if (touched && error) {
    infoClassName = styles.error;
    info = error;
  } else if (asyncValidating) {
    infoClassName = styles.loading;
    info = <Loading size="small" />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { value, ...restInput } = input;

  return (
    <div
      className={cx(styles.input, className, {
        [styles.disabled]: disabled,
      })}
    >
      <div className={styles.inputLabel}>
        {label ? <Label htmlFor={id} dangerouslySetInnerHTML={{ __html: label }} /> : null}
        {tooltip ? (
          <Tooltip {...tooltip}>
            <IconButton icon={QuestionIcon} onClick={() => null} iconProps={{ size: 16 }} iconSide="left" />
          </Tooltip>
        ) : null}
      </div>
      <PlainInput
        as={as}
        type={type}
        id={id}
        value={input.value === 0 ? 0 : input.value || ''}
        className={inputClassName}
        {...restInput}
        {...rest}
        disabled={disabled}
      />
      {info ? <div className={cx(styles.info, infoClassName)}>{info}</div> : null}
      {help ? (
        <div className={cx(styles.info, styles.help)}>{typeof help === 'function' ? help(input.value) : help}</div>
      ) : null}
    </div>
  );
};

Input.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  help: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  meta: PropTypes.object,
  type: PropTypes.string,
  as: PropTypes.string,
  disabled: PropTypes.bool,
  tooltip: PropTypes.object,
};

export default Input;

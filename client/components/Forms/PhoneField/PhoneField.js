import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import InputMask from 'react-input-mask';
import styles from './PhoneField.module.scss';
import Label from '../../Label';
import PlainInput from '../../PlainInput';
import Loading from '../../Loading';

const PhoneField = ({
  input,
  id,
  label,
  className,
  disabled,
  help,
  meta: { touched, asyncValidating, error },
  as,
  ...rest
}) => {
  let info;
  let infoClassName;
  if (touched && error) {
    infoClassName = styles.error;
    info = error;
  } else if (asyncValidating) {
    infoClassName = styles.loading;
    info = <Loading size="small" />;
  }
  return (
    <div className={cx(styles.wrap, className, { [styles.disabled]: disabled })}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <InputMask
        mask="(999) 999-9999"
        maskChar="_"
        className={styles.select}
        {...input}
        onChange={(e) => {
          e.preventDefault();
          input.onChange(e.target.value.replace(/[^\d]/g, ''));
        }}
        onBlur={(e) => {
          e.preventDefault();
          input.onChange(e.target.value.replace(/[^\d]/g, ''));
        }}
        value={input.value.replace(/[^\d]/g, '')}
        disabled={disabled}
        {...rest}
      >
        {(passProps) => <PlainInput as={as} id={id} {...passProps} type="text" />}
      </InputMask>
      {info ? <div className={cx(styles.info, infoClassName)}>{info}</div> : null}
      {help ? (
        <div className={cx(styles.info, styles.help)}>{typeof help === 'function' ? help(input.value) : help}</div>
      ) : null}
    </div>
  );
};

PhoneField.propTypes = {
  input: PropTypes.object,
  id: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  meta: PropTypes.object,
  alwaysShowMask: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  help: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  as: PropTypes.string,
};

PhoneField.defaultProps = {
  alwaysShowMask: false,
  placeholder: '',
  disabled: false,
};

export default PhoneField;

import PropTypes from 'prop-types';
import React from 'react';
import InputMask from 'react-input-mask';

import PlainInput from '../../PlainInput';
import styles from './PhoneField.module.scss';

interface IProps {
  id: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  alwaysShowMask?: boolean;
  disabled?: boolean;
}

const PlainPhoneNumberInput = ({ id, className, disabled, alwaysShowMask = false, onChange, value }: IProps) => {
  return (
    <InputMask
      mask="(999) 999-9999"
      maskChar="_"
      className={`${styles.select}${className ? ` ${className}` : ''}`}
      onChange={(e) => {
        e.preventDefault();
        onChange(e.target.value.replace(/[^\d]/g, ''));
      }}
      onBlur={(e) => {
        e.preventDefault();
        onChange(e.target.value.replace(/[^\d]/g, ''));
      }}
      value={value.replace(/[^\d]/g, '')}
      disabled={disabled}
      alwaysShowMask={alwaysShowMask}
    >
      {(passProps) => <PlainInput id={id} {...passProps} type="text" />}
    </InputMask>
  );
};

PlainPhoneNumberInput.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  alwaysShowMask: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default PlainPhoneNumberInput;

import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import CheckboxIcon from '../../Icons/StepCheckmark';
import Label from '../../Label';
import DescriptionText from '../DescriptionText';
import styles from './Checkbox.module.scss';

const Checkbox = ({
  input,
  label,
  text,
  meta: { touched, error, warning },
  id,
  className,
  disabled,
  fill,
  description,
}) => (
  <div className={className}>
    {description ? <DescriptionText dangerouslySetInnerHTML={{ __html: description }} /> : null}
    {label ? <Label htmlFor={id}>{label}</Label> : null}
    <label
      htmlFor={id}
      className={cx(styles.label, className, {
        [styles.disabled]: disabled,
      })}
    >
      <input id={id} name={id} type="checkbox" {...input} disabled={disabled} />
      <CheckboxIcon size={18} checked={input.value} fill={fill} />
      <div className={styles.text}>{text}</div>
    </label>
    {touched && error ? <span className={styles.error}>{error}</span> : null}
    {touched && warning ? <span className={styles.warning}>{warning}</span> : null}
  </div>
);

Checkbox.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  text: PropTypes.string,
  meta: PropTypes.object,
  id: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  fill: PropTypes.string,
  description: PropTypes.string,
};

Checkbox.defaultProps = {
  meta: {},
};

export default Checkbox;

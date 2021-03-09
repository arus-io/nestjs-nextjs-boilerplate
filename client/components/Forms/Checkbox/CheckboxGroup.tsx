import { Field, useField } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

import colors from '../../../constants/colors';
import CheckboxIcon from '../../Icons/StepCheckmark';
import Label from '../../Label';
import styles from './Checkbox.module.scss';

const CheckboxInput = ({ id, field, form, label, value, ...rest }) => {
  const { name, value: formikValue } = field;
  const { setFieldValue } = form;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();

    // Return a new array to trigger validations
    const values = formikValue ? [...formikValue] : [];

    const index = values.indexOf(value);
    if (index === -1) {
      values.push(value);
    } else {
      values.splice(index, 1);
    }
    setFieldValue(name, values);
  };

  const checked = (formikValue || []).indexOf(value) !== -1;

  return (
    <label htmlFor={id} className={styles.label}>
      <input id={id} name={id} type="checkbox" onChange={handleChange} checked={checked} {...rest} />
      <CheckboxIcon size={18} checked={checked} fill={colors.primary} />
      <div className={styles.text}>{label}</div>
    </label>
  );
};

CheckboxInput.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string,
  id: PropTypes.string,
};

export interface ICheckboxGroupOption {
  label: string;
  value: string;
}

interface IProps {
  label?: string;
  options: ICheckboxGroupOption[];
  id: string;
  className?: string;
  optionsDisplay?: 'vertical' | 'horizontal';
}
const CheckboxGroup = ({ label, id, className, options, optionsDisplay = 'vertical' }: IProps) => {
  const [field, meta] = useField<string[]>(id);

  const { touched, error } = meta;

  return (
    <div id={id} className={`${styles.checkboxGroup} ${className || ''}`.trimEnd()}>
      {label ? <Label htmlFor={id} dangerouslySetInnerHTML={{ __html: label }} /> : null}
      <div
        className={`${styles.optionsContainer} ${optionsDisplay === 'vertical' ? styles.vertical : styles.horizontal}`}
      >
        {options.map((o, idx) => {
          return <Field key={idx} component={CheckboxInput} name={id} {...o} field={field} />;
        })}
      </div>
      {touched && error ? <span className={styles.error}>{error}</span> : null}
    </div>
  );
};

CheckboxGroup.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  id: PropTypes.string,
  className: PropTypes.string,
};

export default CheckboxGroup;

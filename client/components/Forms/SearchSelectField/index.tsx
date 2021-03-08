import { Field, useField } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import Scroll from 'react-scroll';
import SelectSearch from 'react-select-search/dist/cjs';

import { IWarnOn } from '../../../screens/Hr/types';
import Label from '../../Label';
import DescriptionText from '../DescriptionText';
import HelpText from '../HelpText';
import styles from './SearchSelectField.module.scss';
const Element = Scroll.Element;

/**
 * Search Select Field with our own custom render options
 * Formik props. Field includes: name, value, onChange
 */
export const CustomSelectSearch = ({
  field,
  form,
  multiple = false,
  allowSearch = true,
  placeholder,
  onChange,
  ...rest
}: any) => {
  const { value, name } = field;

  function handleSelectChange(value) {
    if (onChange) {
      onChange(value, form);
    }
    if (form) {
      form.setFieldValue(name, value?.trim ? value.trim() : value);
    }
  }

  return (
    <SelectSearch
      {...rest}
      value={value}
      name={name}
      onChange={handleSelectChange}
      search={allowSearch}
      multiple={multiple}
      printOptions={multiple ? 'on-focus' : 'auto'}
      closeOnSelect={!multiple}
      fuse={false}
      className={(key) => styles[key]}
      placeholder={placeholder || (multiple ? 'Select all that apply' : 'Please select an option')}
      renderOption={(optionProps, optionData, optionSnapshot, className) => {
        return (
          <button {...optionProps} className={className + ` ${optionData.className || ''}`} type="button">
            <span>{optionData.name}</span>
          </button>
        );
      }}
    />
  );
};

export interface ISearchSelectOption {
  value: string | number;
  name: string;
}

interface IProps {
  id: string;
  options?: ISearchSelectOption[];
  getOptions?: (q: string) => any;
  label?: string;
  help?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  multiple?: boolean;
  warnOn?: IWarnOn[];
  allowSearch?: boolean;
  placeholder?: string;
  onChange?: (id: string, form: any) => any;
}

const SearchSelectField = ({ id, label, help, description, warnOn, className, ...rest }: IProps) => {
  const [field, meta] = useField<string>(id);
  const { error, touched } = meta;

  return (
    <div className={`${styles.container} ${className}`}>
      {description ? <DescriptionText dangerouslySetInnerHTML={{ __html: description }} /> : null}
      {label ? <Label htmlFor={id} dangerouslySetInnerHTML={{ __html: label }} /> : null}
      {/* name property doesn't work on this component, so we need Element for the scroll */}
      <Element name={id}></Element>
      <Field component={CustomSelectSearch} name={id} field={field} {...rest} />
      {help ? <HelpText dangerouslySetInnerHTML={{ __html: help }} /> : null}
      {touched && error ? <span className={styles.error}>{error}</span> : null}
    </div>
  );
};

SearchSelectField.propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    }),
  ),
  label: PropTypes.string,
  className: PropTypes.string,
  description: PropTypes.string,
};

SearchSelectField.defaultProps = {
  disabled: false,
  options: [],
};

export default SearchSelectField;

interface IPlainSearchSelectProps {
  options: ISearchSelectOption[];
  placeholder: string;
  value: string | number;
  onChange: (newValue: string | number) => void;
  allowSearch?: boolean;
  name?: string;
}

export const PlainSearchSelect = ({
  options,
  placeholder,
  value,
  onChange,
  name,
  allowSearch = true,
}: IPlainSearchSelectProps) => {
  return (
    <SelectSearch
      options={options}
      closeOnSelect
      value={value}
      name={name}
      onChange={onChange}
      search={allowSearch}
      multiple={false}
      printOptions="auto"
      fuse={false}
      className={(key) => styles[key]}
      placeholder={placeholder}
    />
  );
};

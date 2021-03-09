import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import PlainInput from '../../PlainInput';
import Label from '../../Label';

interface IProps {
  input: any;
  label: string;
  className: string;
  id: string;
}
const ReadOnlyInput = ({ input, label, className, id }: IProps) => {
  return (
    <div className={cx(className)}>
      {label ? <Label htmlFor={id} dangerouslySetInnerHTML={{ __html: label }} /> : null}
      <PlainInput id={id} value={input.value || ''} disabled={true} onChange={() => {}} className="" as="input" />
    </div>
  );
};

ReadOnlyInput.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default ReadOnlyInput;

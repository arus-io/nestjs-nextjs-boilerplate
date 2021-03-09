import cx from 'classnames';
import get from 'lodash.get';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { Field, formValueSelector, reduxForm, SubmissionError } from 'redux-form';

import { editUserSettingsAction } from '../../store/auth/actions';
import { fieldRequired, validEmail, validPhone } from '../../utils/validators';
import Button from '../Button';
import Checkbox from '../Forms/Checkbox';
import FormError from '../Forms/Error';
import Input from '../Forms/Input';
import PhoneField from '../Forms/PhoneField';
import ReadOnlyInput from '../Forms/ReadOnlyInput';
import styles from './AccountInformationForm.module.scss';
// import US_STATES from '../../../constants/us-states';

const AccountInformationForm = ({
  handleSubmit,
  submitting,
  error,
  pristine,
  invalid,
  needsEmergencyData,
  hasPhone,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <FormError error={error} />
      <div className={styles.row}>
        <Field
          label="First Name"
          component={Input}
          name="firstName"
          className={styles.input}
          id="first-name"
          validate={[fieldRequired]}
        />
        <Field
          label="Last Name"
          component={Input}
          name="lastName"
          className={styles.input}
          id="last-name"
          validate={[fieldRequired]}
        />
      </div>
      <div className={styles.row}>
        <Field label="Email" component={ReadOnlyInput} name="email" className={cx(styles.input)} id="email" />
        <Field
          label="Personal Email (optional)"
          component={Input}
          name="personalEmail"
          className={cx(styles.input)}
          id="personal-email"
          validate={[validEmail]}
        />
      </div>
      <div className={styles.row}>
        <Field
          label="Phone (optional)"
          component={PhoneField}
          name="phone"
          className={cx(styles.input)}
          id="phone"
          alwaysShowMask
          validate={[validPhone]}
        />
        {/*<Field label="SSN" component={Input} name="ssn" className={cx(styles.input)} id="ssn" validate={[validSSN]} />*/}
      </div>

      <div className={styles.row}>
        <Field
          text="Send notifications to phone when possible"
          component={Checkbox}
          name="prefersPhone"
          id="prefersPhone"
          disabled={!hasPhone}
        />
      </div>

      <hr className={styles.divider} />

      {/*<p className={styles.p}>Home address:</p>*/}

      {/*<div className={styles.row}>*/}
      {/*  <Field*/}
      {/*    label="City"*/}
      {/*    component={Input}*/}
      {/*    name="city"*/}
      {/*    className={cx(styles.input)}*/}
      {/*    id="city"*/}
      {/*    validate={[fieldRequired]}*/}
      {/*  />*/}
      {/*  <Field*/}
      {/*    label="Zip Code"*/}
      {/*    component={Input}*/}
      {/*    type="number"*/}
      {/*    name="zipCode"*/}
      {/*    className={cx(styles.input)}*/}
      {/*    id="zipCode"*/}
      {/*    validate={[validZipCode]}*/}
      {/*  />*/}
      {/*</div>*/}

      {/*<div className={styles.row}>*/}
      {/*  <Field*/}
      {/*    empty*/}
      {/*    label="State"*/}
      {/*    component={SelectInput}*/}
      {/*    options={US_STATES}*/}
      {/*    name="state"*/}
      {/*    className={cx(styles.input)}*/}
      {/*    id="state"*/}
      {/*    validate={[fieldRequired]}*/}
      {/*  />*/}
      {/*</div>*/}

      {/*<hr className={styles.divider} />*/}

      {needsEmergencyData ? (
        <div>
          <span className={styles.sectionHeader}>My Emergency Contact</span>
          <p className={styles.p}>In the unlikely situation they need to be reached before or during your leave.</p>

          <div className={styles.row}>
            <Field
              label="Their Full Name"
              component={Input}
              name="emergencyContactName"
              className={cx(styles.input)}
              id="their-full-name"
            />
          </div>
          <div className={styles.row}>
            <Field
              label="Relationship"
              component={Input}
              name="emergencyContactRelationship"
              className={styles.input}
              id="relationship"
            />

            <Field
              label="Their Phone"
              component={PhoneField}
              name="emergencyContactPhone"
              className={cx(styles.input, styles.mb40)}
              id="their-phone"
              validate={[validPhone]}
              alwaysShowMask
            />
          </div>
        </div>
      ) : null}
      <Button
        color="lightGreen"
        className={styles.action}
        type="submit"
        disabled={pristine || invalid}
        loading={submitting}
      >
        Save Changes
      </Button>
    </form>
  );
};

AccountInformationForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.any,
  needsEmergencyData: PropTypes.bool,
  pristine: PropTypes.bool,
  invalid: PropTypes.bool,
  hasPhone: PropTypes.bool,
};

const selector = formValueSelector('account-settings-information');

export default compose(
  connect(
    (state) => {
      const {
        auth: { me, settingsLoading },
        app,
      } = state;
      const needsEmergencyData = app.subdomain !== 'admin';
      const currentPhone = selector(state, 'phone');
      const hasPhone = currentPhone ? validPhone(currentPhone) === undefined : false;

      return {
        settingsLoading,
        hasPhone,
        needsEmergencyData,
        initialValues: {
          firstName: get(me, 'firstName', ''),
          lastName: get(me, 'lastName', ''),
          email: get(me, 'email', ''),
          personalEmail: get(me, 'personalEmail', ''),
          phone: get(me, 'phone', ''),
          emergencyContactName: get(me, 'emergencyContactName', ''),
          emergencyContactRelationship: get(me, 'emergencyContactRelationship', ''),
          emergencyContactPhone: get(me, 'emergencyContactPhone', ''),
          prefersPhone: get(me, 'prefersPhone', false),
        },
      };
    },
    {
      editUserSettings: editUserSettingsAction,
    },
  ),
  withHandlers({
    onSubmit: ({ editUserSettings }) => async (body) => {
      // This is to contemplate the case where user removed the phone and still has the checkbox checked
      if (!body.phone) {
        body.prefersPhone = false;
      }

      // // We accept the user SSN with '-' but we replace them before saving to DB
      // if (_body.ssn) {
      //   _body.ssn = _body.ssn.replace(/\s|-/g, '');
      // }
      try {
        await new Promise((resolve, reject) => {
          editUserSettings(body, {
            resolve,
            reject,
          });
        });
      } catch ({ error }) {
        throw new SubmissionError({
          _error: error,
        });
      }
    },
  }),
  reduxForm({
    form: 'account-settings-information',
    enableReinitialize: true,
  }),
)(AccountInformationForm);

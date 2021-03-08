import React, { useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Button from '../Button';
import Input from '../Forms/Input';
import styles from './AccountPasswordForm.module.scss';
import FormError from '../Forms/Error';
import { fieldRequired, validPassword } from '../../utils/validators';
import { Form, Formik, Field } from 'formik';
import { updatePassword } from '../../_core/api';

export const PasswordForm = ({ handler, error }: any) => {
  return (
    <Formik
      initialValues={{ newPassword: '', newPasswordConfirm: '' }}
      validate={(values) => {
        const errors = {} as any;
        const error = fieldRequired(values.newPassword) || validPassword(values.newPassword);
        if (error) {
          errors.newPassword = error;
        }
        if (values.newPasswordConfirm && values.newPassword != values.newPasswordConfirm) {
          errors.newPasswordConfirm = "Passwords don't match";
        }
        return errors;
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          await handler(values);
          resetForm();
        } catch (e) {
          // console.log(e);
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, isValid, values }) => (
        <Form>
          <FormError error={error} />
          <Field name="newPassword">
            {({ field, meta }) => (
              <Input
                className={styles.input}
                label="New Password"
                id="newPassword"
                type="password"
                input={field}
                meta={meta}
              />
            )}
          </Field>
          <Field name="newPasswordConfirm">
            {({ field, meta }) => (
              <Input
                className={styles.input}
                label="Confirm new Password"
                id="newPasswordConfirm"
                type="password"
                input={field}
                meta={meta}
              />
            )}
          </Field>
          <div className={styles.info}>
            Passwords must contain at least 8 characters, an uppercase letter, at least one number, and one special
            character (i.e. !, $, #, *).
          </div>
          <Button
            color="primary"
            className={styles.action}
            type="submit"
            loading={isSubmitting}
            disabled={!isValid || !values.newPasswordConfirm}
          >
            Change Password
          </Button>
        </Form>
      )}
    </Formik>
  );
};

const AccountPasswordForm = ({ updatePassword }: any) => {
  const [error, setError] = useState('');
  const handler = async (values) => {
    try {
      await updatePassword(values.newPassword);
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };
  return <PasswordForm handler={handler} error={error} />;
};

export default compose(connect(null, { updatePassword }))(AccountPasswordForm);

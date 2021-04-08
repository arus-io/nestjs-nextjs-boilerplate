import React, { useState } from 'react';
import Button from '../Button';
import Input from '../Forms/Input';
import styles from './AccountPasswordForm.module.scss';
import FormError from '../Forms/Error';
import { fieldRequired, validPassword } from '../../utils/validators';
import { Form, Formik, Field } from 'formik';
import { useChangePasswordMutation } from '../../_gen/graphql';
import { toast } from 'react-toastify';

export const AccountPasswordForm = () => {
  const [changePasswordMutation] = useChangePasswordMutation();
  const [error, setError] = useState();

  const submitChangePassword = async (values, { setSubmitting, resetForm }) => {
    const { newPassword } = values;
    try {
      await changePasswordMutation({
        variables: {
          newPassword
        }
      });
      resetForm();
      toast.success('Password updated!');
    } catch (e) {
      setError(e.message);
    }
    setSubmitting(false);
  }

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
      onSubmit={submitChangePassword}
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

export default AccountPasswordForm;

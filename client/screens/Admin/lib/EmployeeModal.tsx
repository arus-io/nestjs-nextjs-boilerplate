import cx from 'classnames';
import { Field, Form, Formik } from 'formik';
import get from 'lodash.get';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import Button from '../../../components/Button';
import FormModal from '../../../components/FormModal/FormModal2';
import Checkbox from '../../../components/Forms/Checkbox';
import FormError from '../../../components/Forms/Error';
import Input from '../../../components/Forms/Input';
import TrashIcon from '../../../components/Icons/Trash';
import { addEmployeeAction, deleteEmployeeAction, editEmployeeAction } from '../../../store/admin/users';
import { fieldRequired, validEmail } from '../../../utils/validators';
import styles from './EmployeeModal.module.scss';

interface EmployeeModalProps {
  userId: any; // userId or 'create',
  user: any; // user to edit
  companyId: any; // int or string,
  handleSubmit: (p: any) => void;
  handleOnClose: () => void;
  addEmployee: any;
  editEmployee: any;
  deleteEmployee: any;
  superuser: boolean;
}

const EmployeeModal = ({
  userId,
  user,
  superuser,
  companyId,
  handleOnClose,
  addEmployee,
  deleteEmployee,
  editEmployee,
}: EmployeeModalProps) => {
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (formValues, { setSubmitting }) => {
    try {
      await new Promise((resolve, reject) => {
        const body = {
          ...formValues,
          companyId,
        };
        if (userId) {
          editEmployee(userId, body, {
            resolve,
            reject,
          });
        } else {
          addEmployee(body, {
            resolve,
            reject,
          });
        }
      });
      setSubmitting(false);
      handleOnClose();
    } catch ({ error }) {
      setSubmitting(false);
      setSubmitError(error);
    }
  };

  return (
    <Formik
      initialValues={{
        firstName: get(user, 'firstName', ''),
        lastName: get(user, 'lastName', ''),
        email: get(user, 'email', ''),
        isHr: get(user, 'isHr', false),
        archived: get(user, 'archived', false),
        superuser,
      }}
      validate={(values) => {
        const errors = {} as any;
        const error = fieldRequired(values.email) || validEmail(values.email);
        if (error) {
          errors.email = error;
        }
        return errors;
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <FormModal
            open={true}
            title={`${userId ? 'Edit' : 'Add'} Employee`}
            onClose={handleOnClose}
            action={
              <>
                {userId && (
                  <Button
                    className={cx(styles.action, styles.danger)}
                    icon={TrashIcon}
                    color="accentDark"
                    plain
                    onClick={async () => {
                      await deleteEmployee({ userId, companyId });
                      handleOnClose();
                    }}
                  >
                    Remove Employee
                  </Button>
                )}
                <Button className={styles.action} onClick={handleOnClose}>
                  Cancel
                </Button>
                <Button color="primary" className={styles.action} type="submit" loading={isSubmitting}>
                  Save Employee
                </Button>
              </>
            }
          >
            <FormError error={submitError} />
            <div className={styles.row}>
              <Field name="firstName">
                {({ field, meta }) => (
                  <Input label="First Name" id="first-name" className={styles.input} input={field} meta={meta} />
                )}
              </Field>
              <Field name="lastName">
                {({ field, meta }) => (
                  <Input
                    label="Last Name"
                    id="last-name"
                    className={cx(styles.input, styles.no_margin)}
                    input={field}
                    meta={meta}
                  />
                )}
              </Field>
            </div>
            <div className={styles.row}>
              <Field name="email">
                {({ field, meta }) => (
                  <Input
                    label="Email"
                    id="email"
                    className={cx(styles.input, styles.three_fourths)}
                    input={field}
                    meta={meta}
                  />
                )}
              </Field>
            </div>
            {!superuser && (
              <div className={styles.row}>
                <Field name="isHr">
                  {({ field, meta }) => (
                    <Checkbox
                      label=""
                      text="HR Employee"
                      id="isHr"
                      className={cx(styles.input, styles.half)}
                      input={field}
                      meta={meta}
                    />
                  )}
                </Field>
                <Field name="archived">
                  {({ field, meta }) => (
                    <Checkbox
                      label=""
                      text="Archive"
                      id="archived"
                      className={cx(styles.input, styles.half)}
                      input={field}
                      meta={meta}
                    />
                  )}
                </Field>
              </div>
            )}
          </FormModal>
        </Form>
      )}
    </Formik>
  );
};

export default compose(
  connect(
    ({ admin: { users } }, { companyId, superuser = false, userId }) => {
      // const userId = users.modal !== 'create' ? users.modal : null;
      userId = userId !== 'create' ? userId : null;
      let existingUser = null;
      if (userId) {
        existingUser = users.byId[userId];
      }
      return {
        userId,
        companyId,
        user: existingUser,
        superuser,
      };
    },
    {
      addEmployee: addEmployeeAction,
      editEmployee: editEmployeeAction,
      deleteEmployee: deleteEmployeeAction,
    },
  ),
)(EmployeeModal);

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError, formValueSelector } from 'redux-form';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import PromiseCreator from 'promise-creator';
import get from 'lodash.get';
import cx from 'classnames';
import Button from '../Button';
import Input from '../Forms/Input';
import FileInput from '../Forms/FileInput';
import FormModal from '../FormModal';
import styles from './AddEditCompanyModal.module.scss';
import {
  addCompanyAction,
  editCompanyAction,
  toggleCompanyModalAction,
  deleteCompanyAction,
} from '../../store/admin/companies';
import FormError from '../Forms/Error';
import { fieldRequired, validEmail, validSubdomain } from '../../utils/validators';
import TrashIcon from '../Icons/Trash';

const AddEditCompanyModal = ({
  id,
  handleSubmit,
  submitting,
  error,
  pristine,
  invalid,
  toggleCompanyModal,
  open,
  deleteCompany,
  disableLogoUpload,
}) => (
  <FormModal
    open={open}
    title={`${id ? 'Edit' : 'Create'} Company`}
    onClose={() => toggleCompanyModal(null)}
    onSubmit={handleSubmit}
    action={
      <React.Fragment>
        {id && (
          <Button
            className={cx(styles.action, styles.danger)}
            icon={TrashIcon}
            color="accentDark"
            plain
            onClick={() => deleteCompany({ id })}
          >
            Remove Company
          </Button>
        )}
        <Button className={styles.action} onClick={() => toggleCompanyModal(null)}>
          Cancel
        </Button>
        <Button
          color="primary"
          className={styles.action}
          type="submit"
          disabled={pristine || invalid}
          loading={submitting}
        >
          Save Company
        </Button>
      </React.Fragment>
    }
  >
    <FormError error={error} />
    <Field
      label="Company Name"
      component={Input}
      name="name"
      className={styles.input}
      id="company-name"
      autoComplete="company-name"
      validate={fieldRequired}
    />
    <Field
      label="Domain"
      component={Input}
      id="company-subdomain"
      name="subdomain"
      autoComplete="subdomain"
      className={styles.input}
      validate={[fieldRequired, validSubdomain]}
    />
    <Field
      label="Support Email"
      component={Input}
      id="company-supportEmail"
      name="supportEmail"
      autoComplete="supportEmail"
      className={styles.input}
      validate={[fieldRequired, validEmail]}
    />
    <Field
      component={FileInput}
      name="logo"
      className={styles.input}
      label="Upload Logo"
      id="company-logo"
      disabled={disableLogoUpload}
    />
  </FormModal>
);

AddEditCompanyModal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.any,
  pristine: PropTypes.bool,
  invalid: PropTypes.bool,
  open: PropTypes.bool,
  toggleCompanyModal: PropTypes.func,
  deleteCompany: PropTypes.func,
  disableLogoUpload: PropTypes.bool,
};

export default compose(
  connect(
    ({ admin: { companies }, ...restState }) => {
      const formSelector = formValueSelector('add-edit-company');
      const uploadedLogo = formSelector(restState, 'logo');
      const disableLogoUpload = !!(uploadedLogo && uploadedLogo.length);
      return {
        open: !!companies.modal,
        id: companies.modal !== 'add' ? companies.modal : null,
        disableLogoUpload,
        initialValues: {
          name: get(companies.companies, `${companies.modal}.name`, ''),
          subdomain: get(companies.companies, `${companies.modal}.subdomain`, ''),
          supportEmail: get(companies.companies, `${companies.modal}.supportEmail`, ''),
          logo: '',
        },
      };
    },
    {
      toggleCompanyModal: toggleCompanyModalAction,
      addCompany: addCompanyAction,
      editCompany: editCompanyAction,
      deleteCompany: deleteCompanyAction,
    },
  ),
  withHandlers({
    onSubmit: ({ editCompany, addCompany, toggleCompanyModal, id }) => async (body) => {
      const { resolve, reject, promise } = PromiseCreator();
      if (id) {
        editCompany(id, body, {
          resolve,
          reject,
        });
      } else {
        addCompany(body, {
          resolve,
          reject,
        });
      }

      try {
        await promise;
        toggleCompanyModal(null);
      } catch ({ error }) {
        throw new SubmissionError({
          _error: error,
        });
      }
    },
  }),
  reduxForm({
    form: 'add-edit-company',
    enableReinitialize: true,
  }),
)(AddEditCompanyModal);

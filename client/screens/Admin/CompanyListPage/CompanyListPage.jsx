import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AddEditCompanyModal from '../../../components/AddEditCompanyModal';
import Button from '../../../components/Button';
import IconButton from '../../../components/IconButton';
import EditIcon from '../../../components/Icons/Edit';
import PlusInCircleIcon from '../../../components/Icons/PlusInCircle';
import TableSortable from '../../../components/TableSortable/TableSortable';
import { PageTitle } from '../../../layouts/Pages';
import { Router } from '../../../router';
import { fetchCompaniesAction, toggleCompanyModalAction } from '../../../store/admin/companies';
import shouldBeLoggedIn from '../../../utils/should-be-logged-in';
import styles from './CompanyListPage.module.scss';

const CompanyListPage = ({ list, toggleCompanyModal }) => {
  return (
    <>
      <PageTitle title="Companies">
        <Button color="primary" icon={PlusInCircleIcon} onClick={() => toggleCompanyModal('add')}>
          Create Company
        </Button>
      </PageTitle>
      {list && list.length > 0 ? (
        <TableSortable
          exportData
          data={list}
          onRowClick={(company) => {
            Router.push(`/companies/company?companyId=${company.id}`);
          }}
          rowActions={(company) => (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                toggleCompanyModal(company.id);
              }}
              icon={EditIcon}
            />
          )}
          columns={[
            {
              key: 'name',
              label: 'company',
              sort: true,
              // eslint-disable-next-line react/display-name
              render: (company) => <span className={styles.name}>{company.name}</span>,
              renderCSV: (company) => company.name,
            },
            {
              key: 'subdomain',
              label: 'domain',
              sort: true,
              // eslint-disable-next-line react/display-name
              render: (company) => (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.subdomain}
                  href={`http://${company.subdomain}.${process.env.SITE_DOMAIN}`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {company.subdomain}.{process.env.SITE_DOMAIN}
                </a>
              ),
              renderCSV: (company) => `${company.subdomain}.${process.env.SITE_DOMAIN}`,
            },
            { key: 'plansCount', label: 'plans', sort: (a, b) => a.plansCount - b.plansCount },
            { key: 'usersCount', label: 'employees', sort: (a, b) => a.usersCount - b.usersCount },
            { key: 'toReviewCount', label: 'to do', sort: (a, b) => a.toReviewCount - b.toReviewCount },
          ]}
        />
      ) : null}
      <AddEditCompanyModal />
    </>
  );
};

CompanyListPage.propTypes = {
  list: PropTypes.array,
  companies: PropTypes.object,
  toggleCompanyModal: PropTypes.func,
};

const CompanyListPageEnhanced = connect(
  ({ admin: { companies } }) => ({
    list: companies.list.map((index) => companies.companies[index]),
    loading: companies.loading,
    error: companies.error,
  }),
  {
    toggleCompanyModal: toggleCompanyModalAction,
  },
)(CompanyListPage);

CompanyListPageEnhanced.getInitialProps = async ({ store }) => {
  await new Promise((resolve) => {
    store.dispatch(fetchCompaniesAction({ resolve, reject: resolve }));
  });
  return {};
};

export default shouldBeLoggedIn(CompanyListPageEnhanced);

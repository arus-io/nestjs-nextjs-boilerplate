import React, { useState } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { impersonateAction, sendWelcomeEmail } from '../../../../_core/api';
import FilterControls from '../../../../components/DataFilterControls';
import IconButton from '../../../../components/IconButton';
import EditIcon from '../../../../components/Icons/Edit';
import EnvelopeIcon from '../../../../components/Icons/Envelope';
import LoginIcon from '../../../../components/Icons/Login';
import TableSortable from '../../../../components/TableSortable';
import { ICompanyVM, IUserVM } from '../../../Hr/types';
import styles from '../CompanyDetailsPage.module.scss';
import { employeesFiltersData } from './constants';

interface IProps {
  employees: IUserVM[];
  company: ICompanyVM;
  openEditUserModal: React.Dispatch<any>;
  impersonate: ({ userId, companyId }: any) => void;
  sendWelcomeEmail: ({ userId, companyId }: any) => void;
}

const EmployeesTab = ({ employees, company, impersonate, sendWelcomeEmail, openEditUserModal }: IProps) => {
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>(employees.filter((e) => !e.archived));
  const [indexedUserResentWelcomeEmail, setIndexedUserResentWelcomeEmail] = useState({});

  async function handleSendWelcomeEmail(userId: string, companyId: number) {
    try {
      await sendWelcomeEmail({ userId, companyId });
      toast.success('Email was sent!');
      setIndexedUserResentWelcomeEmail({ ...indexedUserResentWelcomeEmail, [userId]: userId });
    } catch (err) {
      toast.error('Email was not sent!');
    }
  }

  if (!employees?.length) return <div>No employees found</div>;

  return (
    <>
      <TableSortable
        exportData
        data={filteredEmployees}
        columns={[
          { key: 'fullName', label: 'Name', sort: true },
          { key: 'email', sort: true },
          { key: 'isHr', label: 'Role', render: (ee) => (ee.isHr && 'Human Resources') || '' },
          { key: 'plans', sort: (a, b) => a.plans - b.plans },
          {
            key: 'archived',
            sort: true,
            render: (ee) => (ee.archived ? 'Yes' : '-'),
            renderCSV: (ee) => ee.archived,
          },
          {
            key: 'logged in',
            sort: true,
            render: (ee) => (ee.loggedIn ? 'Yes' : '-'),
            renderCSV: (ee) => ee.loggedIn,
          },
        ]}
        rowActions={(employee) => (
          <>
            {!employee.loggedIn && (
              <IconButton
                icon={EnvelopeIcon}
                onClick={() => handleSendWelcomeEmail(employee.id, company.id)}
                disabled={!!indexedUserResentWelcomeEmail[employee.id]}
              />
            )}
            <IconButton
              icon={LoginIcon}
              style={{ marginRight: 12 }}
              onClick={() => impersonate({ userId: employee.id, companyId: company.id })}
            />
            <IconButton icon={EditIcon} onClick={() => openEditUserModal(employee.id)} />
          </>
        )}
        pagination={{ itemsPerPage: 15 }}
        headerContent={
          <div className={styles.headerFilters}>
            <FilterControls<IUserVM>
              data={employees}
              setFilteredData={setFilteredEmployees}
              filters={employeesFiltersData}
            />
          </div>
        }
      />
    </>
  );
};

export default connect<IProps>(null, {
  impersonate: impersonateAction,
  sendWelcomeEmail,
})(EmployeesTab);

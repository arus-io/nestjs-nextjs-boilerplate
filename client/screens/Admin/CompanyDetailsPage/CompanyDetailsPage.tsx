import get from 'lodash.get';
import moment from 'moment';
import { withRouter } from 'next/router';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import branch from 'recompose/branch';
import compose from 'recompose/compose';
import renderComponent from 'recompose/renderComponent';
import withProps from 'recompose/withProps';

import AddEditCompanyModal from '../../../components/AddEditCompanyModal';
import AddEditPlanModal from '../../../components/AddEditPlanModal';
import BackButton from '../../../components/BackButton';
import Button from '../../../components/Button';
import DuplicatePlanModal from '../../../components/DuplicatePlanModal/DuplicatePlanModal';
import IconButton from '../../../components/IconButton';
import Duplicate from '../../../components/Icons/Duplicate';
import EditIcon from '../../../components/Icons/Edit';
import PlusInCircleIcon from '../../../components/Icons/PlusInCircle';
import UploadIcon from '../../../components/Icons/Upload';
import Nav, { NavLink as _NavLink } from '../../../components/Nav';
import TableSortable from '../../../components/TableSortable/TableSortable';
import { PageTitle } from '../../../layouts/Pages';
import { Link, Router } from '../../../router';
import { fetchCompanyAction, toggleCompanyModalAction } from '../../../store/admin/companies';
import { toggleDuplicatePlanModalAction, togglePlanModalAction } from '../../../store/admin/plans';
import shouldBeLoggedIn from '../../../utils/should-be-logged-in';
import { ELeaveStatus } from '../../Hr/types';
import NotFoundPage from '../../NotFoundPage';
import EmployeeModal from '../lib/EmployeeModal';
import styles from './CompanyDetailsPage.module.scss';
import EmployeesTab from './components/EmployeesTab';

const NavLink = _NavLink as any;

const LEAVE_STATUS_MAP_ADMIN = {
  [ELeaveStatus.DRAFT]: 'Draft',
  [ELeaveStatus.SENT_TO_EMPLOYEE]: 'Waiting on Employee',
  [ELeaveStatus.APPROVED_EMPLOYEE]: 'Needs Review',
  [ELeaveStatus.APPROVED_HR]: 'Active',
};

const LEAVE_STATUS_ORDER = {
  [LEAVE_STATUS_MAP_ADMIN[ELeaveStatus.DRAFT]]: 4,
  [LEAVE_STATUS_MAP_ADMIN[ELeaveStatus.SENT_TO_EMPLOYEE]]: 2,
  [LEAVE_STATUS_MAP_ADMIN[ELeaveStatus.APPROVED_EMPLOYEE]]: 1,
  [LEAVE_STATUS_MAP_ADMIN[ELeaveStatus.APPROVED_HR]]: 3,
  ['-']: 5,
};

interface CompanyDetailsPageProps {
  tab: string;
  company: any;
  employees: any;
  plans: any;
  toggleCompanyModal: any;
  togglePlanModal: any;
  toggleDuplicatePlanModal: any;
  store: any;
  getApiData: any;
}
const CompanyDetailsPage = ({
  tab,
  company,
  employees,
  plans,
  toggleCompanyModal,
  togglePlanModal,
  toggleDuplicatePlanModal,
}: CompanyDetailsPageProps) => {
  const [editUser, setEditUser] = useState(null);
  const addUserLabel = !company.users?.length ? 'Add HR' : 'Add Employee';

  return (
    <>
      <div>
        <BackButton href="/companies" />
        <div className={styles.policyLink}>
          <Link href={`/companies/company/profile?companyId=${company.id}`}>
            <a>VIEW COMPANY PROFILE</a>
          </Link>
        </div>
      </div>
      <PageTitle
        title={
          <>
            {company.name} <IconButton icon={EditIcon} onClick={() => toggleCompanyModal(company.id)} />
          </>
        }
      >
        <Button color="primary" icon={PlusInCircleIcon} onClick={() => togglePlanModal('add')}>
          Add Plan
        </Button>
        <Button color="primary" icon={PlusInCircleIcon} onClick={() => setEditUser('create')}>
          {addUserLabel}
        </Button>
      </PageTitle>
      <Nav>
        <NavLink href={`/companies/company?companyId=${company.id}`} color="primary" active={tab === 'plans'}>
          Plans
        </NavLink>
        <NavLink
          href={`/companies/company?companyId=${company.id}&tab=employees`}
          color="primary"
          active={tab === 'employees'}
        >
          Employees
        </NavLink>
      </Nav>
      {tab === 'employees' ? (
        <EmployeesTab employees={employees} company={company} openEditUserModal={setEditUser} />
      ) : null}
      {renderTabs()}
      <AddEditCompanyModal />
      {editUser ? (
        <EmployeeModal companyId={company.id} userId={editUser} handleOnClose={() => setEditUser(null)} />
      ) : null}
      <AddEditPlanModal companyId={company.id} />
      <DuplicatePlanModal />
    </>
  );

  function renderTabs() {
    if (tab === 'plans') {
      if (!plans?.length) return <div>No items found</div>;

      return (
        <TableSortable
          exportData
          data={plans}
          onRowClick={(plan) => Router.push(`/plan?planId=${plan.id}`)}
          columns={[
            {
              key: 'title',
              sort: true,
              // eslint-disable-next-line react/display-name
              render: (plan) => (
                <Link href={`/plan?planId=${plan.id}`}>
                  <a className={styles.name}>{plan.title}</a>
                </Link>
              ),
              renderCSV: (plan) => plan.title,
            },
            {
              key: 'dueDate',
              label: 'leave date',
              sort: true,
              render: (plan) => moment(plan.dueDate).format('MM/DD/YYYY'),
            },
            {
              key: 'returnDate',
              label: 'return date',
              sort: true,
              render: (plan) => moment(plan.returnDate).format('MM/DD/YYYY'),
            },
            { key: 'manager', sort: true },
            { key: 'employee', sort: true },
            {
              key: 'status',
              sort: (a, b) => LEAVE_STATUS_ORDER[a.status] - LEAVE_STATUS_ORDER[b.status],
              // eslint-disable-next-line react/display-name
              render: (plan) => (
                <span
                  className={
                    plan.status === LEAVE_STATUS_MAP_ADMIN[ELeaveStatus.APPROVED_EMPLOYEE] ? styles.needsReviewCell : ''
                  }
                >
                  {plan.status}
                </span>
              ),
              renderCSV: (plan) => plan.status,
            },
          ]}
          rowActions={(plan) => (
            <>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDuplicatePlanModal(plan.id);
                }}
                icon={Duplicate}
                style={{ marginRight: 12 }}
              />
              <IconButton
                icon={EditIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlanModal(plan.id);
                }}
                style={{ marginRight: 12 }}
              />
              <IconButton
                icon={UploadIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  Router.push(
                    `/employee/files?planId=${plan.id}&employeeId=${plan.employeeId}&companyId=${company.id}`,
                  );
                }}
              />
            </>
          )}
          pagination={{ itemsPerPage: 15 }}
        />
      );
    }
  }
};

const CompanyDetailsPageEnhanced = compose(
  withRouter,
  withProps((ownProps) => ({
    ...ownProps,
    tab: get(ownProps, 'router.query.tab', 'plans'),
    companyId: get(ownProps, 'router.query.companyId', ''),
    edit: 'edit' in get(ownProps, 'router.query', {}),
  })),
  connect(
    ({ admin: { companies, plans, users } }, ownProps) => {
      const company = companies.companies[ownProps.companyId];
      const companyPlans = company.plans
        .map((index) => {
          const plan = plans.byId[index];
          const manager = users.byId[plan.managerId];
          const employee = users.byId[plan.employeeId];
          return {
            ...plan,
            manager: manager ? `${manager.firstName} ${manager.lastName}` : 'n/a',
            employee: employee ? `${employee.firstName} ${employee.lastName}` : 'n/a',
            status: plan.leave?.status ? LEAVE_STATUS_MAP_ADMIN[plan.leave?.status] : '-',
          };
        })
        .sort((p1, p2) => (new Date(p2.dueDate) as any) - (new Date(p1.dueDate) as any));
      const companyEmployees = company.users.map((index) => {
        const user = users.byId[index];
        return {
          ...user,
          plans: companyPlans.reduce((acc, plan) => {
            if (Number(user.id) === Number(plan.managerId) || Number(user.id) === Number(plan.employeeId)) {
              acc += 1;
            }
            return acc;
          }, 0),
          fullName: `${user.firstName} ${user.lastName}`,
        };
      });
      return {
        company: company,
        employees: companyEmployees,
        plans: companyPlans,
        loading: companies.loadingCompany,
        error: companies.errorLoadingCompany,
      };
    },
    {
      toggleCompanyModal: toggleCompanyModalAction,
      togglePlanModal: togglePlanModalAction,
      toggleDuplicatePlanModal: toggleDuplicatePlanModalAction,
    },
  ),
  branch(({ company }) => !company, renderComponent(NotFoundPage)),
)(CompanyDetailsPage);

CompanyDetailsPageEnhanced.getInitialProps = async ({ store, query }) => {
  await new Promise((resolve) => {
    store.dispatch(
      fetchCompanyAction(query.companyId, {
        resolve,
        reject: resolve,
      }),
    );
  });
  return {};
};

export default shouldBeLoggedIn(CompanyDetailsPageEnhanced);

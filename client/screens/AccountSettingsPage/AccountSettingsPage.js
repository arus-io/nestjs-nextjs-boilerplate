import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import AccountInformationForm from '../../components/AccountInformationForm';
import AccountPasswordForm from '../../components/AccountPasswordForm';
import Button from '../../components/Button';
import Logout from '../../components/Icons/Logout';
import Nav, { NavLink } from '../../components/Nav';
import { PageTitle } from '../../layouts/Pages';
import shouldBeLoggedIn from '../../utils/should-be-logged-in';
import CompanySettings from './components/CompanySettings';

const TABS_IDS = {
  company: 'company',
  myInfo: 'my-info',
  password: 'password',
  security: 'security',
};

const AccountSettingsPage = ({ router, isHr }) => {
  const tab = router?.query?.tab || TABS_IDS.myInfo;

  return (
    <>
      <PageTitle title="Account">
        <Button plain icon={Logout} onClick={() => null} color="primary" href="/logout">
          Log Out
        </Button>
      </PageTitle>

      <Nav>
        <NavLink href={isHr ? '/hr/settings' : '/settings'} color="primary" active={tab === TABS_IDS.myInfo}>
          My Info
        </NavLink>
        <NavLink
          href={`${isHr ? '/hr/settings' : '/settings'}?tab=password`}
          color="primary"
          active={tab === TABS_IDS.password}
        >
          Password
        </NavLink>
        {/* {isHr ? (
          <NavLink href="/settings?tab=company" color="primary" active={tab === TABS_IDS.company}>
            Company
          </NavLink>
        ) : (
          <NavLink href="/settings?tab=security" color="primary" active={tab === TABS_IDS.security}>
            Security
          </NavLink>
        )} */}
        {isHr ? (
          <>
            <NavLink href="/hr/settings?tab=company" color="primary" active={tab === TABS_IDS.company}>
              Company
            </NavLink>
          </>
        ) : null}
      </Nav>
      {tab === TABS_IDS.myInfo && <AccountInformationForm />}
      {tab === TABS_IDS.password && <AccountPasswordForm />}
      {tab === TABS_IDS.company && isHr ? <CompanySettings /> : null}
      {tab === TABS_IDS.security ? 'Security' : null}
    </>
  );
};

AccountSettingsPage.propTypes = {
  router: PropTypes.object,
  isHr: PropTypes.bool,
};

const AccountSettingsPageEnhanced = compose(
  withRouter,
  connect((state) => {
    const {
      auth: {
        me: { isHr },
      },
    } = state;

    return {
      isHr,
    };
  }),
)(AccountSettingsPage);

export default shouldBeLoggedIn(AccountSettingsPageEnhanced);

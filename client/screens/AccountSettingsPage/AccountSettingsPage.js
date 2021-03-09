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

const AccountSettingsPage = ({ router }) => {
  const tab = router?.query?.tab || TABS_IDS.myInfo;

  return (
    <>
      <PageTitle title="Account">
        <Button plain icon={Logout} onClick={() => null} color="primary" href="/logout">
          Log Out
        </Button>
      </PageTitle>

      <Nav>
        <NavLink href={'/settings'} color="primary" active={tab === TABS_IDS.myInfo}>
          My Info
        </NavLink>
        <NavLink
          href={`/settings?tab=password`}
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
      </Nav>
      {tab === TABS_IDS.myInfo && <AccountInformationForm />}
      {tab === TABS_IDS.password && <AccountPasswordForm />}
      {/*{tab === TABS_IDS.company && !isSuperuser ? <CompanySettings /> : null}*/}
      {tab === TABS_IDS.security ? 'Security' : null}
    </>
  );
};

AccountSettingsPage.propTypes = {
  router: PropTypes.object,
};


export default shouldBeLoggedIn(AccountSettingsPage);

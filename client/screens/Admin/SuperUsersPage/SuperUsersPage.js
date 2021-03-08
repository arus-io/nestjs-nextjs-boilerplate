import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import Button from '../../../components/Button';
import IconButton from '../../../components/IconButton';
import EditIcon from '../../../components/Icons/Edit';
import PlusInCircleIcon from '../../../components/Icons/PlusInCircle';
import Table from '../../../components/Table';
import { PageTitle } from '../../../layouts/Pages';
import { fetchAllUsersAction } from '../../../store/admin/users';
import shouldBeLoggedIn from '../../../utils/should-be-logged-in';
import EmployeeModal from '../lib/EmployeeModal';
import styles from './SuperUsersPage.module.scss';

const SuperUsersPage = ({ users, superusers, toggleEmployeeModal }) => {
  const [editUser, setEditUser] = useState('');

  return (
    <>
      <PageTitle title="Super Users">
        <Button color="primary" icon={PlusInCircleIcon} onClick={() => setEditUser('create')}>
          Add Super User
        </Button>
      </PageTitle>
      {superusers.length > 0 ? (
        <Table headers={['name', 'email', '']}>
          {superusers.map((userId) => (
            <tr key={userId}>
              <td className={styles.name}>{`${users[userId].firstName} ${users[userId].lastName}`}</td>
              <td className={styles.email}>{users[userId].email}</td>
              <td className={styles.actions}>
                <IconButton icon={EditIcon} onClick={() => setEditUser(userId)} />
              </td>
            </tr>
          ))}
        </Table>
      ) : null}
      {editUser ? <EmployeeModal superuser userId={editUser} handleOnClose={() => setEditUser(null)} /> : ''}
    </>
  );
};

SuperUsersPage.propTypes = {
  users: PropTypes.object,
  superusers: PropTypes.array,
  toggleEmployeeModal: PropTypes.func,
};

const SuperUsersPageEnhanced = compose(
  withRouter,
  connect(({ admin: { users } }) => {
    const superusers = users && users.byId ? Object.keys(users.byId).filter((uId) => users.byId[uId].superuser) : [];

    return {
      superusers,
      users: users.byId,
    };
  }),
)(SuperUsersPage);

SuperUsersPageEnhanced.getInitialProps = async ({ store }) => {
  await new Promise((resolve) => {
    store.dispatch(
      fetchAllUsersAction({
        resolve,
        reject: resolve,
      }),
    );
  });
  return {};
};

export default shouldBeLoggedIn(SuperUsersPageEnhanced);

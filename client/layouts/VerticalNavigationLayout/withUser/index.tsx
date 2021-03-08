import React from 'react';
import { connect } from 'react-redux';

import { IUserVM } from '../../../screens/Hr/types';

export interface IWithUserProps {
  user: IUserVM;
}

const withUser = <P extends IWithUserProps>(Component: React.ComponentType<P>): React.FC<Omit<P, 'user'>> => {
  const WrappedComponent = ({ user, ...props }: IWithUserProps) => <Component user={user || {}} {...(props as P)} />;

  return connect(({ auth }) => ({
    user: auth.me,
  }))(WrappedComponent);
};

export default withUser;

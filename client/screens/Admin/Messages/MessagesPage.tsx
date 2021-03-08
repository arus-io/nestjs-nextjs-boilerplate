import React from 'react';

import { useMessagesQuery } from '../../../_gen/graphql';
import TableSortable from '../../../components/TableSortable/TableSortable';
import { PageTitle } from '../../../layouts/Pages';
import shouldBeLoggedIn from '../../../utils/should-be-logged-in';

const MessagesPage = () => {
  const { loading, error, data } = useMessagesQuery({
    fetchPolicy: 'network-only',
  });

  // @TODO - move this to a component. May be <GqlLoader loading= error=x> () => {//function so we render here only if called by GqlLoader} </GqlLoader>
  if (error) return <div>There was an error fetching.</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <PageTitle title="Last Messages" />

      <TableSortable
        exportData
        data={data.messages}
        columns={[
          { key: 'sentDate', label: 'date', render: (row) => new Date(row.sentDate).toLocaleString() },
          { key: 'code' },
          { key: 'to', render: (row) => row.to.replace(',', ', ') },
          // { key: 'subject' },
          { key: 'initiator.email', label: 'initiator', render: (row) => row.initiator?.email || 'App' },
          { key: 'medium' },
          { key: 'result', label: 'Received', render: (row) => (row.error ? 'Error' : 'OK') },
        ]}
      />
    </>
  );
};

export default shouldBeLoggedIn(MessagesPage);

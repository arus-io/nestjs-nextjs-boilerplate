import { useApolloClient } from '@apollo/client';
import React, { useState } from 'react';

import { GlobalSearchDocument, GlobalSearchResult } from '../../../../_gen/graphql';
import { CustomSelectSearch } from '../../../../components/Forms/SearchSelectField';
import { Router } from '../../../../router';

const GlobalSearch = () => {
  const apolloClient = useApolloClient();
  const [results, setResults] = useState<GlobalSearchResult[]>([]);

  const navigateResult = (searchResult: GlobalSearchResult) => {
    switch (searchResult.entity) {
      case 'Company':
        Router.push(`/companies/company?companyId=${searchResult.id}`);
        break;
      case 'Plan':
        Router.push(`/plan?planId=${searchResult.id}`);
        break;
    }
  };

  const resultToOptions = (results: GlobalSearchResult[]) =>
    results.map((r, index) => ({ name: r.entity + ': ' + r.label, value: index }));

  return (
    <CustomSelectSearch
      field={{ value: '', name: 'globalSearch' }}
      allowSearch={true}
      autoComplete="on"
      options={resultToOptions(results)}
      getOptions={async (query) => {
        const { data } = await apolloClient.query({
          query: GlobalSearchDocument,
          variables: { query },
          fetchPolicy: 'network-only',
        });
        setResults(data.globalSearch);
        return resultToOptions(results);
      }}
      placeholder={'Search or jump To...'}
      onChange={(index) => navigateResult(results[index])}
    />
  );
};

export default GlobalSearch;

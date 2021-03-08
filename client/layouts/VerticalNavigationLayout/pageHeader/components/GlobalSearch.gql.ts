import { gql } from '@apollo/client';

export const getGlobalSearchQuery = gql`
  query globalSearch($query: String!) {
    globalSearch(query: $query) {
      entity
      id
      label
    }
  }
`;

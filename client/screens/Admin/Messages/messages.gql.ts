import { gql } from '@apollo/client';

export const getHomepageAdminQuery = gql`
  query messages {
    messages {
      id
      initiator {
        email
      }
      # receiver: User;
      code
      to
      from
      subject
      body
      sentDate
      medium
      error
    }
  }
`;

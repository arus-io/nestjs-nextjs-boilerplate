import { gql } from '@apollo/client';

export const myCompanyQuery = gql`
  query myCompany {
    me {
      company {
        id
        name
        subdomain
        supportEmail
        logo
        twoFactorEnabled
      }
    }
  }
`;

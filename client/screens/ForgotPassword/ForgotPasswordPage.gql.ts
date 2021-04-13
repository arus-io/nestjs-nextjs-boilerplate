import { gql } from '@apollo/client';

export const forgotPassword = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
    }
  }
`;

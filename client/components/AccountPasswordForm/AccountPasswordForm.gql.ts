import { gql } from '@apollo/client';

export const changePassword = gql`
  mutation changePassword($newPassword: String!) {
    changePassword(newPassword: $newPassword) {
      success
    }
  }
`;

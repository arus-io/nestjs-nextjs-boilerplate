import { gql } from '@apollo/client';

export const changePassword = gql`
  mutation changePassword($newPassword: String!) {
    changePassword(newPassword: $newPassword) {
      success
    }
  }
`;

export const resetPassword = gql`
  mutation resetPassword($email: String!, $resetToken: String!, $newPassword: String!) {
    resetPassword(email: $email, resetToken: $resetToken, newPassword: $newPassword ) {
      success
    }
  }
`;

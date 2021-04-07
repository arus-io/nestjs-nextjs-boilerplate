import { gql } from '@apollo/client';

export const login = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      needs2fa
      has2faVerified
      type
      existingPhone
    }
  }
`;

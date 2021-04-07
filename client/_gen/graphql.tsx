import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type AuthResult = {
  __typename?: 'AuthResult';
  company?: Maybe<Company>;
  existingPhone?: Maybe<Scalars['String']>;
  has2faVerified: Scalars['Boolean'];
  needs2fa: Scalars['Boolean'];
  token: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};

export type Company = {
  __typename?: 'Company';
  id: Scalars['Int'];
  logo?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  subdomain: Scalars['String'];
  supportEmail?: Maybe<Scalars['String']>;
  twoFactorEnabled: Scalars['Boolean'];
};


export type GlobalSearchResult = {
  __typename?: 'GlobalSearchResult';
  entity: Scalars['String'];
  id: Scalars['String'];
  label: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  body: Scalars['String'];
  code: Scalars['String'];
  error?: Maybe<Scalars['String']>;
  from: Scalars['String'];
  id: Scalars['Int'];
  initiator?: Maybe<User>;
  medium: Scalars['String'];
  receiver?: Maybe<User>;
  sentDate: Scalars['DateTime'];
  subject: Scalars['String'];
  to: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: AuthResult;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  companies: Array<Company>;
  companyUsers: Array<User>;
  globalSearch: Array<GlobalSearchResult>;
  me: User;
  messages: Array<Message>;
};


export type QueryGlobalSearchArgs = {
  query: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  company?: Maybe<Company>;
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['Int'];
  lastName: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
};

export type GlobalSearchQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type GlobalSearchQuery = (
  { __typename?: 'Query' }
  & { globalSearch: Array<(
    { __typename?: 'GlobalSearchResult' }
    & Pick<GlobalSearchResult, 'entity' | 'id' | 'label'>
  )> }
);

export type MessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type MessagesQuery = (
  { __typename?: 'Query' }
  & { messages: Array<(
    { __typename?: 'Message' }
    & Pick<Message, 'id' | 'code' | 'to' | 'from' | 'subject' | 'body' | 'sentDate' | 'medium' | 'error'>
    & { initiator?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'email'>
    )> }
  )> }
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'AuthResult' }
    & Pick<AuthResult, 'token' | 'needs2fa' | 'has2faVerified' | 'type' | 'existingPhone'>
  ) }
);

export type MyCompanyQueryVariables = Exact<{ [key: string]: never; }>;


export type MyCompanyQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & { company?: Maybe<(
      { __typename?: 'Company' }
      & Pick<Company, 'id' | 'name' | 'subdomain' | 'supportEmail' | 'logo' | 'twoFactorEnabled'>
    )> }
  ) }
);


export const GlobalSearchDocument = gql`
    query globalSearch($query: String!) {
  globalSearch(query: $query) {
    entity
    id
    label
  }
}
    `;

/**
 * __useGlobalSearchQuery__
 *
 * To run a query within a React component, call `useGlobalSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useGlobalSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGlobalSearchQuery({
 *   variables: {
 *      query: // value for 'query'
 *   },
 * });
 */
export function useGlobalSearchQuery(baseOptions: Apollo.QueryHookOptions<GlobalSearchQuery, GlobalSearchQueryVariables>) {
        return Apollo.useQuery<GlobalSearchQuery, GlobalSearchQueryVariables>(GlobalSearchDocument, baseOptions);
      }
export function useGlobalSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GlobalSearchQuery, GlobalSearchQueryVariables>) {
          return Apollo.useLazyQuery<GlobalSearchQuery, GlobalSearchQueryVariables>(GlobalSearchDocument, baseOptions);
        }
export type GlobalSearchQueryHookResult = ReturnType<typeof useGlobalSearchQuery>;
export type GlobalSearchLazyQueryHookResult = ReturnType<typeof useGlobalSearchLazyQuery>;
export type GlobalSearchQueryResult = Apollo.QueryResult<GlobalSearchQuery, GlobalSearchQueryVariables>;
export const MessagesDocument = gql`
    query messages {
  messages {
    id
    initiator {
      email
    }
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

/**
 * __useMessagesQuery__
 *
 * To run a query within a React component, call `useMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useMessagesQuery(baseOptions?: Apollo.QueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
        return Apollo.useQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, baseOptions);
      }
export function useMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
          return Apollo.useLazyQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, baseOptions);
        }
export type MessagesQueryHookResult = ReturnType<typeof useMessagesQuery>;
export type MessagesLazyQueryHookResult = ReturnType<typeof useMessagesLazyQuery>;
export type MessagesQueryResult = Apollo.QueryResult<MessagesQuery, MessagesQueryVariables>;
export const LoginDocument = gql`
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
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const MyCompanyDocument = gql`
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

/**
 * __useMyCompanyQuery__
 *
 * To run a query within a React component, call `useMyCompanyQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyCompanyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyCompanyQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyCompanyQuery(baseOptions?: Apollo.QueryHookOptions<MyCompanyQuery, MyCompanyQueryVariables>) {
        return Apollo.useQuery<MyCompanyQuery, MyCompanyQueryVariables>(MyCompanyDocument, baseOptions);
      }
export function useMyCompanyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyCompanyQuery, MyCompanyQueryVariables>) {
          return Apollo.useLazyQuery<MyCompanyQuery, MyCompanyQueryVariables>(MyCompanyDocument, baseOptions);
        }
export type MyCompanyQueryHookResult = ReturnType<typeof useMyCompanyQuery>;
export type MyCompanyLazyQueryHookResult = ReturnType<typeof useMyCompanyLazyQuery>;
export type MyCompanyQueryResult = Apollo.QueryResult<MyCompanyQuery, MyCompanyQueryVariables>;
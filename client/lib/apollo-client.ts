import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

import { authErrorAction } from '../store/auth/actions';
import { getToken, saveTokenClient } from '../utils/cookies';

let apolloClient;

function createApolloClient(store) {
  const {
    app: { subdomain },
  } = store.getState();
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const apiDomain = process.env.API_DOMAIN || process.env.SITE_DOMAIN || 'localhost:3001';
  const uri = `${protocol}://${subdomain}.${apiDomain}/graphql`; // this is copy-paste

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = getToken();
    if (!token) {
      return { headers };
    }
    return {
      headers: {
        ...headers,
        'x-access-token': token,
      },
    };
  });
  const logoutLink = onError((err) => {
    console.debug('Graphql Error', err);
    const netError = (err.networkError as any)?.statusCode;
    const invalidAuth =
      (netError >= 401 && netError <= 403) ||
      err.graphQLErrors?.some((e) => {
        const code = e.extensions?.statusCode;
        return code >= 401 && code <= 403;
      });
    if (invalidAuth) {
      saveTokenClient('');
      store.dispatch(authErrorAction({}));
    }
  });
  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // set to true for SSR
    link: authLink.concat(logoutLink).concat(new HttpLink({ uri })),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState = null, store) {
  const _apolloClient = apolloClient ?? createApolloClient(store);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();
    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
}

// export function useApollo(initialState) {
//   const store = useMemo(() => initializeApollo(initialState), [initialState]);
//   return store;
// }

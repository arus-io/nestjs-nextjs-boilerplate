import debug from 'debug';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import thunk from 'redux-thunk';

import persist from '../lib/persist-saga';
import app from './app';
import auth, { rootSaga as authSaga } from './auth';
import { LOGOUT } from './auth/constants';
import history from './history';

const isServer = typeof window === 'undefined';

const { saga: persistSaga, getInitialState } = persist({
  clear: [LOGOUT],
  selector: (state) => ({
    auth: state.auth,
    app: state.app,
  }),
  throttle: 1000,
});

function* rootSaga() {
  return yield all([authSaga(), persistSaga()]);
}

const initialize = (initialState) => {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [thunk, sagaMiddleware];

  if (process.env.NODE_ENV === 'development') {
    let options;
    if (isServer) {
      options = {
        colors: {
          title: false,
          prevState: false,
          action: false,
          nextState: false,
          error: false,
        },
        logger: {
          log: debug('redux'),
        },
      };
    }
    middleware.push(createLogger(options));
  }

  const createStoreWithMiddleware = compose(applyMiddleware(...middleware))(createStore);

  const state = initialState || getInitialState();
  const store = createStoreWithMiddleware(
    combineReducers({
      form: formReducer,
      auth,
      app,
      history,
    }),
    state,
  );

  store.runSagaTask = () => {
    store.sagaTask = sagaMiddleware.run(rootSaga);
  };

  store.runSagaTask();
  return store;
};

export default initialize;

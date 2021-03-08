import { combineReducers } from 'redux';
import { all, call, takeEvery } from 'redux-saga/effects';

import actionKey from '../../utils/action-key';
import request from '../../utils/request';
import { AUTHENTICATION_ERROR, DISMISS_NOTIFICATION, EDIT_USER_SETTINGS, GET_ME, LOGOUT } from './constants';

export const roleReducer = (state = null, action) => {
  switch (action.type) {
    case actionKey.success(GET_ME):
      return action.payload.role || null;
    case LOGOUT:
    case actionKey.failure(GET_ME):
    case AUTHENTICATION_ERROR:
      return null;
    default:
      return state;
  }
};

export const meReducer = (state = null, action) => {
  switch (action.type) {
    case actionKey.success(GET_ME):
      return action.payload.user;
    case actionKey.success(EDIT_USER_SETTINGS):
      return {
        ...state,
        ...action.payload.user,
      };
    case LOGOUT:
    case actionKey.failure(GET_ME):
    case AUTHENTICATION_ERROR:
      return null;
    default:
      return state;
  }
};

const settingsLoading = (state = false, action) => {
  switch (action.type) {
    case EDIT_USER_SETTINGS:
      return true;
    case actionKey.failure(EDIT_USER_SETTINGS):
    case actionKey.success(EDIT_USER_SETTINGS):
      return false;
    default:
      return state;
  }
};

const notificationsReducer = (state = [], action) => {
  switch (action.type) {
    case actionKey.success(GET_ME):
      return action.payload.notifications || [];
    case actionKey.success(DISMISS_NOTIFICATION):
      return [...state, action.payload.notification];
    default:
      return state;
  }
};

const companyReducer = (state = [], action) => {
  switch (action.type) {
    case actionKey.success(GET_ME):
      return action.payload.company;
    default:
      return state;
  }
};

const impersonating = (state = false, action) => {
  switch (action.type) {
    case actionKey.success(GET_ME):
      return !!action.payload.impersonating;
    default:
      return state;
  }
};

export default combineReducers({
  role: roleReducer,
  me: meReducer,
  settingsLoading,
  notifications: notificationsReducer,
  company: companyReducer,
  impersonating,
});

/**
 * SAGA LISTENERS
 */

export function* rootSaga() {
  yield all([
    takeEvery(GET_ME, getMe),
    takeEvery(EDIT_USER_SETTINGS, editUserSettings),
    takeEvery(DISMISS_NOTIFICATION, dismissNotification),
  ]);
}

/**
 * SAGA ACTIONS
 */

export function* getMe({ type, reject, resolve }) {
  yield call(request, {
    type,
    url: '/api/auth/me',
    resolve,
    reject,
  });
}

export function* editUserSettings({ type, payload, resolve, reject }) {
  yield call(request, {
    type,
    url: '/api/auth/me',
    options: {
      method: 'PUT',
      body: payload,
    },
    resolve,
    reject,
    planDates: payload.planDates,
  });
}

export function* dismissNotification({ type, payload, resolve, reject }) {
  yield call(request, {
    type,
    url: '/api/auth/me/notification',
    options: {
      method: 'POST',
      body: payload,
    },
    resolve,
    reject,
  });
}

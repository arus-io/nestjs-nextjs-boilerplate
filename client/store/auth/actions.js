import { AUTHENTICATION_ERROR, DISMISS_NOTIFICATION, EDIT_USER_SETTINGS, GET_ME } from './constants';

const noop = () => null;

export const getMeAction = ({ reject, resolve } = {}) => ({
  type: GET_ME,
  reject,
  resolve,
});

export const authErrorAction = (data = {}) => ({
  type: AUTHENTICATION_ERROR,
  ...data,
});

export const editUserSettingsAction = (payload, { resolve = noop, reject = noop } = {}) => ({
  type: EDIT_USER_SETTINGS,
  payload,
  resolve,
  reject,
});

export const dismissNotificationAction = (payload, { resolve = noop, reject = noop } = {}) => ({
  type: DISMISS_NOTIFICATION,
  payload,
  resolve,
  reject,
});

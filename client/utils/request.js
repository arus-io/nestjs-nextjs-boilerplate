import fetch from 'isomorphic-fetch';
import isObject from 'lodash.isobject';
import { call, put, race, select, take } from 'redux-saga/effects';

import { authErrorAction } from '../store/auth/actions';
import { LOGOUT } from '../store/auth/constants';
import actionKey from './action-key';
import { getToken, saveTokenClient } from './cookies';

const noop = () => null;

export function* somethingWentWrong(type, res, rest) {
  let result;
  try {
    // eslint-disable-next-line no-console
    // console.log('Something wrong', type, res, rest);
    result = yield res.json();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Something more wrong!', e);
  }
  const error = {
    type: actionKey.failure(type),
    error: result && result.error ? result.error : 'Something went wrong',
    message: result && result.message,
    status: res.status,
    ...rest,
  };
  yield put(error);
  return error;
}

/**
 * sometimes fetch fail sync so this is guard
 * to prevent to everything fall apart
 */
const fetchWithGuard = async (url, options) => {
  let result;
  try {
    result = await fetch(url, options);
  } catch (e) {
    console.log('Failed to fetch', e);
    return {
      error: e.message || 'Something went wrong',
    };
  }

  return result;
};

const stringify = (value) => {
  if (isObject(value)) {
    return JSON.stringify(value);
  }
  return value;
};

export function* handler({
  type, // action name (ex. LOGIN, FETCH_USER)
  url,
  options = {},
  responseType = 'json',
  cancelActions = [],
  ...rest
}) {
  yield put({
    url,
    options,
    responseType,
    type: actionKey.init(type),
    ...rest,
  });
  const now = Date.now();
  const { app } = yield select();
  const cacheBust = `${url.indexOf('?') === -1 ? '?' : '&'}_${now}`;
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const apiDomain = process.env.API_DOMAIN || process.env.SITE_DOMAIN;
  const fullUrl = `${protocol}://${app.subdomain}.${apiDomain}${url}${cacheBust}`;
  const headers = {};
  const token = getToken();
  if (token) {
    headers['x-access-token'] = token;
  }
  let body;
  const upload =
    options.body &&
    Object.keys(options.body).find((key) => {
      const field = options.body[key];
      if (Array.isArray(field)) {
        return field.find((f) => f instanceof File);
      }
      return field instanceof File;
    });

  if (upload) {
    body = new FormData();
    Object.keys(options.body).forEach((name) => {
      if (options.body[name] == null) {
        return;
      }
      const isArray = Array.isArray(options.body[name]);
      const haveFile = isArray && options.body[name].find((f) => f instanceof File);
      if (haveFile) {
        options.body[name].forEach((value) => {
          body.append(name, value);
        });
      } else {
        body.append(name, stringify(options.body[name]));
      }
    });
  } else if (options.body) {
    body = JSON.stringify(options.body);
  }
  if (!upload) {
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';
  }
  const { res, cancel } = yield race({
    res: call(fetchWithGuard, fullUrl, {
      ...options,
      body,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    }),
    cancel: take([LOGOUT, ...cancelActions]),
  });
  if (cancel) {
    return null;
  }
  if (res.status === 402 || res.status === 401 || res.status === 403) {
    yield call(somethingWentWrong, type, res, rest);
    saveTokenClient('');
    return yield put(
      authErrorAction({
        ...rest,
        error: res.status === 401 ? 'Authentication error' : 'Expired',
        status: res.status,
      }),
    );
  }

  if (res.status !== 200) {
    // TODO report this error to the some third party service
    return yield call(somethingWentWrong, type, res, rest);
  }

  let payload;
  try {
    payload = yield res[responseType]();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Unknown error', e);
    return yield call(somethingWentWrong, type, res, rest);
  }

  yield put({
    payload,
    type: actionKey.success(type),
    ...rest,
  });
  return {
    ...rest,
    payload,
    // token,
    status: res.status,
    type: actionKey.success(type),
  };
}

export default function* request({ resolve = noop, reject = noop, ...rest }) {
  const result = yield handler(rest);

  if (result && result.error) {
    reject(result);
    return result;
  }
  resolve(result);
  return result;
}

export async function fetchApi({ getState, dispatch }, url, options = {}) {
  const { app } = getState();
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const apiDomain = process.env.API_DOMAIN || process.env.SITE_DOMAIN || 'localhost:3001';
  const fullUrl = `${protocol}://${app.subdomain}.${apiDomain}${url}`;
  const headers = {};
  const token = getToken();
  if (token) {
    headers['x-access-token'] = token;
  }
  let body;
  if (options.upload) {
    body = new FormData();
    // so - backend needs to unparse all this by hand:
    // unstringify any object/array, and deal with binary files
    Object.keys(options.body).forEach((name) => {
      const isArray = Array.isArray(options.body[name]);
      const haveFile = isArray && options.body[name].find((f) => f instanceof File);
      if (haveFile) {
        options.body[name].forEach((value) => {
          if (value instanceof File) {
            body.append(name, value);
          } else {
            body.append(name, stringify(value));
          }
        });
      } else {
        body.append(name, stringify(options.body[name]));
      }
    });
  } else {
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';
    if (options.body) {
      body = JSON.stringify(options.body);
    }
  }

  const res = await fetchWithGuard(fullUrl, {
    ...options,
    body,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  if (res.error) {
    // probably offline or network issues
    throw res.error;
  }

  if (res.status === 402 || res.status === 401 || res.status === 403) {
    const meta = {
      error: res.status === 401 ? 'Authentication error' : 'Expired',
      status: res.status,
    };
    saveTokenClient('');
    dispatch(authErrorAction(meta));
    throw await fetchApiError(res);
  }
  if (res.status >= 300) {
    throw await fetchApiError(res);
  }

  let payload;
  try {
    if (res.status !== 204) {
      payload = await res.json();
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Unknown error', e);
    throw e;
  }

  return {
    payload,
    status: res.status,
  };
}
async function fetchApiError(res) {
  let result;
  try {
    result = await res.json();
  } catch (e) {
    console.log('Empty error response', e);
  }
  const error = new Error((result && result.message) || res.statusText || 'Something went wrong');
  error.response = result;
  return error;
}

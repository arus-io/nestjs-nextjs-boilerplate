import { TWO_FA_METHODS } from '../screens/LoginPage/TwoFactorPage';
import { LOGOUT } from '../store/auth/constants';
import { saveImpersonateToken, saveTokenClient } from '../utils/cookies';
import { fetchApi } from '../utils/request';

// use with SWR
export const getApiDataAction = (url, api = '/api') => async (dispatch, getState) => {
  const r = await fetchApi({ getState, dispatch }, api + url, { method: 'GET' });
  return r.payload;
};

export const logoutAction = () => async (dispatch, getState) => {
  await fetchApi({ getState, dispatch }, '/v2/auth/logout', { method: 'POST' });
  saveTokenClient('');
  dispatch({ type: LOGOUT }); // just logout, no success action
};

export const impersonateAction = ({ userId, companyId }) => async (dispatch, getState) => {
  const { payload } = await fetchApi({ getState, dispatch }, '/v2/auth/impersonate', {
    body: { userId, companyId },
    method: 'POST',
  });

  saveImpersonateToken(payload.token);
  window.open(payload.site, '_blank');
};

export const refreshTokenAction = () => async (dispatch, getState) => {
  const r = await fetchApi({ getState, dispatch }, '/v2/auth/refresh', { method: 'POST' });
  saveTokenClient(r.payload.token);
  return r.payload;
};

export const requestForgotPassword = (body) => async (dispatch, getState) => {
  const r = await fetchApi({ getState, dispatch }, '/v2/auth/forgot-password', { body, method: 'POST' });
  return r.payload;
};

export const sendWelcomeEmail = (body) => async (dispatch, getState) => {
  const r = await fetchApi({ getState, dispatch }, '/api/admin/user/welcome-email', { body, method: 'POST' });
  return r.payload;
};


// 2FA
export const updateCompanyForceTwoFactorAction = (twoFactorEnabled) => async (dispatch, getState) => {
  const r = await fetchApi({ getState, dispatch }, `/v2/companies/two-factor`, {
    method: 'PUT',
    body: { twoFactorEnabled },
  });
  return r.payload;
};

export interface ITwoFactorEnableVM {
  success: boolean;
  otpauthURL: string;
  type: string;
}
export const enable2faMethodAction = (method: TWO_FA_METHODS, phone?) => async (
  dispatch,
  getState,
): Promise<ITwoFactorEnableVM> => {
  const r = await fetchApi({ getState, dispatch }, `/v2/auth/2fa/enable/${method}`, {
    method: 'POST',
    body: { phone },
  });
  return r.payload;
};

export interface IVerifyTwoStepMethodVM {
  token2fa: string;
  tokenType: string;
}

export const verify2faMethodAction = (payload: IVerifyTwoStepMethodVM) => async (
  dispatch,
  getState,
): Promise<ITwoFactorEnableVM> => {
  const r = await fetchApi({ getState, dispatch }, `/v2/auth/2fa/verify`, {
    method: 'POST',
    body: payload,
  });
  saveTokenClient(r.payload.token);
  return r.payload;
};

export interface IUpdateUserPhoneProps {
  phone: string;
}

export const request2faSMSAction = () => async (dispatch, getState): Promise<void> => {
  const r = await fetchApi({ getState, dispatch }, `/v2/auth/2fa/request/sms`, {
    method: 'POST',
  });

  return r.payload;
};


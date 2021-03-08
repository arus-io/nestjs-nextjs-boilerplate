import { combineReducers } from 'redux';

export const SET_SUBDOMAIN = 'app/SET_SUBDOMAIN';

export const setSubdomainAction = (payload) => ({
  type: SET_SUBDOMAIN,
  payload,
});

const subdomain = (state = null, action) => {
  if (action.type === SET_SUBDOMAIN) {
    return action.payload;
  }
  return state;
};

export default combineReducers({
  subdomain,
});

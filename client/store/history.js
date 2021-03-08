const LOCATION_CHANGE = 'history/LOCATION_CHANGE';

export const locationChangeAction = (payload) => ({
  type: LOCATION_CHANGE,
  payload,
});

const history = (state = null, action) => {
  if (action.type === LOCATION_CHANGE) {
    return action.payload;
  }
  return state;
};

export default history;

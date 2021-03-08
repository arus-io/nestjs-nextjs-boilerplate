import { throttle, select, takeEvery } from 'redux-saga/effects';
import localStorage from './adapters/local-storage';

/**
 * Persist saga
 * @param {Object} options.clear:} [description]
 * @yield {[type]} [description]
 */
export default function persistSaga({
  clear,
  throttle: ms,
  selector = (state) => state,
  key = 'persist-state',
  store = localStorage,
  always = [],
  shouldPersist = () => true,
} = {}) {
  const listeners = [];
  const save = function* saveState() {
    const state = yield select();
    if (shouldPersist(state)) {
      yield store.set(key, selector(state));
    }
  };

  if (ms) {
    listeners.push(throttle(ms, '*', save));
    always.forEach((event) => {
      listeners.push(takeEvery(event, save));
    });
  } else {
    listeners.push(takeEvery('*', save));
  }

  if (clear) {
    listeners.push(
      takeEvery(clear, function* clearStore() {
        yield store.remove(key);
      }),
    );
  }

  function* saga() {
    yield listeners;
  }
  const getInitialState = () => store.get(key) || {};

  return {
    saga,
    getInitialState,
  };
}

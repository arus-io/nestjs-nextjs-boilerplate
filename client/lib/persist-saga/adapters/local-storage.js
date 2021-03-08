/* global localStorage */
let cache = {};
function supportStorage() {
  // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
  const mod = 'persist-saga';
  try {
    localStorage.setItem(mod, mod);
    localStorage.removeItem(mod);
    return true;
  } catch (e) {
    return false;
  }
}

const supported = supportStorage();

export const set = (item, val) => {
  cache[item] = val;
  if (!supported) {
    return val;
  }
  const value = JSON.stringify(val);
  localStorage.setItem(item, value);
  return val;
};

export const get = (key) => {
  if (typeof cache[key] !== 'undefined') {
    return cache[key];
  }
  if (!supported) {
    return null;
  }
  let item = localStorage.getItem(key);
  try {
    item = JSON.parse(item);
  } catch (e) {
    return null;
  }
  return item;
};

export const remove = (item) => {
  cache[item] = undefined;
  if (!supported) {
    return null;
  }
  return localStorage.removeItem(item);
};

export const clear = () => {
  cache = {};
  if (supported) {
    localStorage.clear();
  }
};

export default {
  remove,
  get,
  clear,
  set,
};

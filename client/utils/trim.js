import isString from 'lodash.isstring';

const trimWhiteSpace = (str) => {
  if (isString(str)) {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
  }
  return str;
};

module.exports = trimWhiteSpace;

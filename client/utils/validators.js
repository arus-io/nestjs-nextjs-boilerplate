import isEmail from 'is-email';
import isSubdomainValid from 'is-subdomain-valid';
import isUrl from 'is-url-superb';
import trimWhiteSpace from './trim';

const COMMON_REGEX = {
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/,
  phone: /^\d{10}$/g,
  zipCode: /^\d{5}(?:[-\s]\d{4})?$/,
  // Only accepts '-' & spaces or full number
  ssn: /^(?!123([ -]?)45([ -]?)6789)(?!\b(\d)\3+\b)(?!000|666|900|999)[0-9]{3}([ -]?)(?!00)[0-9]{2}\4(?!0000)[0-9]{4}$/,
};

export const fieldRequired = (value) => {
  const isEmptyArray = Array.isArray(value) && !value.length;

  if (value == null || trimWhiteSpace(value) === '' || isEmptyArray) {
    return 'This field is required!';
  }
  return undefined;
};

export const validEmail = (value) => {
  if (!isEmail(value) && value) {
    return 'Email is not valid';
  }
  return undefined;
};

export const validDate = (value) => {
  const msg = 'Date is not valid';
  // Algorithm: https://en.wikipedia.org/wiki/Leap_year
  const isLeapYear = (y) => (!(y % 4) && y % 100) || !(y % 400);
  // Don't assume leap year for Feb
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (isLeapYear(year)) {
    monthDays[1] = 29;
  }

  if (!value || value === '__/__/____') {
    return undefined;
  }

  const dateParts = value.split('/');
  const year = Number.parseInt(dateParts[2], 10);
  const month = Number.parseInt(dateParts[0], 10);
  const day = Number.parseInt(dateParts[1], 10);

  const validValues = !(Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(year));
  const validMonth = month > 0 && month <= 12;
  const validDay = day > 0 && day <= monthDays[month - 1];

  if (!validValues || !validMonth || !validDay) {
    return msg;
  }
  return undefined;
};

export const validPassword = (value) => {
  if (value && !value.match(COMMON_REGEX.password)) {
    return 'Password is not valid';
  }
  return undefined;
};

export const validSubdomain = (value) => {
  if (isSubdomainValid(value)) {
    return undefined;
  }
  if (value === 'admin') {
    return 'That subdomain is not valid';
  }
  return 'Invalid subdomain';
};

export const validUrl = (value) => {
  if (!value) {
    return undefined;
  }
  if (isUrl(value)) {
    return undefined;
  }
  return 'URL is not valid';
};

export const validOrder = (value) => {
  if (!value) {
    return undefined;
  }
  if (parseInt(value, 10) >= 0) {
    return undefined;
  }
  return 'Order must be a number bigger than 0';
};

const youtubeRegExp = /(?:(?:https?:\/\/)(?:www)?\.?(?:youtu\.?be)(?:\.com)?\/(?:.*[=/])*)([^= &?/\r\n]{8,11})/;
const vimeoRegExp = /.(vimeo)\.com\/(\d+)/;
const isYoutube = (value) => youtubeRegExp.test(value);
const isVimeo = (value) => vimeoRegExp.test(value);

export const validVideoUrl = (value) => {
  if (!value) {
    return undefined;
  }
  if (isYoutube(value) || isVimeo(value)) {
    return undefined;
  }
  return 'Only YouTube and Vimeo links are supported.';
};

export const validPhone = (value) => {
  const msg = 'Phone is not valid';

  if (!value) {
    return undefined;
  }

  if (value && !value.match(COMMON_REGEX.phone)) {
    return msg;
  }
  return undefined;
};

export const validZipCode = (value) => {
  if (!value) {
    return undefined;
  }

  if (value && !value.match(COMMON_REGEX.zipCode)) {
    return 'Zip code is not valid';
  }

  return undefined;
};

export const validSSN = (value) => {
  if (!value) {
    return undefined;
  }

  if (value && !value.match(COMMON_REGEX.ssn)) {
    return 'SSN is not valid';
  }

  return undefined;
};

export default {
  fieldRequired,
  validEmail,
  validDate,
  validSubdomain,
  validPassword,
  validUrl,
  validZipCode,
  validSSN,
};

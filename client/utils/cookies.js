import Cookie from 'js-cookie';

let serverSideToken = '';
export const readTokenFromRequest = (req, res, subdomain) => {
  const token = getTokenFromRequest(req, res, subdomain);
  serverSideToken = token;
  return token;
};

export function getToken() {
  // if we read token from request, we stored it in memory for future ref
  return serverSideToken || Cookie.get('token');
}

const getTokenFromRequest = (req, res, subdomain) => {
  const cookie = req?.headers?.cookie;
  if (!cookie) {
    return null;
  }
  const parts = cookie.split(';');
  const values = {
    token: parts.find((c) => c.trim().startsWith('token=')),
    impersonate: parts.find((c) => c.trim().startsWith('impersonate=')),
  };
  if (values.token) {
    values.token = values.token.split('=')[1];
  }
  if (values.impersonate) {
    values.impersonate = values.impersonate.split('=')[1];
  }

  if (values.impersonate) {
    const commonDomain = process.env.SITE_DOMAIN.split(':').shift(); // remove port
    res.clearCookie('impersonate', { domain: `.${commonDomain}` });
    if (subdomain !== 'admin') {
      // set as token and remove
      const HOURS = 1000 * 60 * 60;
      res.cookie('token', values.impersonate, { maxAge: 3 * HOURS });
      // mainly to avoid this token to be set for the admin if they refresh
      return values.impersonate;
    }
  } else if (values.token) {
    return values.token;
  }
};

export const saveImpersonateToken = (token) => {
  const commonDomain = process.env.SITE_DOMAIN.split(':').shift(); // remove port
  Cookie.set('impersonate', token, { domain: `.${commonDomain}` });
};

export function saveTokenClient(token) {
  if (!token) {
    Cookie.remove('token');
  } else {
    Cookie.set('token', token, { expires: 1 });
  }
}

// unused
export function saveTokenServer(res, token) {
  if (!token) {
    res.clearCookie('token');
  } else {
    res.cookie('token', token, { expires: 1 });
  }
}

module.exports = {
  readTokenFromRequest,
  saveImpersonateToken,
  saveTokenClient,
  getToken,
};

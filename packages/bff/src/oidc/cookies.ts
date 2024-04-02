import { CookieOptions } from 'express';
import session from 'express-session';

// TODO: refactor to ../config.ts
const cookieName = process.env.COOKIE_NAME || 'cookieName';
const secret = process.env.SESSION_SECRET || 'SecretHere';
const enableHttps = process.env.ENABLE_HTTPS === 'true';

export const setCookie = (res: any, value: string) => {
  const options: CookieOptions = {
    httpOnly: true, // Cookie not accessible via client-side script
    secure: enableHttps, // Cookie will be sent only over HTTPS if set to true
		sameSite: 'strict', // https://www.npmjs.com/package/cookie#samesite
  };
  res.cookie(cookieName, value, options);
};

export const readCookie = (req: any) => {
  return req.cookies[cookieName];
};

export const deleteCookie = async (res: any) => {
  try {
    res.clearCookie[cookieName];
    res.clearCookie('connect.sid');
  } catch (error) {
    console.error('deleteCookie failed: ', error);
  }
};

export const sessionMiddleware = session({
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, secure: enableHttps, sameSite: 'strict' },
});

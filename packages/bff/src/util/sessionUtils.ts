import { CookieOptions } from 'express';
import session from 'express-session';
import '../config/env';
import { isLocal } from '..';

export const setCookie = (res: any, value: string) => {
  const cookieName = process.env.COOKIE_NAME || 'cookieName';
  const options: CookieOptions = {
    // maxAge: 1000 * 60 * 5, // Cookie will expire in 5 min
    // maxAge not set means cookie will be removed when browser is closed
    httpOnly: true, // Cookie not accessible via client-side script
    secure: process.env.IS_LOCAL === 'true' ? false : true, // Cookie will be sent only over HTTPS if set to true
  };
  res.cookie(cookieName, value, options);
};

export const readCookie = (req: any) => {
  const cookieName = process.env.COOKIE_NAME || 'cookieName';
  return req.cookies[cookieName] || null;
};

export const deleteCookie = async (res: any) => {
  try {
    res.clearCookie[process.env.COOKIE_NAME || 'cookieName'];
    res.clearCookie('connect.sid');
  } catch (error) {
    console.error('deleteCookie failed: ', error);
  }
};

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'SecretHere',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, secure: isLocal ? false : true },
});

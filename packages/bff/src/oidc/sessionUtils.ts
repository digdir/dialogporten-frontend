import { CookieOptions } from 'express';
import session from 'express-session';
import logger from '../logger';

export const setCookie = (res: any, value: string) => {
  const cookieName = process.env.COOKIE_NAME || 'cookieName';
  const options: CookieOptions = {
    httpOnly: true, // Cookie not accessible via client-side script
    secure: process.env.ENABLE_HTTPS === 'true' ? true : false, // Cookie will be sent only over HTTPS if set to true
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
    logger.error('deleteCookie failed: ', error);
  }
};

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'SecretHere',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, secure: process.env.ENABLE_HTTPS ? true : false },
});

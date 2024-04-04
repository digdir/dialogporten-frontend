import { FastifyReply, FastifyRequest } from 'fastify';
import config from '../config';

const CONNECT_SID_COOKIE = 'connect.sid';
const { enableHttps, cookieName, secret} = config
export const setCookie = (res: FastifyReply, value: string) => {
  const options = {
    httpOnly: true, // Cookie not accessible via client-side script
    secure: enableHttps, // Cookie will be sent only over HTTPS if set to true
  };
  res.cookie(cookieName, value, options)
};

export const readCookie = (req: FastifyRequest) => {
  return req.cookies[cookieName] ?? '';
};

export const deleteCookie = async (res: FastifyReply) => {
  try {
    res.clearCookie(cookieName);
    res.clearCookie(CONNECT_SID_COOKIE);
  } catch (error) {
    console.error('Unable to clear cookie: ', error);
  }
};

export const cookieSessionConfig = {
  secret,
  cookieName,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  secure: enableHttps,
  sameSite: 'lax', // this will automatically be set to lax for http, so maybe we should avoid this?
  saveUninitialized: false,
};

import axios from 'axios';
import passport from 'passport';
import { SessionRepository } from '../db';
import { SessionData } from '../entities/SessionData';
import { readCookie } from './cookies';

const loginURL = '/api/login';

/* TODO: Fix this - unable to locate user session */
export async function ensureAuthenticated(req: any, res: any, next: any) {
  try {
    if (!SessionRepository) {
      throw new Error('SessionRepository not initialized');
    }
    const sessionCookie = readCookie(req);
    req.session.returnTo = req.originalUrl;

    if (!sessionCookie) {
      return res.status(401).json({ error: 'Unauthorized, no session cookie' });
    }

    let session: any = null;
    if (sessionCookie) {
      session = await SessionRepository.findOneBy({ id: sessionCookie });
      console.log(sessionCookie);

      if (session === null) {
        return res.status(401).json({ error: "Unauthorized, couldn't find session" });
      }
    }

    const isRefreshTokenValid = session?.refreshTokenExpiresAt && session?.refreshTokenExpiresAt > new Date();
    const isAccessTokenValid = session?.accessTokenExpiresAt && session?.accessTokenExpiresAt > new Date();

    if (session.id && !isAccessTokenValid && isRefreshTokenValid) {
      await refreshTokens(sessionCookie);
      session = await SessionRepository.findOneBy({ id: sessionCookie });
    }

    if (session.id && isRefreshTokenValid && isAccessTokenValid) {
      await refreshTokens(sessionCookie);
      session = await SessionRepository.findOneBy({ id: sessionCookie });
      req.user = session;

      // Happy path:
      return next();
    }

    if (session.id && !isRefreshTokenValid && !isAccessTokenValid) {
      req.logout(async (err: Error) => {
        if (err) {
          console.error(err);
          return next(err);
        }
        await SessionRepository?.delete(session!.id);
      });

      return res.status(401).json({ error: 'Unauthorized, token have expired and you have been logged out' });
    }

    req.session.returnTo = req.originalUrl;
    if (req.isAuthenticated()) {
      // Happy path:
      return next();
    }

    return res.status(401).json({ error: 'Unauthorized' });
  } catch (error) {
    console.error('ensureAuthenticated error: ', error);

    return res.status(401).json({ error: 'Unauthorized, something went wrong' });
  }
}

async function refreshTokens(sessionId: string) {
  if (!SessionRepository) {
    throw new Error('SessionRepository not initialized');
  }

  const session = await SessionRepository.findOneBy({ id: sessionId });
  if (!session) {
    throw new Error('refreshTokens: Session not found');
  }

  const tokenEndpoint = `https://${process.env.OIDC_URL}/token`;
  const AuthString = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;
  const AuthEncoded = `Basic ${Buffer.from(AuthString).toString('base64')}`;
  if (!tokenEndpoint || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET) return;

  const response = await axios.post(
    tokenEndpoint,
    {
      grant_type: 'refresh_token',
      refresh_token: session.refreshToken,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: AuthEncoded,
      },
    },
  );

  const {
    access_token: accessToken = '',
    refresh_token: refreshToken = '',
    expires_in, //= process.env.ACCESS_TOKEN_EXPIRES_IN || 1200,
  } = response.data;
  const accessTokenExpiresAt = new Date();
  const refreshTokenExpiresAt = new Date();
  const refreshExpiresIn: number = process.env.REFRESH_TOKEN_EXPIRES_IN
    ? parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN)
    : 3600;
  accessTokenExpiresAt.setSeconds(accessTokenExpiresAt.getSeconds() + expires_in);
  refreshTokenExpiresAt.setSeconds(refreshTokenExpiresAt.getSeconds() + refreshExpiresIn);
  const n = new Date();

  const sessionProps: Partial<SessionData> = {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt,
  };
  await SessionRepository?.update(sessionId, sessionProps);
  return response.data;
}

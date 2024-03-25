import axios from 'axios';
import passport from 'passport';
import { SessionRepository } from '../db';
import { SessionData } from '../entities/SessionData';
import { readCookie } from './cookies';

/* TODO: Fix this - unable to locate user session */
export async function ensureAuthenticated(req: any, res: any, next: any) {
  if (!SessionRepository) {
    throw new Error('SessionRepository not initialized');
  }
  const sessionCookie = readCookie(req);
  req.session.returnTo = req.originalUrl;
  let session = sessionCookie ? await SessionRepository.findOneBy({ id: sessionCookie }) : null;

  const isRefreshTokenValid = session?.refreshTokenExpiresAt && session?.refreshTokenExpiresAt > new Date();
  const isAccessTokenValid = session?.accessTokenExpiresAt && session?.accessTokenExpiresAt > new Date();

  if (session?.id && !isAccessTokenValid && isRefreshTokenValid) {
    await refreshTokens(sessionCookie);
    session = await SessionRepository.findOneBy({ id: sessionCookie });
  }

  if (session?.id && isRefreshTokenValid && isAccessTokenValid) {
    await refreshTokens(sessionCookie);
    session = await SessionRepository.findOneBy({ id: sessionCookie });
    req.user = session;
    return next();
  }

  if (session?.id && !isRefreshTokenValid && !isAccessTokenValid) {
    req.logout(async (err: Error) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      await SessionRepository?.delete(session!.id);
      res.redirect('/auth/login');
      return;
    });

    return;
  }

  try {
    req.session.returnTo = req.originalUrl;
    if (req.isAuthenticated()) {
      return next();
    }

    // Redirect the user to the identity provider for authentication
    passport.authenticate('oidc', {
      failureRedirect: '/auth/login',
    })(req, res, next);
  } catch (error) {
    console.error('ensureAuthenticated error: ', error);
  }
}

async function refreshTokens(sessionId: string) {
  try {
    if (!SessionRepository) throw new Error('SessionRepository not initialized');
    const session = await SessionRepository.findOneBy({ id: sessionId });
    if (!session) {
      throw new Error('refreshTokens: Session not found');
    }

    const tokenEndpoint = `https://${process.env.OIDC_URL}/token`;
    const AuthString = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;
    const AuthEncoded = `Basic ${Buffer.from(AuthString).toString('base64')}`;
    if (!tokenEndpoint || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET) return;

    axios
      .post(
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
      )
      .then(async (response) => {
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
      })
      .catch((error) => {
        // Handle error
        console.error('Error refreshing token:', error);
        return error;
      });
  } catch (error) {
    console.error('refreshTokens error: ', error);
  }
}

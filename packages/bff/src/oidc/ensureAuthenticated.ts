import axios from 'axios';
import { SessionRepository } from '../db';
import { SessionData } from '../entities/SessionData';
import { readCookie } from './cookies';
import { FastifyReply, FastifyRequest } from 'fastify';

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
    expires_in,
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

export async function ensureAuthenticated(req: FastifyRequest, reply: FastifyReply) {
  if (!SessionRepository) {
    reply.code(401).send({ error: 'SessionRepository not initialized' });
    return;
  }

  const sessionCookie = readCookie(req);
  if (!sessionCookie) {
    reply.code(401).send({ error: 'Unauthorized, no session cookie' });
    return;
  }

  let session = await SessionRepository.findOneBy({ id: sessionCookie });
  if (!session) {
    reply.code(401).send({ error: "Unauthorized, couldn't find session" });
    return;
  }

  const isRefreshTokenValid = session.refreshTokenExpiresAt > new Date();
  const isAccessTokenValid = session.accessTokenExpiresAt > new Date();

  if (session.id && (!isAccessTokenValid || isRefreshTokenValid)) {
    try {
      await refreshTokens(sessionCookie);
      session = await SessionRepository.findOneBy({ id: sessionCookie });
      if (!session) {
        reply.code(401).send({ error: 'Unauthorized, session not found after refresh' });
        return;
      }
      req.user = session;
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      reply.code(401).send({ error: 'Unauthorized, failed to refresh tokens' });
      return;
    }
  }

  if (session.id && !isRefreshTokenValid && !isAccessTokenValid) {
    await req.logOut();
    await SessionRepository.delete(session.id);
    reply.code(401).send({ error: 'Unauthorized, token expired and you have been logged out' });
  }
}


import { logger } from '@digdir/dialogporten-node-logger';
import axios from 'axios';
import type { FastifyPluginAsync, FastifyRequest, IdPortenUpdatedToken } from 'fastify';
import fp from 'fastify-plugin';
import config from '../config.ts';
import type { SessionStorageToken } from './oidc.ts';

const refreshAllTokens = async (request: FastifyRequest) => {
  const token: SessionStorageToken | undefined = request.session.get('token');

  if (!token) {
    return;
  }

  const tokenEndpoint = `https://${config.oidc_url}/token`;
  const basicAuthString = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;
  const authEncoded = `Basic ${Buffer.from(basicAuthString).toString('base64')}`;

  const refreshResponse = await axios.post(
    tokenEndpoint,
    {
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: authEncoded,
      },
    },
  );

  const updatedToken: IdPortenUpdatedToken = refreshResponse?.data;

  if (updatedToken) {
    const refreshTokenExpiresAt = new Date(Date.now() + updatedToken.refresh_token_expires_in * 1000).toISOString();
    const accessTokenExpiresAt = new Date(Date.now() + updatedToken.expires_in * 1000).toISOString();

    const updatedSessionStorageToken = {
      ...token,
      access_token: updatedToken.access_token,
      refresh_token_expires_at: refreshTokenExpiresAt,
      refresh_token: updatedToken.refresh_token,
      access_token_expires_at: accessTokenExpiresAt,
    };

    request.session.set('token', updatedSessionStorageToken);
  }
};

/**
 * Checks the validity of the session token in the request and optionally refreshes the token if necessary.
 *
 * @param {FastifyRequest} request - The Fastify request object containing the session token.
 * @param {boolean} allowTokenRefresh - Flag indicating whether the function should attempt to refresh tokens if the access token has expired.
 * @returns {Promise<boolean>} - Returns `true` if the access token is still valid or if it has been successfully refreshed.
 *                               Returns `false` if the token is invalid or cannot be refreshed.
 *
 * The function performs the following:
 * 1. Retrieves the session token from the request. If the token is not present, returns `false`.
 * 2. Validates the expiration times of the access token and the refresh token.
 * 3. If the access token is still valid, returns `true`.
 * 4. If the access token is expired and the refresh token is also invalid or token refresh is not allowed, returns `false`.
 * 5. If the access token is expired, but the refresh token is valid and token refresh is allowed, it attempts to refresh all tokens.
 * 6. If the refresh operation succeeds, returns `true`; otherwise, returns `false`.
 */
const getIsTokenValid = async (request: FastifyRequest, allowTokenRefresh: boolean): Promise<boolean> => {
  const token: SessionStorageToken | undefined = request.session.get('token');

  if (!token) {
    return false;
  }

  const now = new Date();
  const accessTokenExpiresAt = new Date(token.access_token_expires_at);
  const isRefreshTokenValid = new Date(token.refresh_token_expires_at) > now;
  const accessTokenWillExpireNextMinute = accessTokenExpiresAt.getTime() - now.getTime() < 60 * 1000;
  const isAccessTokenValid = accessTokenExpiresAt > now;

  if (isAccessTokenValid && !accessTokenWillExpireNextMinute) {
    return true;
  }

  if (!isRefreshTokenValid) {
    return false;
  }

  if (!allowTokenRefresh) {
    return false;
  }

  try {
    await refreshAllTokens(request);
    return true;
  } catch (e) {
    return false;
  }
};

const plugin: FastifyPluginAsync = async (fastify, _) => {
  fastify.decorate('verifyToken', (allowTokenRefresh: boolean) => {
    return async (request: FastifyRequest) => {
      try {
        request.tokenIsValid = await getIsTokenValid(request, allowTokenRefresh);
      } catch (e) {
        logger.error(e, 'Unable to verify token');
        request.tokenIsValid = false;
      }
    };
  });
};
export default fp(plugin, {
  fastify: '4.x',
  name: 'fastify-verify-token',
});

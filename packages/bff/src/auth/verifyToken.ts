import axios from 'axios';
import type { FastifyPluginAsync, FastifyReply, FastifyRequest, IdPortenUpdatedToken } from 'fastify';
import fp from 'fastify-plugin';
import config from '../config.ts';
import type { SessionStorageToken } from './oidc.ts';

const getIsTokenValid = async (request: FastifyRequest): Promise<boolean> => {
  const token: SessionStorageToken = request.session.get('token');

  if (!token) {
    return false;
  }

  const now = new Date();
  console.log('getIsTokenValid: now: ', now);
  const accessTokenExpiresAt = new Date(token.access_token_expires_at);
  const refreshTokenExpiresAt = new Date(token.refresh_token_expires_at);
  const isRefreshTokenValid = refreshTokenExpiresAt > now;
  const isAccessTokenValid = accessTokenExpiresAt > now;
  console.log('verifyToken:   isAccessTokenValid: ', isAccessTokenValid);
  console.log('verifyToken: accessTokenExpiresAt: ', accessTokenExpiresAt);
  console.log('verifyToken:    refresh token exp: ', refreshTokenExpiresAt);

  if (isAccessTokenValid) {
    console.log('verifyToken: isAccessTokenValid valid, returning true: ', isAccessTokenValid);
    return true;
  }
  console.log('verifyToken: isAccessTokenValid not valid, returning false: ', isAccessTokenValid);

  if (!isAccessTokenValid || (isRefreshTokenValid && refreshTokenExpiresAt.getTime() - now.getTime() < 60000)) {
    console.log('verifyToken: isAccessTokenValid: ', isAccessTokenValid);
    if (!isRefreshTokenValid) {
      console.log('verifyToken: isRefreshTokenValid not valid, returning false: ', isRefreshTokenValid);
      return false;
    }
    console.log('verifyToken: isRefreshTokenValid valid, trying to renew token: ', isRefreshTokenValid);

    try {
      const tokenEndpoint = `https://${config.oidc_url}/token`;
      const basicAuthString = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;
      const authEncoded = `Basic ${Buffer.from(basicAuthString).toString('base64')}`;

      const refreshResponse = await axios.post(
        tokenEndpoint,
        {
          grant_type: 'refresh_token',
          refresh_token: token.refresh_token,
          scope: 'digdir:dialogporten openid',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: authEncoded,
          },
        },
      );

      console.log('verifyToken: refreshResponse: ', refreshResponse);
      const updatedToken: IdPortenUpdatedToken = refreshResponse?.data;
      console.log('verifyToken: updatedToken: ', updatedToken);

      if (updatedToken) {
        const newRefreshTokenExpiresAt = new Date(
          Date.now() + updatedToken.refresh_token_expires_in * 1000,
        ).toISOString();
        const newAccessTokenExpiresAt = new Date(Date.now() + updatedToken.expires_in * 1000).toISOString();
        console.log('verifyToken: newRefreshToken: ', newRefreshTokenExpiresAt);
        console.log('verifyToken: newAccessToken: ', newAccessTokenExpiresAt);

        /* We need to make sure id_token is included or else it will expire and log out will not work */
        const updatedSessionStorageToken = {
          ...token,
          access_token: updatedToken,
          refresh_token_expires_at: newRefreshTokenExpiresAt,
          refresh_token: updatedToken.refresh_token,
          access_token_expires_at: newAccessTokenExpiresAt,
          idToken: updatedToken?.id_token || token.id_token,
        };

        console.log('verifyToken: updatedSessionStorageToken: ', updatedSessionStorageToken);
        request.session.set('token', updatedSessionStorageToken);

        return true;
      }
    } catch (error) {
      console.log('Error in renewing token', error);
      return false;
    }
  }
  return false;
};

const plugin: FastifyPluginAsync = async (fastify, _) => {
  fastify.decorate('verifyToken', (request: FastifyRequest, reply: FastifyReply, done) => {
    getIsTokenValid(request)
      .then((isValid) => {
        if (isValid) {
          done();
        }
        if (!isValid) {
          done(new Error('unauthenticated'));
        }
      })
      .catch(done);
  });
};

export default fp(plugin, {
  fastify: '4.x',
  name: 'fastify-verify-token',
});

import axios from 'axios';
import { FastifyPluginAsync, FastifyReply, FastifyRequest, IdPortenUpdatedToken } from 'fastify';
import fp from 'fastify-plugin';
import config from '../config.ts';
import { SessionStorageToken } from './oidc.ts';

export const validateOrRefreshToken = async (request: FastifyRequest): Promise<boolean> => {
  const token: SessionStorageToken = request.session.get('token');

  if (!token) {
    return false;
  }

  const now = new Date();
  const accessTokenExpiresAt = new Date(token.access_token_expires_at);
  const isRefreshTokenValid = new Date(token.refresh_token_expires_at) > now;
  const isAccessTokenValid = accessTokenExpiresAt > now;

  if (isAccessTokenValid) {
    return true;
  }

  if (!isAccessTokenValid) {
    if (!isRefreshTokenValid) {
      return false;
    }

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

      const updatedToken: IdPortenUpdatedToken = refreshResponse?.data;

      if (updatedToken) {
        const refreshTokenExpiresAt = new Date(Date.now() + updatedToken.refresh_token_expires_in * 1000).toISOString();
        const accessTokenExpiresAt = new Date(Date.now() + updatedToken.expires_in * 1000).toISOString();

        /* We need to make sure id_token is included or else it will expire and log out will not work */
        const updatedSessionStorageToken = {
          ...token,
          access_token: updatedToken,
          refresh_token_expires_at: refreshTokenExpiresAt,
          refresh_token: updatedToken.refresh_token,
          access_token_expires_at: accessTokenExpiresAt,
          idToken: updatedToken?.id_token || token.id_token,
        };

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
    validateOrRefreshToken(request)
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

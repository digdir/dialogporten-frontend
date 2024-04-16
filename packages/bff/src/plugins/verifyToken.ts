import axios from 'axios';
import { FastifyPluginAsync, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';
import config from '../config';
import { IdTokenPayload, SessionStorageToken } from './oidc';
export async function getIsTokenValid(request: FastifyRequest): Promise<boolean> {
  const token: SessionStorageToken = request.session.get('token');
  const refreshTokenExpiresAt: string = request.session.get('refreshTokenExpiresAt');

  if (!token || !refreshTokenExpiresAt) {
    return false;
  }

  const now = new Date();
  const accessTokenExpiresAt = new Date(token.expires_at);
  const isRefreshTokenValid = new Date(refreshTokenExpiresAt) > now;
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
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: authEncoded,
          },
        },
      );

      const updatedToken = refreshResponse?.data;

      if (updatedToken) {
        const refreshTokenExpiresAt = new Date(new Date().getSeconds() + updatedToken.refresh_token_expires_in);

        const { sub, locale = 'nb' } = jwt.decode(updatedToken.id_token) as IdTokenPayload;

        request.session.set('token', updatedToken);
        request.session.set('refreshTokenExpiresAt', refreshTokenExpiresAt);
        request.session.set('sub', sub);
        request.session.set('locale', locale);

        return true;
      }
    } catch (error) {
      console.log('Error in renewing token', error);
      return false;
    }
  }
  return false;
}

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

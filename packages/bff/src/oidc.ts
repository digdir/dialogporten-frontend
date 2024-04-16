import oauthPlugin, { OAuth2Namespace } from '@fastify/oauth2';
import { FastifyPluginAsync, FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';
import config from './config';

declare module 'fastify' {
  interface FastifyInstance {
    idporten: OAuth2Namespace;
  }
}

declare module 'fastify' {
  interface Session {
    token: SessionStorageToken;
  }
}

interface SessionStorageToken {
  access_token: string;
  refresh_token: string;
  id_token: string;
}

interface CustomOICDPluginOptions {
  oidc_url: string;
  hostname: string;
  client_id: string;
  client_secret: string;
  refresh_token_expires_in: number;
}

interface OAuthPluginOptions {
  name: string;
  scope: string[];
  credentials: {
    client: {
      id: string;
      secret: string;
    };
  };
  startRedirectPath: string;
  callbackUri: string;
  discovery: {
    issuer: string;
  };
}

interface IdTokenPayload {
  sub: string;
  locale: string;
  jwt: string;
}
interface ValidToken {
  idToken: IdTokenPayload;
}

export async function validateRequest(request: FastifyRequest): Promise<ValidToken | undefined> {
  const token: SessionStorageToken = request.session.get('token');
  const idTokenJwt: string = token?.id_token;

  if (!idTokenJwt) {
    return undefined;
  }

  const { sub, locale = 'nb' } = jwt.decode(idTokenJwt) as IdTokenPayload;
  /* TODO
    1. jwt.verify(token, secretKey) => not valid -> return undefined
    2. check expiration of token and refresh token, refresh if needed
   */

  return {
    idToken: {
      sub,
      locale,
      jwt: idTokenJwt,
    },
  } as ValidToken;
}

const plugin: FastifyPluginAsync<CustomOICDPluginOptions> = async (fastify, options) => {
  const { client_id, client_secret, oidc_url, hostname } = options;

  fastify.register<OAuthPluginOptions>(oauthPlugin as unknown as FastifyPluginCallback<OAuthPluginOptions>, {
    name: 'idporten',
    scope: ['digdir:dialogporten.noconsent', 'openid'],
    credentials: {
      client: {
        id: client_id,
        secret: client_secret,
      },
    },
    startRedirectPath: '/api/login/',
    callbackUri: `${hostname}/api/cb`,
    discovery: {
      issuer: `https://${oidc_url}/.well-known/openid-configuration`,
    },
  });

  fastify.get('/api/cb', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const { token } = await this.idporten.getAccessTokenFromAuthorizationCodeFlow(request);
      request.session.set('token', token);
      reply.redirect('/?loggedIn=true');
    } catch (e) {
      console.log(e);
      reply.status(500);
    }
  });

  fastify.get('/api/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    const validToken = await validateRequest(request);
    if (validToken) {
      const {
        idToken: { jwt: idTokenJwt },
      } = validToken;
      const postLogoutRedirectUri = `${config.hostname}/loggedout`;
      if (jwt) {
        const logoutRedirectUrl = `https://login.${config.oidc_url}/logout?post_logout_redirect_uri=${postLogoutRedirectUri}&id_token_hint=${idTokenJwt}`;
        request.session.set('token', undefined);
        reply.setCookie('token', '', {
          expires: new Date('01-01-1997'),
        });
        reply.redirect(logoutRedirectUrl);
      }
    }
    reply.status(501);
  });
};
export default fp(plugin, {
  fastify: '4.x',
  name: 'fastify-oicd',
});

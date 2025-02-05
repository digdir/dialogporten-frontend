import { logger } from '@digdir/dialogporten-node-logger';
import oauthPlugin, { type OAuth2Namespace } from '@fastify/oauth2';
import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
  IdportenToken,
} from 'fastify';
import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';
import config from '../config.js';

declare module 'fastify' {
  interface FastifyInstance {
    idporten: OAuth2Namespace;
    verifyToken: (
      shouldRefresh: boolean,
    ) => (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => void;
  }

  interface FastifyRequest {
    tokenIsValid: boolean;
  }

  interface IdportenToken {
    access_token: string;
    refresh_token: string;
    id_token: string;
    scope: string;
    token_type: string;
    expires_in: number;
    expires_at: string;
    refresh_token_expires_in: number;
  }

  interface IdPortenUpdatedToken {
    access_token: string;
    refresh_token_expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
    expires_in: number;
    id_token?: string;
    token_updated_at: string;
  }

  interface Session {
    token: SessionStorageToken;
    sub: string;
    locale: string;
  }
}

export interface IdTokenPayload {
  sub: string;
  locale: string;
  jwt: string;
}

/* interface is common denominator of /login and /token DTO */
export interface SessionStorageToken {
  id_token: string;
  access_token: string;
  refresh_token: string;
  refresh_token_expires_at: string;
  access_token_expires_at: string;
  scope: string;
  tokenUpdatedAt: string;
}

interface CustomOICDPluginOptions {
  oidc_url: string;
  hostname: string;
  client_id: string;
  client_secret: string;
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

export const handleLogout = async (request: FastifyRequest, reply: FastifyReply) => {
  const { oidc_url, hostname } = config;
  const token: SessionStorageToken | undefined = request.session.get('token');
  const postLogoutRedirectUri = `${hostname}/loggedout`;

  if (token?.id_token) {
    const logoutRedirectUrl = `https://login.${oidc_url}/logout?post_logout_redirect_uri=${postLogoutRedirectUri}&id_token_hint=${token.id_token}`;
    await request.session.destroy();
    reply.redirect(logoutRedirectUrl);
  } else {
    reply.code(401);
  }
};

export const handleAuthRequest = async (request: FastifyRequest, reply: FastifyReply, fastify: FastifyInstance) => {
  try {
    const now = new Date();
    const { token } = await fastify.idporten.getAccessTokenFromAuthorizationCodeFlow(request);
    const customToken: IdportenToken = token as unknown as IdportenToken;
    const refreshTokenExpiresAt = new Date(now.getTime() + customToken.refresh_token_expires_in * 1000).toISOString();
    const { sub, locale = 'nb' } = jwt.decode(token.id_token as string) as unknown as IdTokenPayload;
    const sessionStorageToken: SessionStorageToken = {
      access_token: customToken.access_token,
      access_token_expires_at: customToken.expires_at,
      id_token: customToken.id_token,
      refresh_token: customToken.refresh_token,
      refresh_token_expires_at: refreshTokenExpiresAt,
      scope: customToken.scope,
      tokenUpdatedAt: new Date().toISOString(),
    };

    request.session.set('token', sessionStorageToken);
    request.session.set('sub', sub);
    request.session.set('locale', locale);
  } catch (e) {
    logger.error(e);
    reply.status(500);
  }
};

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

  /* Post login: retrieves token, stores values to user session and redirects to client */
  fastify.get('/api/cb', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await handleAuthRequest(request, reply, fastify);
      reply.redirect('/?loggedIn=true');
    } catch (e) {
      logger.error(e);
      reply.status(500);
    }
  });

  fastify.get('/api/logout', { preHandler: fastify.verifyToken(false) }, handleLogout);
};
export default fp(plugin, {
  fastify: '4.x',
  name: 'fastify-oicd',
});
